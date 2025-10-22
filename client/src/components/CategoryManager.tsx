import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X, Tag, Edit2, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  aliases: string[];
}

const mockCategories: Category[] = [
  { id: "1", name: "Tomatoes", aliases: ["Tom", "Tom TM", "Toma", "Tomato"] },
  { id: "2", name: "Onions", aliases: ["Onion", "Red Onion", "White Onion"] },
  { id: "3", name: "Milk", aliases: ["Whole Milk", "Skim Milk", "Dairy Milk"] },
];

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newAlias, setNewAlias] = useState("");
  const [currentAliases, setCurrentAliases] = useState<string[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      aliases: currentAliases,
    };

    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: newCategoryName, aliases: currentAliases }
          : cat
      ));
      console.log("Updated category:", newCategoryName, "with aliases:", currentAliases);
    } else {
      setCategories([...categories, newCategory]);
      console.log("Added category:", newCategoryName, "with aliases:", currentAliases);
    }

    setNewCategoryName("");
    setCurrentAliases([]);
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const handleAddAlias = () => {
    if (!newAlias.trim() || currentAliases.includes(newAlias.trim())) return;
    setCurrentAliases([...currentAliases, newAlias.trim()]);
    setNewAlias("");
  };

  const handleRemoveAlias = (alias: string) => {
    setCurrentAliases(currentAliases.filter(a => a !== alias));
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setCurrentAliases([...category.aliases]);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    console.log("Deleted category:", id);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewCategoryName("");
    setCurrentAliases([]);
    setEditingCategory(null);
    setNewAlias("");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Category Management</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create categories and define aliases for auto-matching
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => handleCloseDialog()}
              variant="default"
              data-testid="button-add-category"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Create New Category"}
              </DialogTitle>
              <DialogDescription>
                Define a category name and add aliases that should match this category
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  placeholder="e.g., Tomatoes"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  data-testid="input-category-name"
                />
              </div>

              <div className="space-y-2">
                <Label>Aliases / Alternative Names</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Add variations that should be recognized as this category
                </p>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Tom, Tom TM, Toma"
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAlias())}
                    data-testid="input-alias"
                  />
                  <Button 
                    onClick={handleAddAlias}
                    variant="outline"
                    data-testid="button-add-alias"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {currentAliases.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 p-3 rounded-md bg-muted/30">
                    {currentAliases.map((alias, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="gap-1"
                        data-testid={`badge-alias-${index}`}
                      >
                        <Tag className="w-3 h-3" />
                        {alias}
                        <button
                          onClick={() => handleRemoveAlias(alias)}
                          className="ml-1 hover-elevate rounded-sm"
                          data-testid={`button-remove-alias-${index}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCloseDialog}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-cancel-category"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  variant="default"
                  className="flex-1"
                  data-testid="button-save-category"
                >
                  {editingCategory ? "Update" : "Create"} Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {categories.map((category, index) => (
          <div 
            key={category.id}
            className="p-4 rounded-md border hover-elevate"
            data-testid={`category-item-${index}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{category.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {category.aliases.length} {category.aliases.length === 1 ? 'alias' : 'aliases'}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => handleEditCategory(category)}
                  data-testid={`button-edit-category-${index}`}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDeleteCategory(category.id)}
                  data-testid={`button-delete-category-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {category.aliases.map((alias, aliasIndex) => (
                <Badge 
                  key={aliasIndex} 
                  variant="outline"
                  className="text-xs"
                  data-testid={`alias-${index}-${aliasIndex}`}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {alias}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
