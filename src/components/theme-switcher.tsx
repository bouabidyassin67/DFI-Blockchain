
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    toast({ title: "Theme changed!", description: `Switched to ${theme === "light" ? "dark" : "light"} mode.` });
  };

  return (
    <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
      {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
