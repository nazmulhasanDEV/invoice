import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardSummary from "@/components/DashboardSummary";
import CategoryList from "@/components/CategoryList";
import UploadAndPreview from "@/components/UploadAndPreview";
import CategoryDetail from "@/components/CategoryDetail";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log("Selected category:", categoryId);
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
          <header className="flex items-center gap-4 p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h2 className="text-xl font-semibold">Dashboard Overview</h2>
          </header>
          
          <main className="flex-1 overflow-auto">
            <div className="p-8 space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">Here's an overview of your invoice analytics</p>
              </div>

              <DashboardSummary />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <CategoryList 
                    selectedId={selectedCategory || undefined} 
                    onSelect={handleCategorySelect} 
                  />
                </div>

                <div className="lg:col-span-2">
                  {selectedCategory ? (
                    <CategoryDetail categoryName={categoryNames[selectedCategory] || "Category"} />
                  ) : (
                    <UploadAndPreview />
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
