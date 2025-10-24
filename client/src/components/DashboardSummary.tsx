import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Package, DollarSign, FileText, Calendar } from "lucide-react";

const summaryStats = [
  {
    label: "Total Categories",
    value: "12",
    change: "+2 this month",
    trend: "up",
    icon: Package,
  },
  {
    label: "Total Invoices",
    value: "48",
    change: "+8 this month",
    trend: "up",
    icon: FileText,
  },
  {
    label: "Total Spent",
    value: "$12,458",
    change: "+12% vs last month",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Avg Price Trend",
    value: "+8.5%",
    change: "Past 6 months",
    trend: "up",
    icon: TrendingUp,
  },
];

export default function DashboardSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryStats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
        return (
          <Card key={index} className="p-6" data-testid={`summary-card-${index}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-chart-1/20 to-chart-2/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-chart-1" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendIcon className={`w-3 h-3 ${stat.trend === "up" ? "text-chart-4" : "text-destructive"}`} />
              <span className="text-muted-foreground">{stat.change}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
