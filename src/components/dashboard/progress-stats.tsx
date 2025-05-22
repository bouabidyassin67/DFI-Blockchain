
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressCircleProps {
  value: number;
  total: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

function ProgressCircle({ value, total, label, size = 120, strokeWidth = 8 }: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = value / total;
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center">
      <div className="progress-ring-container" style={{ width: size, height: size }}>
        <svg className="progress-ring" width={size} height={size}>
          <circle
            className="progress-ring"
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="progress-ring-circle"
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset: offset }}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="progress-ring-text">
          of {total}
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

export function ProgressStats() {
  return (
    <Card className="dashboard-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Progress Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProgressCircle value={1} total={18} label="Lessons in progress" />
          <ProgressCircle value={2} total={2} label="Upcoming lessons" />  
          <ProgressCircle value={0} total={2} label="Lessons complete" />
        </div>
      </CardContent>
    </Card>
  );
}
