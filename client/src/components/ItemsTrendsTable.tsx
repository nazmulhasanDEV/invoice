import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown } from "lucide-react";
import { mockItems, mockCategories } from "@/lib/mockData";

export default function ItemsTrendsTable() {
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [trendFilter, setTrendFilter] = useState<string>("all");
  
  const items = useMemo(() => {
    const itemMap = new Map<string, {
      itemName: string;
      vendor: string;
      category: string;
      prices: Array<{ price: number; date: Date }>;
    }>();

    mockItems.forEach(item => {
      const key = `${item.itemName}-${item.vendorName}`;
      const category = mockCategories.find(c => c.id === item.categoryId);
      
      if (!itemMap.has(key)) {
        itemMap.set(key, {
          itemName: item.itemName,
          vendor: item.vendorName,
          category: category?.name || "",
          prices: [],
        });
      }
      itemMap.get(key)!.prices.push({
        price: item.unitPrice,
        date: new Date(item.purchaseDate),
      });
    });

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const ytdStart = new Date(new Date().getFullYear(), 0, 1);

    return Array.from(itemMap.values()).map(item => {
      item.prices.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      const latestPrice = item.prices[item.prices.length - 1].price;
      const lastPurchase = item.prices[item.prices.length - 1].date;

      const pricesLastWeek = item.prices.filter(p => p.date >= oneWeekAgo);
      const wowChange = pricesLastWeek.length >= 2
        ? pricesLastWeek[pricesLastWeek.length - 1].price - pricesLastWeek[0].price
        : 0;
      const wowPct = pricesLastWeek.length >= 2 && pricesLastWeek[0].price > 0
        ? (wowChange / pricesLastWeek[0].price) * 100
        : 0;

      const pricesYTD = item.prices.filter(p => p.date >= ytdStart);
      const ytdChange = pricesYTD.length >= 2
        ? pricesYTD[pricesYTD.length - 1].price - pricesYTD[0].price
        : 0;
      const ytdPct = pricesYTD.length >= 2 && pricesYTD[0].price > 0
        ? (ytdChange / pricesYTD[0].price) * 100
        : 0;

      return {
        itemName: item.itemName,
        vendor: item.vendor,
        category: item.category,
        latestPrice,
        wowChange,
        wowPct,
        ytdChange,
        ytdPct,
        lastPurchase: lastPurchase.toISOString(),
      };
    }).sort((a, b) => b.latestPrice - a.latestPrice);
  }, []);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatChange = (change: number, pct: number) => {
    const color = change > 0 ? "text-destructive" : change < 0 ? "text-cyan-500" : "text-muted-foreground";
    const icon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : null;
    const Icon = icon;
    
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {Icon && <Icon className="w-3 h-3" />}
        <span>
          {change > 0 ? "+" : ""}{formatPrice(Math.abs(change))} ({pct > 0 ? "+" : ""}{pct.toFixed(1)}%)
        </span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get unique vendors and categories for filters
  const uniqueVendors = Array.from(new Set(items.map(item => item.vendor)));
  const uniqueCategories = Array.from(new Set(items.map(item => item.category))).filter(Boolean);

  // Apply filters
  const filteredItems = items.filter(item => {
    // Vendor filter
    if (vendorFilter !== "all" && item.vendor !== vendorFilter) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== "all" && item.category !== categoryFilter) {
      return false;
    }
    
    // Trend filter
    if (trendFilter === "increasing" && item.wowChange <= 0) {
      return false;
    }
    if (trendFilter === "decreasing" && item.wowChange >= 0) {
      return false;
    }
    if (trendFilter === "stable" && item.wowChange !== 0) {
      return false;
    }
    
    return true;
  });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Items & Trends</h3>
          <p className="text-sm text-muted-foreground">
            Track price changes for individual items across vendors and time periods
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={vendorFilter} onValueChange={setVendorFilter}>
            <SelectTrigger className="w-44" data-testid="select-vendor-filter">
              <SelectValue placeholder="All Vendors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              {uniqueVendors.map((vendor: string) => (
                <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40" data-testid="select-category-filter">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((category: string) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={trendFilter} onValueChange={setTrendFilter}>
            <SelectTrigger className="w-36" data-testid="select-item-trend-filter">
              <SelectValue placeholder="All Trends" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trends</SelectItem>
              <SelectItem value="increasing">Increasing</SelectItem>
              <SelectItem value="decreasing">Decreasing</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead data-testid="header-item-name">Item</TableHead>
              <TableHead data-testid="header-vendor">Vendor</TableHead>
              <TableHead className="text-right" data-testid="header-latest-price">Latest Price</TableHead>
              <TableHead className="text-right" data-testid="header-wow-change">WoW Change</TableHead>
              <TableHead className="text-right" data-testid="header-ytd-change">YTD Change</TableHead>
              <TableHead data-testid="header-last-purchase">Last Purchase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item: any, index: number) => (
                <TableRow key={index} data-testid={`row-item-${index}`}>
                  <TableCell className="font-medium" data-testid={`cell-item-name-${index}`}>
                    {item.itemName}
                  </TableCell>
                  <TableCell data-testid={`cell-vendor-${index}`}>
                    {item.vendor}
                  </TableCell>
                  <TableCell className="text-right" data-testid={`cell-latest-price-${index}`}>
                    {formatPrice(item.latestPrice)}
                  </TableCell>
                  <TableCell className="text-right" data-testid={`cell-wow-change-${index}`}>
                    {item.wowChange !== 0 ? formatChange(item.wowChange, item.wowPct) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right" data-testid={`cell-ytd-change-${index}`}>
                    {item.ytdChange !== 0 ? formatChange(item.ytdChange, item.ytdPct) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell data-testid={`cell-last-purchase-${index}`}>
                    {formatDate(item.lastPurchase)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No items found. Upload an invoice to start tracking price trends.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
