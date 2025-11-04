import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { mockItems, mockCategories } from "@/lib/mockData";
import { useMemo } from "react";

export default function TopSpendingItems() {
  const items = useMemo(() => {
    const itemMap = new Map<string, { 
      itemName: string;
      categoryId: string;
      totalSpent: number;
      purchaseCount: number;
      prices: number[];
    }>();

    mockItems.forEach(item => {
      if (!itemMap.has(item.itemName)) {
        itemMap.set(item.itemName, {
          itemName: item.itemName,
          categoryId: item.categoryId,
          totalSpent: 0,
          purchaseCount: 0,
          prices: [],
        });
      }
      const mapItem = itemMap.get(item.itemName)!;
      mapItem.totalSpent += item.totalPrice;
      mapItem.purchaseCount++;
      mapItem.prices.push(item.unitPrice);
    });

    return Array.from(itemMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)
      .map(item => {
        const category = mockCategories.find(c => c.id === item.categoryId);
        const avgPrice = item.prices.length > 0 ? item.prices.reduce((sum, p) => sum + p, 0) / item.prices.length : 0;
        
        let trend: "up" | "down" | "stable" = "stable";
        if (item.prices.length >= 2) {
          const recentPrice = item.prices[item.prices.length - 1];
          const olderPrice = item.prices[0];
          if (recentPrice > olderPrice * 1.05) trend = "up";
          else if (recentPrice < olderPrice * 0.95) trend = "down";
        }

        return {
          itemName: item.itemName,
          category: category?.name || "Uncategorized",
          totalSpent: item.totalSpent,
          purchaseCount: item.purchaseCount,
          avgPrice: Math.round(avgPrice),
          trend,
        };
      });
  }, []);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const maxSpend = items.length > 0 ? items[0].totalSpent : 1;

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Top Spending Items</h3>
        <p className="text-sm text-muted-foreground">
          Items with highest total spending across all invoices
        </p>
      </div>

      <div className="space-y-4">
        {items && items.length > 0 ? (
          items.map((item: any, index: number) => (
            <div key={index} className="space-y-2" data-testid={`item-spending-${index}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate" data-testid={`text-item-name-${index}`}>
                      {item.itemName}
                    </span>
                    {item.trend === "up" && (
                      <TrendingUp className="w-3 h-3 text-destructive flex-shrink-0" data-testid={`icon-trend-up-${index}`} />
                    )}
                    {item.trend === "down" && (
                      <TrendingDown className="w-3 h-3 text-cyan-500 flex-shrink-0" data-testid={`icon-trend-down-${index}`} />
                    )}
                    {item.trend === "stable" && (
                      <Minus className="w-3 h-3 text-muted-foreground flex-shrink-0" data-testid={`icon-trend-stable-${index}`} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.purchaseCount} purchases</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="font-semibold text-sm" data-testid={`text-total-spent-${index}`}>
                    {formatPrice(item.totalSpent)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatPrice(item.avgPrice)} avg
                  </div>
                </div>
              </div>
              <Progress 
                value={(item.totalSpent / maxSpend) * 100} 
                className="h-2" 
                data-testid={`progress-spending-${index}`}
              />
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No spending data available. Upload invoices to see top items.
          </div>
        )}
      </div>
    </Card>
  );
}
