import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const topVendors = [
  { name: "Fresh Farm Co", purchases: 45, spent: 8250, percentage: 100 },
  { name: "Dairy Direct", purchases: 38, spent: 6890, percentage: 84 },
  { name: "Meat Masters", purchases: 32, spent: 5720, percentage: 69 },
  { name: "Green Valley", purchases: 28, spent: 4560, percentage: 55 },
  { name: "Organic Fields", purchases: 22, spent: 3840, percentage: 47 },
];

export default function TopVendors() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Top Vendors</h3>
      
      <div className="space-y-4">
        {topVendors.map((vendor, index) => (
          <div key={index} data-testid={`vendor-stat-${index}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium">{vendor.name}</div>
                <div className="text-xs text-muted-foreground">{vendor.purchases} purchases</div>
              </div>
              <div className="text-sm font-semibold">${vendor.spent.toLocaleString()}</div>
            </div>
            <Progress value={vendor.percentage} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
}
