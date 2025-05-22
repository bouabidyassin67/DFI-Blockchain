
import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  receiver_id?: string;
  content: string;
  created_at: string;
  sender_avatar?: string;
  is_system?: boolean;
  room_id?: string;
}

const Communication = () => {
  const { user, profile } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState("instructor");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tableExists, setTableExists] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create messages table if it doesn't exist
  const createMessagesTable = async () => {
    try {
      // Check if table exists first
      const { error: checkError } = await supabase
        .from('messages')
        .select('count')
        .limit(1);
      
      if (checkError) {
        console.log("Messages table doesn't exist, creating it...");
        
        // Create messages table
        const { error: createError } = await supabase.rpc('create_messages_table');
        
        if (createError) {
          console.error("Error creating messages table:", createError);
          
          // Try to create table with raw SQL (fallback)
          const { error: sqlError } = await supabase.rpc('execute_sql', {
            sql: `
              CREATE TABLE IF NOT EXISTS public.messages (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                room_id TEXT,
                read BOOLEAN DEFAULT false,
                is_system BOOLEAN DEFAULT false,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
              );
              
              -- RLS Policies
              ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
              
              CREATE POLICY "Users can view messages they sent or received"
                ON public.messages FOR SELECT 
                USING (
                  auth.uid() = sender_id OR 
                  auth.uid() = receiver_id OR 
                  room_id IS NOT NULL OR
                  is_system = true
                );
              
              CREATE POLICY "Users can send messages"
                ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
            `
          });
          
          if (sqlError) {
            console.error("Failed to create messages table:", sqlError);
            return false;
          }
        }
        
        return true;
      } else {
        console.log("Messages table already exists");
        return true;
      }
    } catch (err) {
      console.error("Failed to check/create messages table:", err);
      return false;
    }
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Check if the messages table exists
  useEffect(() => {
    const checkMessagesTable = async () => {
      if (!user) return;
      
      try {
        // Try to select from the messages table
        const { error } = await supabase
          .from('messages')
          .select('count')
          .limit(1);
          
        if (error) {
          console.log("Messages table may not exist:", error);
          
          // Try to create the table
          const created = await createMessagesTable();
          setTableExists(created);
        } else {
          console.log("Messages table exists");
          setTableExists(true);
        }
      } catch (error) {
        console.error("Error checking messages table:", error);
        setTableExists(false);
      }
    };
    
    if (user) {
      checkMessagesTable();
    }
  }, [user]);
  
  // Load messages based on active chat tab
  useEffect(() => {
    const loadMessages = async () => {
      if (!user || !tableExists) return;
      
      setIsLoading(true);
      
      try {
        let query;
        
        if (activeChat === "instructor") {
          // Get direct messages with instructors
          query = supabase
            .from('messages')
            .select(`
              id,
              sender_id,
              receiver_id,
              content,
              created_at,
              profiles!sender_id (
                name,
                avatar_url,
                role
              )
            `)
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .order('created_at', { ascending: true });
        }
        else if (activeChat === "class") {
          // Get class discussion messages
          query = supabase
            .from('messages')
            .select(`
              id,
              sender_id,
              room_id,
              content,
              created_at,
              profiles!sender_id (
                name,
                avatar_url,
                role
              )
            `)
            .eq('room_id', 'class')
            .order('created_at', { ascending: true });
        }
        else {
          // Get announcements
          query = supabase
            .from('messages')
            .select(`
              id,
              sender_id,
              content,
              created_at,
              is_system,
              profiles!sender_id (
                name,
                avatar_url,
                role
              )
            `)
            .eq('is_system', true)
            .order('created_at', { ascending: true });
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching messages:", error);
          setMessages([]);
          return;
        }
        
        if (data) {
          const formattedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            sender_id: msg.sender_id,
            sender_name: msg.profiles?.name || "Unknown",
            receiver_id: msg.receiver_id,
            content: msg.content,
            created_at: msg.created_at,
            sender_avatar: msg.profiles?.avatar_url,
            is_system: msg.is_system,
            room_id: msg.room_id
          }));
          
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        toast.error("Failed to load messages");
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user && tableExists) {
      loadMessages();
    } else {
      setIsLoading(false);
    }
    
    // Set up real-time subscription to messages
    const subscription = supabase
      .channel('message-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, payload => {
        if (!user) return;
        
        const newMsg = payload.new as any;
        
        // Only add to current view if relevant to the active chat
        if (
          (activeChat === 'instructor' && (newMsg.sender_id === user?.id || newMsg.receiver_id === user?.id)) ||
          (activeChat === 'class' && newMsg.room_id === 'class') ||
          (activeChat === 'announcements' && newMsg.is_system)
        ) {
          // Fetch sender details
          supabase
            .from('profiles')
            .select('name, avatar_url')
            .eq('id', newMsg.sender_id)
            .single()
            .then(({ data: profile, error }) => {
              if (error) {
                console.error("Error fetching profile:", error);
                return;
              }
              
              const formattedMsg: Message = {
                id: newMsg.id,
                sender_id: newMsg.sender_id,
                sender_name: profile?.name || 'Unknown',
                receiver_id: newMsg.receiver_id,
                content: newMsg.content,
                created_at: newMsg.created_at,
                sender_avatar: profile?.avatar_url,
                is_system: newMsg.is_system,
                room_id: newMsg.room_id
              };
              
              setMessages(prev => [...prev, formattedMsg]);
            });
        }
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user, activeChat, tableExists]);
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.trim() || !tableExists) return;
    
    try {
      let messageData: any = {
        sender_id: user.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString()
      };
      
      if (activeChat === 'instructor') {
        // For simplicity, set a mock instructor ID
        // In a real app, you'd select a specific instructor
        messageData.receiver_id = 'a79e6cea-e2e7-4a17-9df4-1e08793c425f';
      }
      else if (activeChat === 'class') {
        messageData.room_id = 'class';
      }
      
      const { error } = await supabase
        .from('messages')
        .insert(messageData);
      
      if (error) {
        throw error;
      }
      
      setNewMessage("");
      
      // If realtime subscription isn't working, add message locally
      const localMessage: Message = {
        id: `local-${Date.now()}`,
        sender_id: user.id,
        sender_name: profile?.name || 'You',
        content: messageData.content,
        created_at: messageData.created_at,
        sender_avatar: profile?.avatar_url,
        room_id: messageData.room_id,
        receiver_id: messageData.receiver_id
      };
      
      setMessages(prev => [...prev, localMessage]);
      
      // Only show toast for first message
      if (messages.length === 0) {
        toast.success("Message sent!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  // Add placeholder instructor if none exists
  const addInstructor = async () => {
    if (!tableExists) return;
    
    try {
      // Check if there's already a message from an instructor
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('is_system', true)
        .limit(1);
        
      if (error) {
        console.error("Error checking for system messages:", error);
        return;
      }
      
      // If we don't have any system messages, let's add a welcome message
      if (!data || data.length === 0) {
        const welcomeMessage = {
          sender_id: 'a79e6cea-e2e7-4a17-9df4-1e08793c425f', // Mock instructor ID
          content: "Welcome to the learning platform! Feel free to ask any questions about your courses.",
          is_system: true,
          created_at: new Date().toISOString()
        };
        
        const { error: insertError } = await supabase
          .from('messages')
          .insert(welcomeMessage);
          
        if (insertError) {
          console.error("Error adding welcome message:", insertError);
        }
      }
    } catch (error) {
      console.error("Error in adding instructor:", error);
    }
  };
  
  // Check for welcome message
  useEffect(() => {
    if (user && tableExists && activeChat === 'instructor' && messages.length === 0 && !isLoading) {
      addInstructor();
    }
  }, [user, tableExists, activeChat, messages.length, isLoading]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Please log in</h1>
          <p className="mb-4">You must be logged in to access communications</p>
          <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Communication</h1>
              </div>

              {!tableExists && !isLoading ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Chat System Setup Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="py-8 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <h3 className="text-lg font-medium mb-2">Chat system is being set up</h3>
                      <p className="text-muted-foreground mb-4">
                        The messaging system needs to be initialized. This only needs to be done once.
                      </p>
                      <Button 
                        onClick={() => createMessagesTable().then((success) => {
                          if (success) {
                            setTableExists(true);
                            toast.success("Chat system initialized successfully!");
                          } else {
                            toast.error("Failed to initialize chat system. Please try again.");
                          }
                        })}
                      >
                        Initialize Chat System
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Tabs defaultValue="instructor" onValueChange={setActiveChat}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="instructor">Instructor Chat</TabsTrigger>
                    <TabsTrigger value="class">Class Discussion</TabsTrigger>
                    <TabsTrigger value="announcements">Announcements</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="instructor" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Chat with Instructor</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {isLoading ? (
                          <div className="h-96 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : (
                          <>
                            <div className="h-96 overflow-y-auto p-4 space-y-4 border rounded-lg">
                              {messages.length > 0 ? (
                                messages.map((message) => (
                                  <div 
                                    key={message.id} 
                                    className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                                  >
                                    <div 
                                      className={`max-w-[70%] ${
                                        message.sender_id === user?.id 
                                          ? "bg-primary text-primary-foreground" 
                                          : "bg-muted"
                                        } rounded-lg p-3`}
                                    >
                                      <div className="flex items-center mb-1">
                                        {message.sender_id !== user?.id && (
                                          <Avatar className="h-6 w-6 mr-2">
                                            <AvatarImage src={message.sender_avatar} />
                                            <AvatarFallback>{message.sender_name.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                        )}
                                        <span className="font-semibold">{message.sender_id === user?.id ? 'You' : message.sender_name}</span>
                                        <span className="ml-2 text-xs opacity-70">{formatTime(message.created_at)}</span>
                                      </div>
                                      <p className="whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-2" />
                                  <h3 className="text-lg font-medium">No messages yet</h3>
                                  <p className="text-muted-foreground">Start a conversation with your instructor</p>
                                </div>
                              )}
                              <div ref={messagesEndRef} />
                            </div>
                            
                            <form onSubmit={handleSendMessage} className="flex space-x-2">
                              <Input 
                                placeholder="Type a message..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1"
                              />
                              <Button type="submit" disabled={!newMessage.trim() || !tableExists}>
                                <Send className="h-4 w-4 mr-2" />
                                Send
                              </Button>
                            </form>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="class" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Class Discussion</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {isLoading ? (
                          <div className="h-96 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : (
                          <>
                            <div className="h-96 overflow-y-auto p-4 space-y-4 border rounded-lg">
                              {messages.length > 0 ? (
                                messages.map((message) => (
                                  <div 
                                    key={message.id} 
                                    className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                                  >
                                    <div 
                                      className={`max-w-[70%] ${
                                        message.sender_id === user?.id 
                                          ? "bg-primary text-primary-foreground" 
                                          : "bg-muted"
                                        } rounded-lg p-3`}
                                    >
                                      <div className="flex items-center mb-1">
                                        {message.sender_id !== user?.id && (
                                          <Avatar className="h-6 w-6 mr-2">
                                            <AvatarImage src={message.sender_avatar} />
                                            <AvatarFallback>{message.sender_name.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                        )}
                                        <span className="font-semibold">{message.sender_id === user?.id ? 'You' : message.sender_name}</span>
                                        <span className="ml-2 text-xs opacity-70">{formatTime(message.created_at)}</span>
                                      </div>
                                      <p className="whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-2" />
                                  <h3 className="text-lg font-medium">No messages yet</h3>
                                  <p className="text-muted-foreground">Start a discussion with your classmates</p>
                                </div>
                              )}
                              <div ref={messagesEndRef} />
                            </div>
                            
                            <form onSubmit={handleSendMessage} className="flex space-x-2">
                              <Input 
                                placeholder="Type a message..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1"
                              />
                              <Button type="submit" disabled={!newMessage.trim() || !tableExists}>
                                <Send className="h-4 w-4 mr-2" />
                                Send
                              </Button>
                            </form>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="announcements" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Announcements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoading ? (
                          <div className="h-96 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.length > 0 ? (
                              messages.map((announcement) => (
                                <Card key={announcement.id}>
                                  <CardHeader className="py-3">
                                    <div className="flex justify-between items-center">
                                      <div className="font-semibold flex items-center">
                                        <Avatar className="h-6 w-6 mr-2">
                                          <AvatarImage src={announcement.sender_avatar} />
                                          <AvatarFallback>{announcement.sender_name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {announcement.sender_name}
                                      </div>
                                      <div className="text-xs text-muted-foreground">{formatTime(announcement.created_at)}</div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="py-2">
                                    <p className="whitespace-pre-wrap">{announcement.content}</p>
                                  </CardContent>
                                </Card>
                              ))
                            ) : (
                              <div className="py-12 text-center">
                                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                                <h3 className="text-lg font-medium">No announcements</h3>
                                <p className="text-muted-foreground">There are no announcements yet</p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Communication;
