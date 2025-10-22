import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppSidebar from "@/components/AppSidebar";
import CategoriesGrid from "@/components/CategoriesGrid";
import CategoriesTable from "@/components/CategoriesTable";
import CategoryDetail from "@/components/CategoryDetail";
import ThemeToggle from "@/components/ThemeToggle";
import AddCategoryDialog from "@/components/AddCategoryDialog";
import { Search, Grid3x3, Settings, Plus, List, ChevronLeft, ChevronRight } from "lucide-react";
import { SeasonType } from "@/components/SeasonalBadge";
import { useToast } from "@/hooks/use-toast";

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
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalCategories = 10;
  const totalPages = Math.ceil(totalCategories / itemsPerPage);
  const { toast } = useToast();
  
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

  const handleAddCategory = (category: { name: string; aliases: string[]; season: SeasonType; festivalName?: string }) => {
    console.log("Category added:", category);
    toast({
      title: "Category Created",
      description: `${category.name} has been added successfully with ${category.aliases.length} aliases.`,
    });
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
                  <div className="flex items-center border rounded-md">
                    <Button 
                      variant={viewMode === "grid" ? "default" : "ghost"} 
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                      data-testid="button-view-grid"
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant={viewMode === "table" ? "default" : "ghost"} 
                      size="icon"
                      onClick={() => setViewMode("table")}
                      className="rounded-l-none"
                      data-testid="button-view-table"
                    >
                      <List className="w-4 h-4" />
                    </Button>
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
                    {viewMode === "grid" ? (
                      <Grid3x3 className="w-4 h-4" />
                    ) : (
                      <List className="w-4 h-4" />
                    )}
                    <span>{totalCategories} categories found</span>
                  </div>
                  <AddCategoryDialog onAdd={handleAddCategory} />
                </div>
                
                {viewMode === "grid" ? (
                  <CategoriesGrid 
                    onSelectCategory={handleSelectCategory}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                  />
                ) : (
                  <CategoriesTable 
                    onSelectCategory={handleSelectCategory}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                  />
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCategories)} of {totalCategories} categories
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        data-testid="button-prev-page"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-9"
                            data-testid={`button-page-${page}`}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        data-testid="button-next-page"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
