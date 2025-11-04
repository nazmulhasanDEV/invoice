import { Card } from "@/components/ui/card";
import { Receipt, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockInvoices, mockItems } from "@/lib/mockData";
import { useMemo } from "react";

export default function RecentActivity() {
  const invoices = useMemo(() => {
    const sorted = [...mockInvoices]
      .sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime())
      .slice(0, 5);
    
    return sorted.map(invoice => {
      const items = mockItems.filter(item => item.invoiceId === invoice.id);
      return {
        vendor: invoice.vendorName,
        date: invoice.invoiceDate.toISOString(),
        total: invoice.totalAmount,
        itemCount: items.length,
      };
    });
  }, []);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">
          Latest invoices and spending activity
        </p>
      </div>

      <div className="space-y-3">
        {invoices && invoices.length > 0 ? (
          invoices.map((invoice: any, index: number) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 rounded-md border hover-elevate"
              data-testid={`card-invoice-${index}`}
            >
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate" data-testid={`text-vendor-${index}`}>
                    {invoice.vendor}
                  </span>
                  {invoice.itemCount && (
                    <Badge variant="secondary" className="text-xs">
                      {invoice.itemCount} items
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(invoice.date)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold" data-testid={`text-amount-${index}`}>
                  {formatPrice(invoice.total)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No recent activity. Upload an invoice to get started.
          </div>
        )}
      </div>
    </Card>
  );
}
