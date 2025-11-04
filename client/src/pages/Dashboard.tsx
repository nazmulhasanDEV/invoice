import { useState } from "react";
import { useLocation } from "wouter";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import AppSidebar from "@/components/AppSidebar";
import DashboardSummary from "@/components/DashboardSummary";
import CategoryList from "@/components/CategoryList";
import CategoryDetail from "@/components/CategoryDetail";
import ItemsTrendsTable from "@/components/ItemsTrendsTable";
import TopVendors from "@/components/TopVendors";
import SpendingTrends from "@/components/SpendingTrends";
import VendorComparison from "@/components/VendorComparison";
import TopSpendingItems from "@/components/TopSpendingItems";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import RecentActivity from "@/components/RecentActivity";
import ThemeToggle from "@/components/ThemeToggle";
import { Upload } from "lucide-react";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log("Selected category:", categoryId);
  };

  const handleUploadClick = () => {
    setLocation("/upload");
  };

  const categoryNames: Record<string, string> = {
    "1": "Tomatoes",
    "2": "Onions",
    "3": "Milk",
    "4": "Chicken Breast",
    "5": "Rice",
    "6": "Potatoes",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar activeItem="Dashboard" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h2 className="text-xl font-semibold">Dashboard Overview</h2>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                onClick={handleUploadClick}
                variant="default"
                data-testid="button-upload-invoice-header"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Invoice
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            <div className="p-4 space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
                <p className="text-muted-foreground text-sm">Here's a comprehensive overview of your invoice analytics</p>
              </div>

              <DashboardSummary />

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2 space-y-4">
                  <ItemsTrendsTable />
                  <VendorComparison />
                  <SpendingTrends />
                </div>

                <div className="space-y-4">
                  <TopVendors />
                  <CategoryList 
                    selectedId={selectedCategory || undefined} 
                    onSelect={handleCategorySelect} 
                  />
                  <CategoryBreakdown />
                  <RecentActivity />
                  <TopSpendingItems />
                </div>
              </div>

              {selectedCategory && (
                <div className="mt-4">
                  <CategoryDetail categoryName={categoryNames[selectedCategory] || "Category"} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
