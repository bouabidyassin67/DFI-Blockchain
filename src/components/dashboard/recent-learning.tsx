
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentLearning() {
  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Learning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Freelance Mastery</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Freelance Mastery is a comprehensive, step-by-step course designed to equip
              aspiring and existing freelancers with the essential tools, strategies, and insights
              needed to thrive in today's competitive gig economy.
            </p>
          </div>
          <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
            <div className="w-full h-full bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/lovable-uploads/e87f09cf-8db1-44ed-8f81-43ecf92e861b.png" 
                alt="Course illustration" 
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-20 bg-white dark:bg-gray-800 rounded-md shadow-lg flex flex-col items-center justify-center">
                  <div className="w-8 h-2 bg-yellow-400 rounded-full absolute -top-1" />
                  <div className="text-xl font-bold text-primary">1/18</div>
                  <div className="text-xs">Lessons</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30">
                Entry level
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Course finished: </span>
              <span>5%</span>
            </div>
          </div>

          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "5%" }} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full md:w-auto">Go to course</Button>
      </CardFooter>
    </Card>
  );
}
