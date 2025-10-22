import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppSidebar from "@/components/AppSidebar";
import CategoriesGrid from "@/components/CategoriesGrid";
import CategoryDetail from "@/components/CategoryDetail";
import ThemeToggle from "@/components/ThemeToggle";
import { Search, Grid3x3, Settings } from "lucide-react";
import { SeasonType } from "@/components/SeasonalBadge";

const categorySeasons: Record<string, { season: SeasonType; festivalName?: string }> = {
  "Tomatoes": { season: "summer" },
  "Onions": { season: "year-round" },
  "Milk": { season: "year-round" },
  "Chicken Breast": { season: "year-round" },
  "Rice": { season: "year-round" },
  "Potatoes": { season: "fall" },
  "Christmas Decorations": { season: "festival", festivalName: "Christmas" },
  "Pumpkins": { season: "festival", festivalName: "Halloween" },
  "Turkey": { season: "festival", festivalName: "Thanksgiving" },
  "Strawberries": { season: "spring" },
};

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<{ 
    id: string; 
    name: string;
    season: SeasonType;
    festivalName?: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const handleSelectCategory = (id: string, name: string) => {
    const seasonData = categorySeasons[name] || { season: "year-round" as SeasonType };
    setSelectedCategory({ id, name, ...seasonData });
  };

  const handleBackToGrid = () => {
    setSelectedCategory(null);
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar activeItem="Categories" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedCategory ? selectedCategory.name : "All Categories"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedCategory ? "Detailed analytics and insights" : "Manage and analyze all your item categories"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!selectedCategory && (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                      data-testid="input-search-categories"
                    />
                  </div>
                  <Button variant="outline" size="icon" data-testid="button-category-settings">
                    <Settings className="w-4 h-4" />
                  </Button>
                </>
              )}
              <ThemeToggle />
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-8">
            {selectedCategory ? (
              <CategoryDetail 
                categoryName={selectedCategory.name}
                season={selectedCategory.season}
                festivalName={selectedCategory.festivalName}
                onBack={handleBackToGrid}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Grid3x3 className="w-4 h-4" />
                    <span>10 categories found</span>
                  </div>
                </div>
                
                <CategoriesGrid onSelectCategory={handleSelectCategory} />
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
