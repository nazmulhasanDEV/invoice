import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  itemCount: number;
  totalSpent: number;
  avgPrice: number;
  priceChange: number;
}

const mockCategories: Category[] = [
  { id: "1", name: "Tomatoes", itemCount: 25, totalSpent: 2150, avgPrice: 2.65, priceChange: 8 },
  { id: "2", name: "Onions", itemCount: 18, totalSpent: 890, avgPrice: 1.95, priceChange: -3 },
  { id: "3", name: "Milk", itemCount: 32, totalSpent: 1280, avgPrice: 1.25, priceChange: 5 },
  { id: "4", name: "Chicken Breast", itemCount: 15, totalSpent: 3200, avgPrice: 8.75, priceChange: 12 },
  { id: "5", name: "Rice", itemCount: 22, totalSpent: 1540, avgPrice: 3.45, priceChange: -2 },
  { id: "6", name: "Potatoes", itemCount: 20, totalSpent: 720, avgPrice: 1.80, priceChange: 4 },
];

interface CategoryListProps {
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export default function CategoryList({ selectedId, onSelect }: CategoryListProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Categories</h3>
        <Badge variant="secondary">{mockCategories.length} total</Badge>
      </div>

      <div className="space-y-2">
        {mockCategories.map((category) => {
          const isSelected = category.id === selectedId;
          const TrendIcon = category.priceChange >= 0 ? TrendingUp : TrendingDown;
          
          return (
            <button
              key={category.id}
              onClick={() => onSelect?.(category.id)}
              className={cn(
                "w-full text-left p-3 rounded-md transition-all hover-elevate",
                isSelected && "bg-primary/10 border-l-4 border-primary"
              )}
              data-testid={`category-item-${category.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{category.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {category.itemCount}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>${category.avgPrice.toFixed(2)}/unit</span>
                    <span className="flex items-center gap-1">
                      <TrendIcon className={cn(
                        "w-3 h-3",
                        category.priceChange >= 0 ? "text-chart-4" : "text-destructive"
                      )} />
                      {Math.abs(category.priceChange)}%
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
