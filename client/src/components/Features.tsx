import { Card } from "@/components/ui/card";
import { Brain, FolderTree, TrendingUp, Bell, FileDown, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Extraction",
    description: "Gemini AI automatically extracts all invoice data with 99% accuracy—items, quantities, prices, vendors, and dates."
  },
  {
    icon: FolderTree,
    title: "Smart Categorization",
    description: "Organize extracted items into custom categories. Each category tracks purchase history and trends over time."
  },
  {
    icon: TrendingUp,
    title: "Price Analytics",
    description: "Visualize price fluctuations with interactive charts. Identify cost trends and optimize your purchasing decisions."
  },
  {
    icon: Shield,
    title: "Vendor Intelligence",
    description: "Compare vendors by unit price, frequency, and total spend. Find the most cost-effective suppliers instantly."
  },
  {
    icon: Bell,
    title: "Seasonal Alerts",
    description: "Automatic notifications for seasonal items. Never miss the optimal purchasing window for time-sensitive products."
  },
  {
    icon: FileDown,
    title: "Export & Reports",
    description: "Export your data to CSV format. Generate comprehensive reports for accounting and analysis."
  }
];

export default function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent"> Streamline Invoices</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to save time, reduce errors, and provide actionable insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="p-8 hover-elevate transition-all duration-200"
                data-testid={`card-feature-${index}`}
              >
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
