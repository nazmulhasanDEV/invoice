import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import UploadAndPreview from "@/components/UploadAndPreview";
import CategoryManager from "@/components/CategoryManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UploadInvoice() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar activeItem="Upload Invoice" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center gap-4 p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div>
              <h2 className="text-xl font-semibold">Invoice Processing</h2>
              <p className="text-sm text-muted-foreground">Upload invoices and manage categories</p>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-8">
            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList>
                <TabsTrigger value="upload" data-testid="tab-upload-invoice">
                  Upload & Preview
                </TabsTrigger>
                <TabsTrigger value="categories" data-testid="tab-manage-categories">
                  Manage Categories
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <UploadAndPreview />
              </TabsContent>

              <TabsContent value="categories">
                <CategoryManager />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
