import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ChevronRight, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import SeasonalBadge, { SeasonType } from "./SeasonalBadge";

interface Category {
  id: string;
  name: string;
  itemCount: number;
  totalSpent: number;
  avgPrice: number;
  priceChange: number;
  lastPurchase: string;
  season: SeasonType;
  festivalName?: string;
}

const mockCategories: Category[] = [
  { id: "1", name: "Tomatoes", itemCount: 25, totalSpent: 2150, avgPrice: 2.65, priceChange: 8, lastPurchase: "2024-12-15", season: "summer" },
  { id: "2", name: "Onions", itemCount: 18, totalSpent: 890, avgPrice: 1.95, priceChange: -3, lastPurchase: "2024-12-14", season: "year-round" },
  { id: "3", name: "Milk", itemCount: 32, totalSpent: 1280, avgPrice: 1.25, priceChange: 5, lastPurchase: "2024-12-15", season: "year-round" },
  { id: "4", name: "Chicken Breast", itemCount: 15, totalSpent: 3200, avgPrice: 8.75, priceChange: 12, lastPurchase: "2024-12-12", season: "year-round" },
  { id: "5", name: "Rice", itemCount: 22, totalSpent: 1540, avgPrice: 3.45, priceChange: -2, lastPurchase: "2024-12-10", season: "year-round" },
  { id: "6", name: "Potatoes", itemCount: 20, totalSpent: 720, avgPrice: 1.80, priceChange: 4, lastPurchase: "2024-12-13", season: "fall" },
  { id: "7", name: "Christmas Decorations", itemCount: 8, totalSpent: 480, avgPrice: 12.50, priceChange: 25, lastPurchase: "2023-12-10", season: "festival", festivalName: "Christmas" },
  { id: "8", name: "Pumpkins", itemCount: 12, totalSpent: 360, avgPrice: 5.50, priceChange: 15, lastPurchase: "2024-10-28", season: "festival", festivalName: "Halloween" },
  { id: "9", name: "Turkey", itemCount: 4, totalSpent: 520, avgPrice: 45.00, priceChange: 18, lastPurchase: "2023-11-22", season: "festival", festivalName: "Thanksgiving" },
  { id: "10", name: "Strawberries", itemCount: 18, totalSpent: 720, avgPrice: 4.20, priceChange: 10, lastPurchase: "2024-06-15", season: "spring" },
];

interface CategoriesGridProps {
  onSelectCategory?: (categoryId: string, categoryName: string) => void;
  currentPage: number;
  itemsPerPage: number;
}

export default function CategoriesGrid({ onSelectCategory, currentPage, itemsPerPage }: CategoriesGridProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = mockCategories.slice(startIndex, endIndex);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {paginatedCategories.map((category, index) => {
        const TrendIcon = category.priceChange >= 0 ? TrendingUp : TrendingDown;
        
        return (
          <Card 
            key={category.id}
            className="p-6 hover-elevate cursor-pointer transition-all"
            onClick={() => onSelectCategory?.(category.id, category.name)}
            data-testid={`category-card-${index}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-chart-1/20 to-chart-2/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-chart-1" />
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <div className="mb-3">
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <SeasonalBadge season={category.season} festivalName={category.festivalName} size="sm" />
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              {category.itemCount} purchases
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Spent</span>
                <span className="font-semibold">${category.totalSpent.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Price</span>
                <span className="font-semibold">${category.avgPrice.toFixed(2)}/unit</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price Trend</span>
                <div className="flex items-center gap-1">
                  <TrendIcon className={cn(
                    "w-4 h-4",
                    category.priceChange >= 0 ? "text-chart-4" : "text-destructive"
                  )} />
                  <span className={cn(
                    "text-sm font-semibold",
                    category.priceChange >= 0 ? "text-chart-4" : "text-destructive"
                  )}>
                    {category.priceChange >= 0 ? '+' : ''}{category.priceChange}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Last purchase: {category.lastPurchase}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
