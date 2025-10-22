import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, RefreshCw, Save, X } from "lucide-react";

interface ExtractedItem {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  vendor: string;
  category: string;
  confidence: number;
}

const mockCategories = ["Vegetables", "Fruits", "Dairy", "Meat", "Grains", "Beverages"];

const mockData: ExtractedItem[] = [
  { id: "1", item: "Tomatoes", quantity: 50, unit: "kg", unitPrice: 2.5, total: 125, vendor: "Fresh Farm Co", category: "Vegetables", confidence: 98 },
  { id: "2", item: "Onions", quantity: 30, unit: "kg", unitPrice: 1.8, total: 54, vendor: "Fresh Farm Co", category: "Vegetables", confidence: 95 },
  { id: "3", item: "Milk", quantity: 100, unit: "L", unitPrice: 1.2, total: 120, vendor: "Dairy Direct", category: "Dairy", confidence: 99 },
  { id: "4", item: "Chicken Breast", quantity: 25, unit: "kg", unitPrice: 8.5, total: 212.5, vendor: "Meat Masters", category: "Meat", confidence: 97 },
];

export default function DataPreviewTable() {
  const [items, setItems] = useState<ExtractedItem[]>(mockData);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
    console.log("Editing item:", id);
  };

  const handleSave = (id: string) => {
    setEditingId(null);
    console.log("Saved item:", id);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    console.log("Deleted item:", id);
  };

  const handleReExtract = (id: string) => {
    console.log("Re-extracting item:", id);
  };

  const handleCategoryChange = (id: string, category: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, category } : item
    ));
    console.log("Category changed for item:", id, "to:", category);
  };

  const handleSaveAll = () => {
    console.log("Saving all items:", items);
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Extracted Invoice Data</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Review and categorize extracted items before saving
            </p>
          </div>
          <Button 
            onClick={handleSaveAll}
            className="bg-chart-3 hover:bg-chart-3 text-background"
            data-testid="button-save-all"
          >
            <Save className="w-4 h-4 mr-2" />
            Save All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" data-testid="table-preview">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">Item</th>
                <th className="text-left p-4 font-semibold">Quantity</th>
                <th className="text-left p-4 font-semibold">Unit Price</th>
                <th className="text-left p-4 font-semibold">Total</th>
                <th className="text-left p-4 font-semibold">Vendor</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Confidence</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr 
                  key={item.id} 
                  className="border-b hover-elevate"
                  data-testid={`row-item-${index}`}
                >
                  <td className="p-4">
                    {editingId === item.id ? (
                      <Input 
                        defaultValue={item.item} 
                        className="h-8"
                        data-testid={`input-item-${index}`}
                      />
                    ) : (
                      <span className="font-medium">{item.item}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === item.id ? (
                      <div className="flex gap-2">
                        <Input 
                          type="number" 
                          defaultValue={item.quantity} 
                          className="h-8 w-20"
                          data-testid={`input-quantity-${index}`}
                        />
                        <span className="text-sm text-muted-foreground self-center">{item.unit}</span>
                      </div>
                    ) : (
                      <span>{item.quantity} {item.unit}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === item.id ? (
                      <Input 
                        type="number" 
                        step="0.01"
                        defaultValue={item.unitPrice} 
                        className="h-8 w-24"
                        data-testid={`input-price-${index}`}
                      />
                    ) : (
                      <span>${item.unitPrice.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="p-4 font-semibold">${item.total.toFixed(2)}</td>
                  <td className="p-4 text-sm text-muted-foreground">{item.vendor}</td>
                  <td className="p-4">
                    <Select 
                      value={item.category} 
                      onValueChange={(value) => handleCategoryChange(item.id, value)}
                    >
                      <SelectTrigger className="h-8 w-32" data-testid={`select-category-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant={item.confidence >= 95 ? "default" : "secondary"}
                      className="font-mono text-xs"
                    >
                      {item.confidence}%
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {editingId === item.id ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleSave(item.id)}
                            data-testid={`button-save-${index}`}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={handleCancel}
                            data-testid={`button-cancel-${index}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEdit(item.id)}
                            data-testid={`button-edit-${index}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleReExtract(item.id)}
                            data-testid={`button-reextract-${index}`}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(item.id)}
                            data-testid={`button-delete-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
