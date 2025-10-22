import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { SeasonType } from "./SeasonalBadge";

interface AddCategoryDialogProps {
  trigger?: React.ReactNode;
  onAdd?: (category: { name: string; aliases: string[]; season: SeasonType; festivalName?: string }) => void;
}

export default function AddCategoryDialog({ trigger, onAdd }: AddCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [newAlias, setNewAlias] = useState("");
  const [aliases, setAliases] = useState<string[]>([]);
  const [season, setSeason] = useState<SeasonType>("year-round");
  const [festivalName, setFestivalName] = useState("");

  const handleAddAlias = () => {
    if (!newAlias.trim() || aliases.includes(newAlias.trim())) return;
    setAliases([...aliases, newAlias.trim()]);
    setNewAlias("");
  };

  const handleRemoveAlias = (alias: string) => {
    setAliases(aliases.filter(a => a !== alias));
  };

  const handleSubmit = () => {
    if (!categoryName.trim()) return;

    const newCategory = {
      name: categoryName.trim(),
      aliases,
      season,
      festivalName: season === "festival" ? festivalName.trim() : undefined,
    };

    onAdd?.(newCategory);
    console.log("New category created:", newCategory);

    // Reset form
    setCategoryName("");
    setAliases([]);
    setSeason("year-round");
    setFestivalName("");
    setNewAlias("");
    setIsOpen(false);
  };

  const handleClose = () => {
    setCategoryName("");
    setAliases([]);
    setSeason("year-round");
    setFestivalName("");
    setNewAlias("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="default"
            data-testid="button-add-category"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Define a category with aliases and seasonal information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              placeholder="e.g., Tomatoes"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              data-testid="input-category-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="season-select">Season / Type</Label>
            <Select value={season} onValueChange={(value) => setSeason(value as SeasonType)}>
              <SelectTrigger id="season-select" data-testid="select-season">
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year-round">Year-Round</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
                <SelectItem value="fall">Fall</SelectItem>
                <SelectItem value="winter">Winter</SelectItem>
                <SelectItem value="spring">Spring</SelectItem>
                <SelectItem value="festival">Festival / Holiday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {season === "festival" && (
            <div className="space-y-2">
              <Label htmlFor="festival-name">Festival / Holiday Name</Label>
              <Input
                id="festival-name"
                placeholder="e.g., Christmas, Thanksgiving"
                value={festivalName}
                onChange={(e) => setFestivalName(e.target.value)}
                data-testid="input-festival-name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="alias-input">Aliases (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="alias-input"
                placeholder="e.g., Tom, Tomato"
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAlias())}
                data-testid="input-alias"
              />
              <Button 
                type="button" 
                onClick={handleAddAlias}
                variant="outline"
                size="icon"
                data-testid="button-add-alias"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter or click + to add an alias
            </p>
          </div>

          {aliases.length > 0 && (
            <div className="space-y-2">
              <Label>Added Aliases ({aliases.length})</Label>
              <div className="flex flex-wrap gap-2 p-3 rounded-md bg-muted/30">
                {aliases.map((alias, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="gap-1"
                    data-testid={`badge-alias-${index}`}
                  >
                    {alias}
                    <button
                      onClick={() => handleRemoveAlias(alias)}
                      className="ml-1 hover:text-destructive"
                      data-testid={`button-remove-alias-${index}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              data-testid="button-cancel-category"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!categoryName.trim()}
              variant="default"
              data-testid="button-save-category"
            >
              Create Category
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
