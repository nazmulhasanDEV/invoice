import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import InvoiceUpload from "@/components/InvoiceUpload";
import DataPreviewTable from "@/components/DataPreviewTable";
import CategoryDetail from "@/components/CategoryDetail";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar activeItem="Dashboard" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center gap-4 p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h2 className="text-xl font-semibold">Dashboard</h2>
          </header>
          
          <main className="flex-1 overflow-auto p-8">
            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList>
                <TabsTrigger value="upload" data-testid="tab-upload">Upload Invoice</TabsTrigger>
                <TabsTrigger value="preview" data-testid="tab-preview">Preview & Edit</TabsTrigger>
                <TabsTrigger value="categories" data-testid="tab-categories">Category Detail</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <InvoiceUpload />
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <DataPreviewTable />
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <CategoryDetail categoryName="Tomatoes" />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
