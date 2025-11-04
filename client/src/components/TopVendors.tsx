import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { mockItems, mockInvoices } from "@/lib/mockData";
import { useMemo } from "react";

export default function TopVendors() {
  const vendors = useMemo(() => {
    const vendorMap = new Map<string, {
      vendorName: string;
      itemPrices: Map<string, number[]>;
    }>();

    mockItems.forEach(item => {
      const invoice = mockInvoices.find(inv => inv.id === item.invoiceId);
      if (invoice) {
        if (!vendorMap.has(invoice.vendorName)) {
          vendorMap.set(invoice.vendorName, {
            vendorName: invoice.vendorName,
            itemPrices: new Map(),
          });
        }
        const vendor = vendorMap.get(invoice.vendorName)!;
        if (!vendor.itemPrices.has(item.itemName)) {
          vendor.itemPrices.set(item.itemName, []);
        }
        vendor.itemPrices.get(item.itemName)!.push(item.unitPrice);
      }
    });

    return Array.from(vendorMap.values()).map(vendor => {
      let totalStability = 0;
      let itemCount = 0;

      vendor.itemPrices.forEach(prices => {
        if (prices.length > 1) {
          const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
          const variance = prices.reduce((sum, p) => sum + Math.abs(p - avg), 0) / prices.length;
          const stability = Math.max(0, 100 - (variance / avg) * 100);
          totalStability += stability;
          itemCount++;
        }
      });

      const stabilityScore = itemCount > 0 ? totalStability / itemCount : 95;

      return {
        vendorName: vendor.vendorName,
        stabilityScore,
        itemCount,
      };
    }).sort((a, b) => b.stabilityScore - a.stabilityScore);
  }, []);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Vendor Pricing Stability</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Vendors with higher scores maintain more stable prices over time
      </p>
      
      <div className="space-y-4">
        {vendors && vendors.length > 0 ? (
          vendors.slice(0, 5).map((vendor: any, index: number) => (
            <div key={index} data-testid={`vendor-stat-${index}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium">{vendor.vendorName}</div>
                  <div className="text-xs text-muted-foreground">{vendor.itemCount} items tracked</div>
                </div>
                <div className="text-sm font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-cyan-500" />
                  {vendor.stabilityScore.toFixed(1)}
                </div>
              </div>
              <Progress value={vendor.stabilityScore} className="h-2" />
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No vendor data available yet
          </p>
        )}
      </div>
    </Card>
  );
}
