
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrainCircuit, Plus, Pencil, Trash } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface IQTest {
  id: number;
  title: string;
  description: string;
  questions: number;
  timeLimit: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const IQTestManagement = () => {
  const [tests, setTests] = useState<IQTest[]>([
    {
      id: 1,
      title: "Spatial Reasoning IQ Test",
      description: "Measure your spatial intelligence and problem-solving abilities",
      questions: 30,
      timeLimit: "25 minutes",
      difficulty: "Medium",
    },
    {
      id: 2,
      title: "Logical Reasoning Test",
      description: "Test your logical thinking capabilities with pattern recognition challenges",
      questions: 25,
      timeLimit: "20 minutes",
      difficulty: "Hard",
    },
    {
      id: 3,
      title: "Verbal Intelligence Test",
      description: "Evaluate your verbal comprehension and language processing skills",
      questions: 35,
      timeLimit: "30 minutes",
      difficulty: "Easy",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<IQTest | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: 20,
    timeLimit: "20 minutes",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleDifficultyChange = (value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      difficulty: value as "Easy" | "Medium" | "Hard" 
    }));
  };

  const handleOpenDialog = (test?: IQTest) => {
    if (test) {
      setEditingTest(test);
      setFormData({
        title: test.title,
        description: test.description,
        questions: test.questions,
        timeLimit: test.timeLimit,
        difficulty: test.difficulty,
      });
    } else {
      setEditingTest(null);
      setFormData({
        title: "",
        description: "",
        questions: 20,
        timeLimit: "20 minutes",
        difficulty: "Medium",
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTest) {
      // Update existing test
      setTests(tests.map(test => 
        test.id === editingTest.id 
          ? { ...test, ...formData } 
          : test
      ));
      toast.success("IQ Test updated successfully");
    } else {
      // Create new test
      const newTest: IQTest = {
        id: tests.length > 0 ? Math.max(...tests.map(t => t.id)) + 1 : 1,
        ...formData
      };
      setTests([...tests, newTest]);
      toast.success("IQ Test created successfully");
    }
    
    setIsOpen(false);
  };

  const handleDelete = (id: number) => {
    setTests(tests.filter(test => test.id !== id));
    toast.success("IQ Test deleted successfully");
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">IQ Test Management</h1>
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Test
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{editingTest ? "Edit IQ Test" : "Create New IQ Test"}</DialogTitle>
                    <DialogDescription>
                      {editingTest 
                        ? "Update the details of this IQ test." 
                        : "Add a new IQ test to your learning platform."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Test Title</Label>
                        <Input 
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="questions">Number of Questions</Label>
                          <Input 
                            id="questions"
                            name="questions"
                            type="number"
                            value={formData.questions}
                            onChange={handleNumberInputChange}
                            min={1}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeLimit">Time Limit</Label>
                          <Input 
                            id="timeLimit"
                            name="timeLimit"
                            value={formData.timeLimit}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select 
                          value={formData.difficulty} 
                          onValueChange={handleDifficultyChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">{editingTest ? "Update" : "Create"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Manage IQ Tests</CardTitle>
                <CardDescription>
                  Create, edit, and delete IQ tests available on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Time Limit</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.title}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {test.description}
                        </TableCell>
                        <TableCell>{test.questions}</TableCell>
                        <TableCell>{test.timeLimit}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            test.difficulty === "Easy" 
                              ? "bg-green-100 text-green-800" 
                              : test.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {test.difficulty}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleOpenDialog(test)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(test.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IQTestManagement;
