import React from 'react';
import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming Button component is available
import { Input } from '@/components/ui/input'; // Assuming Input component is available
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const GlobalChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage popup open/close

  const exampleMessages = [
    { id: 1, name: 'Alice', avatarUrl: '', initials: 'A', text: 'Hey everyone!' },
    { id: 2, name: 'Bob', avatarUrl: '', initials: 'B', text: 'Hi Alice!' },
    { id: 3, name: 'Alice', avatarUrl: '', initials: 'A', text: 'How is it going?' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <>
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-72 h-96 bg-card border border-border rounded-lg shadow-xl flex flex-col overflow-hidden animate-in fade-in duration-300 slide-in-from-bottom-right">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card text-card-foreground">
            <h3 className="text-md font-semibold">Global Chat</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="hover:bg-accent hover:text-accent-foreground">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {exampleMessages.map(message => (
              <div key={message.id} className="flex items-start space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.avatarUrl} alt={message.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {message.initials} |
                  </AvatarFallback>
                </Avatar>
                <div
                  className="bg-accent border border-border rounded-lg p-2 transition-all duration-75"
                  onMouseMove={(e) => {
                    const target = e.currentTarget;
                    const rect = target.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    target.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(180, 180, 180, 0.1) 0%, rgba(180, 180, 180, 0) 50%)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '';
                  }}
                >
                  <p className="text-sm font-semibold text-foreground mb-1">{message.name}</p>
                  <p className="text-sm text-foreground">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center p-3 border-t border-border bg-background gap-2">
            <Input type="text" placeholder="Type your message..." className="flex-1 text-sm" />
            <Button size="sm">Send</Button> |
          </div>
        </div>
      )}
      <Button
        className="rounded-full h-12 w-12 flex items-center justify-center shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      </>
    </div>
  );
};

export default GlobalChatPopup;