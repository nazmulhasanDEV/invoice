import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, Calendar, Activity, DollarSign, Receipt, Package, Tag } from "lucide-react";
import { mockItems, mockInvoices, mockCategories } from "@/lib/mockData";
import { useMemo } from "react";

export default function DashboardSummary() {
  const data = useMemo(() => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgoStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisMonthInvoices = mockInvoices.filter(inv => new Date(inv.invoiceDate) >= thisMonthStart);
    const totalSpendingThisMonth = thisMonthInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const avgInvoiceAmount = mockInvoices.length > 0 ? mockInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0) / mockInvoices.length : 0;

    const categorySpending = mockItems.reduce((acc, item) => {
      const category = mockCategories.find(c => c.id === item.categoryId);
      if (category) {
        acc[category.name] = (acc[category.name] || 0) + item.totalPrice;
      }
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];

    const lastWeekItems = mockItems.filter(item => new Date(item.purchaseDate) >= lastWeekStart);
    const twoWeeksAgoItems = mockItems.filter(item => new Date(item.purchaseDate) >= twoWeeksAgoStart && new Date(item.purchaseDate) < lastWeekStart);

    const itemPriceChanges = new Map<string, { lastWeek: number, twoWeeksAgo: number }>();
    
    lastWeekItems.forEach(item => {
      const key = item.itemName;
      if (!itemPriceChanges.has(key)) {
        itemPriceChanges.set(key, { lastWeek: 0, twoWeeksAgo: 0 });
      }
      itemPriceChanges.get(key)!.lastWeek = item.unitPrice;
    });

    twoWeeksAgoItems.forEach(item => {
      const key = item.itemName;
      if (!itemPriceChanges.has(key)) {
        itemPriceChanges.set(key, { lastWeek: 0, twoWeeksAgo: 0 });
      }
      itemPriceChanges.get(key)!.twoWeeksAgo = item.unitPrice;
    });

    let itemsIncreasedThisWeek = 0;
    let itemsDecreasedThisWeek = 0;

    itemPriceChanges.forEach(prices => {
      if (prices.lastWeek > 0 && prices.twoWeeksAgo > 0) {
        if (prices.lastWeek > prices.twoWeeksAgo) {
          itemsIncreasedThisWeek++;
        } else if (prices.lastWeek < prices.twoWeeksAgo) {
          itemsDecreasedThisWeek++;
        }
      }
    });

    const sortedInvoices = [...mockInvoices].sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());
    const lastInvoice = sortedInvoices[0];

    return {
      totalSpendingThisMonth,
      avgInvoiceAmount: Math.round(avgInvoiceAmount),
      totalItemsTracked: new Set(mockItems.map(item => item.itemName)).size,
      mostPurchasedCategory: topCategory ? topCategory[0] : "N/A",
      itemsIncreasedThisWeek,
      itemsDecreasedThisWeek,
      lastInvoice: lastInvoice ? {
        vendor: lastInvoice.vendorName,
        date: lastInvoice.invoiceDate.toISOString(),
      } : null,
      trend52Week: "+8.5%",
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const summaryStats = [
    {
      label: "Items Increased This Week",
      value: data?.itemsIncreasedThisWeek || 0,
      change: "Week-over-week price changes",
      trend: "up",
      icon: ArrowUp,
    },
    {
      label: "Items Decreased This Week",
      value: data?.itemsDecreasedThisWeek || 0,
      change: "Week-over-week price changes",
      trend: "down",
      icon: ArrowDown,
    },
    {
      label: "Last Invoice",
      value: data?.lastInvoice?.vendor || "No invoices",
      change: data?.lastInvoice ? formatDate(data.lastInvoice.date) : "Upload your first invoice",
      trend: "neutral",
      icon: Calendar,
    },
    {
      label: "52-Week Trend",
      value: data?.trend52Week || "0%",
      change: "Average weekly spending",
      trend: (data?.trend52Week && data.trend52Week.startsWith("-")) ? "down" : "up",
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryStats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : stat.trend === "down" ? TrendingDown : Calendar;
        const trendColor = stat.trend === "up" ? "text-chart-4" : stat.trend === "down" ? "text-cyan-500" : "text-muted-foreground";
        
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
              <TrendIcon className={`w-3 h-3 ${trendColor}`} />
              <span className="text-muted-foreground">{stat.change}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
