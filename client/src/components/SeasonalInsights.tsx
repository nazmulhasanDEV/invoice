import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp } from "lucide-react";

const seasonalData = [
  { month: "January", purchases: 2, trend: "low" },
  { month: "February", purchases: 3, trend: "low" },
  { month: "March", purchases: 4, trend: "medium" },
  { month: "April", purchases: 5, trend: "medium" },
  { month: "May", purchases: 8, trend: "high" },
  { month: "June", purchases: 10, trend: "peak" },
  { month: "July", purchases: 9, trend: "high" },
  { month: "August", purchases: 7, trend: "high" },
  { month: "September", purchases: 5, trend: "medium" },
  { month: "October", purchases: 4, trend: "medium" },
  { month: "November", purchases: 3, trend: "low" },
  { month: "December", purchases: 3, trend: "low" },
];

export default function SeasonalInsights() {
  const peakMonths = seasonalData.filter(d => d.trend === "peak" || d.trend === "high");
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-chart-1" />
        Seasonal Purchase Pattern
      </h3>

      <div className="space-y-4">
        <div className="p-4 rounded-md bg-chart-4/10 border border-chart-4/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-chart-4" />
            <span className="font-medium text-sm">Peak Season Detected</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Historical data shows increased purchases during specific months
          </p>
          <div className="flex flex-wrap gap-2">
            {peakMonths.map((month, index) => (
              <Badge key={index} className="bg-chart-4 text-white">
                {month.month}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {seasonalData.map((data, index) => (
            <div 
              key={index}
              className="p-2 rounded-md text-center text-xs"
              style={{
                backgroundColor: 
                  data.trend === "peak" ? "hsl(142, 71%, 45%, 0.2)" :
                  data.trend === "high" ? "hsl(142, 71%, 45%, 0.15)" :
                  data.trend === "medium" ? "hsl(var(--muted))" :
                  "hsl(var(--muted), 0.5)"
              }}
              data-testid={`season-${index}`}
            >
              <div className="font-medium">{data.month.slice(0, 3)}</div>
              <div className="text-muted-foreground">{data.purchases}</div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Recommendation:</span> Stock up in May-August when demand is highest
          </p>
        </div>
      </div>
    </Card>
  );
}
