import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import PriceChart from "./PriceChart";
import SeasonalInsights from "./SeasonalInsights";

const mockPurchaseHistory = [
  { date: "2024-12-15", vendor: "Fresh Farm Co", quantity: 50, unit: "kg", unitPrice: 2.5, total: 125 },
  { date: "2024-12-01", vendor: "Green Valley", quantity: 40, unit: "kg", unitPrice: 2.8, total: 112 },
  { date: "2024-11-15", vendor: "Fresh Farm Co", quantity: 45, unit: "kg", unitPrice: 2.6, total: 117 },
  { date: "2024-11-01", vendor: "Organic Fields", quantity: 35, unit: "kg", unitPrice: 3.0, total: 105 },
];

const vendorAnalysis = [
  { vendor: "Fresh Farm Co", purchases: 12, avgPrice: 2.55, totalSpent: 1530 },
  { vendor: "Green Valley", purchases: 8, avgPrice: 2.75, totalSpent: 880 },
  { vendor: "Organic Fields", purchases: 5, avgPrice: 2.95, totalSpent: 525 },
];

interface CategoryDetailProps {
  categoryName?: string;
  onBack?: () => void;
}

export default function CategoryDetail({ categoryName = "Tomatoes", onBack }: CategoryDetailProps) {
  const handleExport = () => {
    console.log("Exporting data to CSV");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              data-testid="button-back-categories"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
            <p className="text-muted-foreground">Complete purchase history and analytics</p>
          </div>
        </div>
        <Button 
          onClick={handleExport}
          className="bg-chart-3 hover:bg-chart-3 text-background"
          data-testid="button-export-csv"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Purchases</span>
            <TrendingUp className="w-4 h-4 text-chart-4" />
          </div>
          <div className="text-3xl font-bold">25</div>
          <p className="text-xs text-muted-foreground mt-1">Last 12 months</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Unit Price</span>
          </div>
          <div className="text-3xl font-bold">$2.65</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-chart-4" />
            <span className="text-xs text-chart-4">+8% vs last year</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Top Vendor</span>
          </div>
          <div className="text-xl font-bold mb-1">Fresh Farm Co</div>
          <p className="text-xs text-muted-foreground">12 purchases</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Price Trend</span>
          </div>
          <div className="text-3xl font-bold text-chart-4">+12%</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-chart-4" />
            <span className="text-xs text-muted-foreground">Past 6 months</span>
          </div>
        </Card>
      </div>

      <PriceChart title="Price Fluctuation Analysis" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SeasonalInsights />

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Vendor Analysis</h3>
          <div className="space-y-3">
            {vendorAnalysis.map((vendor, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover-elevate"
                data-testid={`vendor-${index}`}
              >
                <div className="flex-1">
                  <div className="font-medium">{vendor.vendor}</div>
                  <div className="text-xs text-muted-foreground">{vendor.purchases} purchases</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${vendor.avgPrice.toFixed(2)}/unit</div>
                  <div className="text-xs text-muted-foreground">${vendor.totalSpent} total</div>
                </div>
                {index === 0 && (
                  <Badge className="ml-2 bg-chart-3 text-background">Best Price</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Purchases</h3>
          <div className="space-y-3">
            {mockPurchaseHistory.map((purchase, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-md border hover-elevate"
                data-testid={`purchase-${index}`}
              >
                <div>
                  <div className="font-medium">{purchase.vendor}</div>
                  <div className="text-xs text-muted-foreground">{purchase.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${purchase.total.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    {purchase.quantity} {purchase.unit} @ ${purchase.unitPrice}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Quality Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Consistency Score</span>
                <span className="font-semibold">92%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-chart-1 to-chart-2" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Price Stability</span>
                <span className="font-semibold">85%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-4" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Availability</span>
                <span className="font-semibold">98%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-3" style={{ width: '98%' }} />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">4.8</div>
                  <div className="text-xs text-muted-foreground">Avg Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs text-muted-foreground">Vendors</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
