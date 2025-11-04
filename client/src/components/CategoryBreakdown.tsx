import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { mockItems, mockCategories } from "@/lib/mockData";
import { useMemo } from "react";

export default function CategoryBreakdown() {
  const categories = useMemo(() => {
    const categoryMap = new Map<string, { 
      name: string;
      totalSpent: number;
      itemCount: Set<string>;
      purchaseCount: number;
    }>();

    mockItems.forEach(item => {
      const category = mockCategories.find(c => c.id === item.categoryId);
      if (category) {
        if (!categoryMap.has(category.id)) {
          categoryMap.set(category.id, {
            name: category.name,
            totalSpent: 0,
            itemCount: new Set(),
            purchaseCount: 0,
          });
        }
        const cat = categoryMap.get(category.id)!;
        cat.totalSpent += item.totalPrice;
        cat.itemCount.add(item.itemName);
        cat.purchaseCount++;
      }
    });

    return Array.from(categoryMap.values())
      .map(cat => ({
        name: cat.name,
        totalSpent: cat.totalSpent,
        itemCount: cat.itemCount.size,
        purchaseCount: cat.purchaseCount,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 6);
  }, []);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const totalSpending = categories.reduce((sum, cat) => sum + cat.totalSpent, 0);

  const getColorClass = (index: number) => {
    const colors = [
      "bg-primary/20 border-primary/40",
      "bg-cyan-500/20 border-cyan-500/40",
      "bg-purple-500/20 border-purple-500/40",
      "bg-blue-500/20 border-blue-500/40",
      "bg-indigo-500/20 border-indigo-500/40",
      "bg-pink-500/20 border-pink-500/40",
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Category Breakdown</h3>
        <p className="text-sm text-muted-foreground">
          Spending distribution across item categories
        </p>
      </div>

      <div className="space-y-3">
        {categories && categories.length > 0 ? (
          categories.map((category: any, index: number) => {
            const percentage = totalSpending > 0 ? (category.totalSpent / totalSpending) * 100 : 0;
            return (
              <div 
                key={index} 
                className={`p-4 rounded-md border ${getColorClass(index)}`}
                data-testid={`card-category-${index}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="font-medium" data-testid={`text-category-name-${index}`}>
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold" data-testid={`text-category-spent-${index}`}>
                      {formatPrice(category.totalSpent)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}% of total
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{category.itemCount} items</span>
                  <span>{category.purchaseCount} purchases</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No category data available. Upload invoices to see breakdown.
          </div>
        )}
      </div>
    </Card>
  );
}
