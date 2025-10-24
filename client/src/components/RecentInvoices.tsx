import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";

const recentInvoices = [
  { id: "INV-2024-048", vendor: "Fresh Farm Co", date: "2024-12-15", items: 12, total: 1245.50, status: "processed" },
  { id: "INV-2024-047", vendor: "Dairy Direct", date: "2024-12-14", items: 8, total: 890.00, status: "processed" },
  { id: "INV-2024-046", vendor: "Meat Masters", date: "2024-12-12", items: 5, total: 2150.75, status: "processed" },
  { id: "INV-2024-045", vendor: "Green Valley", date: "2024-12-10", items: 15, total: 1680.25, status: "processed" },
  { id: "INV-2024-044", vendor: "Organic Fields", date: "2024-12-08", items: 10, total: 1320.00, status: "processed" },
];

export default function RecentInvoices() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Invoices</h3>
        <Button variant="ghost" size="sm" data-testid="button-view-all-invoices">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {recentInvoices.map((invoice, index) => (
          <div 
            key={invoice.id}
            className="flex items-center justify-between p-3 rounded-md border hover-elevate"
            data-testid={`invoice-item-${index}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-chart-1/20 to-chart-2/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-chart-1" />
              </div>
              <div>
                <div className="font-medium">{invoice.id}</div>
                <div className="text-xs text-muted-foreground">{invoice.vendor}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-semibold">${invoice.total.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">{invoice.items} items</div>
              </div>
              <div className="text-xs text-muted-foreground min-w-20 text-right">{invoice.date}</div>
              <Badge variant="secondary" className="min-w-20 justify-center">
                {invoice.status}
              </Badge>
              <Button size="icon" variant="ghost" className="h-8 w-8" data-testid={`button-view-invoice-${index}`}>
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
