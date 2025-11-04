import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppSidebar from "@/components/AppSidebar";
import CategoriesGrid from "@/components/CategoriesGrid";
import CategoriesTable from "@/components/CategoriesTable";
import CategoryDetail from "@/components/CategoryDetail";
import ThemeToggle from "@/components/ThemeToggle";
import AddCategoryDialog from "@/components/AddCategoryDialog";
import { Search, Grid3x3, Settings, Plus, List, ChevronLeft, ChevronRight, Filter } from "lucide-react";
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
  const [seasonFilter, setSeasonFilter] = useState<string>("all");
  const [trendFilter, setTrendFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [volatilityFilter, setVolatilityFilter] = useState<string>("all");
  const [activityFilter, setActivityFilter] = useState<string>("all");
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
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
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
                    
                    <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                      <SelectTrigger className="w-40" data-testid="select-season-filter">
                        <SelectValue placeholder="Season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Seasons</SelectItem>
                        <SelectItem value="spring">Spring</SelectItem>
                        <SelectItem value="summer">Summer</SelectItem>
                        <SelectItem value="fall">Fall</SelectItem>
                        <SelectItem value="winter">Winter</SelectItem>
                        <SelectItem value="year-round">Year-round</SelectItem>
                        <SelectItem value="festival">Festival</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={trendFilter} onValueChange={setTrendFilter}>
                      <SelectTrigger className="w-40" data-testid="select-trend-filter">
                        <SelectValue placeholder="Price Trend" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Trends</SelectItem>
                        <SelectItem value="increasing">Increasing</SelectItem>
                        <SelectItem value="decreasing">Decreasing</SelectItem>
                        <SelectItem value="stable">Stable</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={volatilityFilter} onValueChange={setVolatilityFilter}>
                      <SelectTrigger className="w-40" data-testid="select-volatility-filter">
                        <SelectValue placeholder="Volatility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Volatility</SelectItem>
                        <SelectItem value="high">High Volatility</SelectItem>
                        <SelectItem value="medium">Medium Volatility</SelectItem>
                        <SelectItem value="low">Low Volatility</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={activityFilter} onValueChange={setActivityFilter}>
                      <SelectTrigger className="w-44" data-testid="select-activity-filter">
                        <SelectValue placeholder="Activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Activity</SelectItem>
                        <SelectItem value="recent">Recently Purchased</SelectItem>
                        <SelectItem value="inactive">Not Recent</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-44" data-testid="select-sort">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="spending">Total Spending</SelectItem>
                        <SelectItem value="volatility">Price Volatility</SelectItem>
                        <SelectItem value="items">Item Count</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 ml-auto">
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
                      <AddCategoryDialog onAdd={handleAddCategory} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {viewMode === "grid" ? (
                      <Grid3x3 className="w-4 h-4" />
                    ) : (
                      <List className="w-4 h-4" />
                    )}
                    <span>{totalCategories} categories found</span>
                  </div>
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
