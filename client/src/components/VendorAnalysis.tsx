import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, TrendingUp, TrendingDown, Calendar, DollarSign, Package, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface VendorData {
  id: string;
  name: string;
  purchases: number;
  totalSpent: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  lastPurchase: string;
  firstPurchase: string;
  priceChange: number;
  quality: number;
  reliability: number;
  avgDeliveryTime: number;
}

const mockVendors: VendorData[] = [
  {
    id: "1",
    name: "Fresh Farm Co",
    purchases: 12,
    totalSpent: 1530,
    avgPrice: 2.55,
    minPrice: 2.40,
    maxPrice: 2.70,
    lastPurchase: "2024-12-15",
    firstPurchase: "2024-01-10",
    priceChange: 5,
    quality: 4.8,
    reliability: 95,
    avgDeliveryTime: 2,
  },
  {
    id: "2",
    name: "Green Valley",
    purchases: 8,
    totalSpent: 880,
    avgPrice: 2.75,
    minPrice: 2.60,
    maxPrice: 2.90,
    lastPurchase: "2024-12-14",
    firstPurchase: "2024-02-15",
    priceChange: 8,
    quality: 4.5,
    reliability: 88,
    avgDeliveryTime: 3,
  },
  {
    id: "3",
    name: "Organic Fields",
    purchases: 5,
    totalSpent: 525,
    avgPrice: 2.95,
    minPrice: 2.85,
    maxPrice: 3.10,
    lastPurchase: "2024-12-10",
    firstPurchase: "2024-03-20",
    priceChange: 3,
    quality: 4.9,
    reliability: 92,
    avgDeliveryTime: 1,
  },
  {
    id: "4",
    name: "Market Direct",
    purchases: 6,
    totalSpent: 480,
    avgPrice: 2.40,
    minPrice: 2.30,
    maxPrice: 2.50,
    lastPurchase: "2024-12-08",
    firstPurchase: "2024-04-05",
    priceChange: -2,
    quality: 4.2,
    reliability: 85,
    avgDeliveryTime: 4,
  },
];

export default function VendorAnalysis() {
  const [selectedVendor, setSelectedVendor] = useState<VendorData | null>(null);

  const bestPrice = mockVendors.reduce((min, v) => v.avgPrice < min.avgPrice ? v : min);
  const mostPurchases = mockVendors.reduce((max, v) => v.purchases > max.purchases ? v : max);
  const highestQuality = mockVendors.reduce((max, v) => v.quality > max.quality ? v : max);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" data-testid="tab-vendor-overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison" data-testid="tab-vendor-comparison">Detailed Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-chart-3" />
                <span className="text-sm text-muted-foreground">Best Price</span>
              </div>
              <div className="font-bold">{bestPrice.name}</div>
              <div className="text-sm text-muted-foreground">${bestPrice.avgPrice.toFixed(2)}/unit</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-chart-1" />
                <span className="text-sm text-muted-foreground">Most Purchased</span>
              </div>
              <div className="font-bold">{mostPurchases.name}</div>
              <div className="text-sm text-muted-foreground">{mostPurchases.purchases} orders</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-chart-4" />
                <span className="text-sm text-muted-foreground">Highest Quality</span>
              </div>
              <div className="font-bold">{highestQuality.name}</div>
              <div className="text-sm text-muted-foreground">{highestQuality.quality} rating</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockVendors.map((vendor, index) => {
              const TrendIcon = vendor.priceChange >= 0 ? TrendingUp : TrendingDown;
              
              return (
                <Card 
                  key={vendor.id}
                  className="p-6 hover-elevate cursor-pointer"
                  onClick={() => setSelectedVendor(vendor)}
                  data-testid={`vendor-card-${index}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-chart-1/20 to-chart-2/20 flex items-center justify-center">
                        <Store className="w-5 h-5 text-chart-1" />
                      </div>
                      <div>
                        <h3 className="font-bold">{vendor.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-chart-4 text-chart-4" />
                          <span className="text-xs text-muted-foreground">{vendor.quality}</span>
                        </div>
                      </div>
                    </div>
                    {vendor.id === bestPrice.id && (
                      <Badge className="bg-chart-3 text-background">Best Price</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Purchases</div>
                      <div className="text-lg font-semibold">{vendor.purchases}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Total Spent</div>
                      <div className="text-lg font-semibold">${vendor.totalSpent}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Avg Price</div>
                      <div className="text-lg font-semibold">${vendor.avgPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Price Trend</div>
                      <div className="flex items-center gap-1">
                        <TrendIcon className={cn(
                          "w-3 h-3",
                          vendor.priceChange >= 0 ? "text-chart-4" : "text-destructive"
                        )} />
                        <span className={cn(
                          "text-sm font-semibold",
                          vendor.priceChange >= 0 ? "text-chart-4" : "text-destructive"
                        )}>
                          {vendor.priceChange >= 0 ? '+' : ''}{vendor.priceChange}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Last Purchase</span>
                      <span className="font-medium">{vendor.lastPurchase}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Vendor</th>
                    <th className="text-right p-4 font-semibold">Purchases</th>
                    <th className="text-right p-4 font-semibold">Total Spent</th>
                    <th className="text-right p-4 font-semibold">Avg Price</th>
                    <th className="text-right p-4 font-semibold">Price Range</th>
                    <th className="text-right p-4 font-semibold">Quality</th>
                    <th className="text-right p-4 font-semibold">Reliability</th>
                    <th className="text-right p-4 font-semibold">Avg Delivery</th>
                    <th className="text-right p-4 font-semibold">First Purchase</th>
                    <th className="text-right p-4 font-semibold">Last Purchase</th>
                  </tr>
                </thead>
                <tbody>
                  {mockVendors.map((vendor, index) => (
                    <tr 
                      key={vendor.id}
                      className="border-b hover-elevate cursor-pointer"
                      onClick={() => setSelectedVendor(vendor)}
                      data-testid={`vendor-row-${index}`}
                    >
                      <td className="p-4">
                        <div className="font-medium">{vendor.name}</div>
                      </td>
                      <td className="p-4 text-right">{vendor.purchases}</td>
                      <td className="p-4 text-right font-semibold">${vendor.totalSpent}</td>
                      <td className="p-4 text-right">${vendor.avgPrice.toFixed(2)}</td>
                      <td className="p-4 text-right text-sm text-muted-foreground">
                        ${vendor.minPrice.toFixed(2)} - ${vendor.maxPrice.toFixed(2)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star className="w-3 h-3 fill-chart-4 text-chart-4" />
                          <span>{vendor.quality}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">{vendor.reliability}%</td>
                      <td className="p-4 text-right">{vendor.avgDeliveryTime} days</td>
                      <td className="p-4 text-right text-sm text-muted-foreground">
                        {vendor.firstPurchase}
                      </td>
                      <td className="p-4 text-right text-sm text-muted-foreground">
                        {vendor.lastPurchase}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedVendor && (
        <Card className="p-6 border-chart-1">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">{selectedVendor.name}</h3>
              <p className="text-sm text-muted-foreground">Detailed vendor performance metrics</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedVendor(null)}
              data-testid="button-close-vendor-detail"
            >
              Close
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-md bg-muted/30">
              <div className="text-sm text-muted-foreground mb-1">Total Orders</div>
              <div className="text-2xl font-bold">{selectedVendor.purchases}</div>
            </div>
            <div className="p-4 rounded-md bg-muted/30">
              <div className="text-sm text-muted-foreground mb-1">Total Spent</div>
              <div className="text-2xl font-bold">${selectedVendor.totalSpent}</div>
            </div>
            <div className="p-4 rounded-md bg-muted/30">
              <div className="text-sm text-muted-foreground mb-1">Avg Price</div>
              <div className="text-2xl font-bold">${selectedVendor.avgPrice.toFixed(2)}</div>
            </div>
            <div className="p-4 rounded-md bg-muted/30">
              <div className="text-sm text-muted-foreground mb-1">Quality Score</div>
              <div className="text-2xl font-bold">{selectedVendor.quality}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Pricing Details</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Minimum Price</span>
                  <span className="font-semibold">${selectedVendor.minPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Maximum Price</span>
                  <span className="font-semibold">${selectedVendor.maxPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Price</span>
                  <span className="font-semibold">${selectedVendor.avgPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price Variation</span>
                  <span className="font-semibold">
                    ${(selectedVendor.maxPrice - selectedVendor.minPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Performance Metrics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Quality Rating</span>
                    <span className="font-semibold">{selectedVendor.quality}/5.0</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-chart-4" 
                      style={{ width: `${(selectedVendor.quality / 5) * 100}%` }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Reliability Score</span>
                    <span className="font-semibold">{selectedVendor.reliability}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-chart-3" 
                      style={{ width: `${selectedVendor.reliability}%` }} 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Delivery Time</span>
                  <span className="font-semibold">{selectedVendor.avgDeliveryTime} days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">First Purchase</div>
              <div className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {selectedVendor.firstPurchase}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Last Purchase</div>
              <div className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {selectedVendor.lastPurchase}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
