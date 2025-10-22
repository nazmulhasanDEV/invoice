import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Eye } from "lucide-react";
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

interface CategoriesTableProps {
  onSelectCategory?: (categoryId: string, categoryName: string) => void;
  currentPage: number;
  itemsPerPage: number;
}

export default function CategoriesTable({ onSelectCategory, currentPage, itemsPerPage }: CategoriesTableProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = mockCategories.slice(startIndex, endIndex);

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" data-testid="table-categories">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">Category</th>
              <th className="text-left p-4 font-semibold">Season</th>
              <th className="text-right p-4 font-semibold">Purchases</th>
              <th className="text-right p-4 font-semibold">Total Spent</th>
              <th className="text-right p-4 font-semibold">Avg Price</th>
              <th className="text-right p-4 font-semibold">Price Trend</th>
              <th className="text-left p-4 font-semibold">Last Purchase</th>
              <th className="text-center p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((category, index) => {
              const TrendIcon = category.priceChange >= 0 ? TrendingUp : TrendingDown;
              
              return (
                <tr 
                  key={category.id}
                  className="border-b hover-elevate"
                  data-testid={`category-row-${index}`}
                >
                  <td className="p-4">
                    <div className="font-semibold">{category.name}</div>
                  </td>
                  <td className="p-4">
                    <SeasonalBadge 
                      season={category.season} 
                      festivalName={category.festivalName} 
                      size="sm" 
                    />
                  </td>
                  <td className="p-4 text-right text-muted-foreground">
                    {category.itemCount}
                  </td>
                  <td className="p-4 text-right font-semibold">
                    ${category.totalSpent.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    ${category.avgPrice.toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
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
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {category.lastPurchase}
                  </td>
                  <td className="p-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectCategory?.(category.id, category.name)}
                      data-testid={`button-view-${index}`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
