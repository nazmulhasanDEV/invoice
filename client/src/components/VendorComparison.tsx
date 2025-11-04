import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockInvoices, mockItems } from "@/lib/mockData";
import { useMemo } from "react";

export default function VendorComparison() {
  const vendors = useMemo(() => {
    const vendorMap = new Map<string, { 
      name: string; 
      totalSpent: number; 
      invoiceCount: number; 
      itemPrices: Map<string, number[]>; 
    }>();

    mockInvoices.forEach(invoice => {
      if (!vendorMap.has(invoice.vendorName)) {
        vendorMap.set(invoice.vendorName, {
          name: invoice.vendorName,
          totalSpent: 0,
          invoiceCount: 0,
          itemPrices: new Map(),
        });
      }
      const vendor = vendorMap.get(invoice.vendorName)!;
      vendor.totalSpent += invoice.totalAmount;
      vendor.invoiceCount++;
    });

    mockItems.forEach(item => {
      const invoice = mockInvoices.find(inv => inv.id === item.invoiceId);
      if (invoice && vendorMap.has(invoice.vendorName)) {
        const vendor = vendorMap.get(invoice.vendorName)!;
        if (!vendor.itemPrices.has(item.itemName)) {
          vendor.itemPrices.set(item.itemName, []);
        }
        vendor.itemPrices.get(item.itemName)!.push(item.unitPrice);
      }
    });

    return Array.from(vendorMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .map((vendor, index) => {
        const avgInvoice = vendor.invoiceCount > 0 ? vendor.totalSpent / vendor.invoiceCount : 0;
        
        let totalVariance = 0;
        let itemCount = 0;
        vendor.itemPrices.forEach(prices => {
          if (prices.length > 1) {
            const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
            const variance = prices.reduce((sum, p) => sum + Math.abs(p - avg), 0) / prices.length;
            totalVariance += variance / avg;
            itemCount++;
          }
        });
        
        const stabilityScore = itemCount > 0 ? Math.max(0, 100 - (totalVariance / itemCount) * 100) : 95;
        const priceChange = (Math.random() - 0.5) * 10;

        return {
          name: vendor.name,
          totalSpent: vendor.totalSpent,
          avgInvoice: Math.round(avgInvoice),
          invoiceCount: vendor.invoiceCount,
          stabilityScore: Math.round(stabilityScore),
          priceChange,
          isBestPrice: index === 0,
        };
      });
  }, []);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStabilityBadge = (score: number) => {
    if (score >= 90) {
      return <Badge variant="default" className="bg-cyan-500/20 text-cyan-500 border-cyan-500/30">Excellent</Badge>;
    } else if (score >= 70) {
      return <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">Good</Badge>;
    } else if (score >= 50) {
      return <Badge variant="secondary">Fair</Badge>;
    } else {
      return <Badge variant="destructive">Volatile</Badge>;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Vendor Comparison</h3>
          <p className="text-sm text-muted-foreground">
            Compare vendor performance, pricing, and stability
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead data-testid="header-vendor-name">Vendor</TableHead>
              <TableHead className="text-right" data-testid="header-total-spent">Total Spent</TableHead>
              <TableHead className="text-right" data-testid="header-avg-invoice">Avg Invoice</TableHead>
              <TableHead className="text-right" data-testid="header-invoice-count">Invoices</TableHead>
              <TableHead className="text-center" data-testid="header-stability">Price Stability</TableHead>
              <TableHead className="text-center" data-testid="header-trend">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors && vendors.length > 0 ? (
              vendors.map((vendor: any, index: number) => (
                <TableRow key={index} data-testid={`row-vendor-${index}`}>
                  <TableCell className="font-medium" data-testid={`cell-vendor-name-${index}`}>
                    <div className="flex items-center gap-2">
                      {vendor.isBestPrice && (
                        <Award className="w-4 h-4 text-cyan-500" data-testid={`icon-best-price-${index}`} />
                      )}
                      {vendor.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right" data-testid={`cell-total-spent-${index}`}>
                    {formatPrice(vendor.totalSpent)}
                  </TableCell>
                  <TableCell className="text-right" data-testid={`cell-avg-invoice-${index}`}>
                    {formatPrice(vendor.avgInvoice)}
                  </TableCell>
                  <TableCell className="text-right" data-testid={`cell-invoice-count-${index}`}>
                    {vendor.invoiceCount}
                  </TableCell>
                  <TableCell className="text-center" data-testid={`cell-stability-${index}`}>
                    {getStabilityBadge(vendor.stabilityScore)}
                  </TableCell>
                  <TableCell className="text-center" data-testid={`cell-trend-${index}`}>
                    {vendor.priceChange > 0 ? (
                      <div className="flex items-center justify-center gap-1 text-destructive">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">+{vendor.priceChange.toFixed(1)}%</span>
                      </div>
                    ) : vendor.priceChange < 0 ? (
                      <div className="flex items-center justify-center gap-1 text-cyan-500">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm">{vendor.priceChange.toFixed(1)}%</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No vendor data available. Upload invoices to see vendor comparisons.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
