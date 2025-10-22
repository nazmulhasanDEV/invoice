import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import UploadAndPreview from "@/components/UploadAndPreview";

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
              <h2 className="text-xl font-semibold">Upload Invoice</h2>
              <p className="text-sm text-muted-foreground">Upload and review invoice data extraction</p>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-8">
            <UploadAndPreview />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
