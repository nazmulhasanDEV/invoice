import { useState } from "react";
import { useLocation } from "wouter";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import AppSidebar from "@/components/AppSidebar";
import DashboardSummary from "@/components/DashboardSummary";
import CategoryList from "@/components/CategoryList";
import CategoryDetail from "@/components/CategoryDetail";
import RecentInvoices from "@/components/RecentInvoices";
import TopVendors from "@/components/TopVendors";
import SpendingTrends from "@/components/SpendingTrends";
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
            <Button 
              onClick={handleUploadClick}
              className="bg-chart-3 hover:bg-chart-3 text-background"
              data-testid="button-upload-invoice-header"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Invoice
            </Button>
          </header>
          
          <main className="flex-1 overflow-auto">
            <div className="p-8 space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">Here's a comprehensive overview of your invoice analytics</p>
              </div>

              <DashboardSummary />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <SpendingTrends />
                  <RecentInvoices />
                </div>

                <div className="space-y-6">
                  <CategoryList 
                    selectedId={selectedCategory || undefined} 
                    onSelect={handleCategorySelect} 
                  />
                  <TopVendors />
                </div>
              </div>

              {selectedCategory && (
                <div className="mt-6">
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
