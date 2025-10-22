import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InvoiceUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
    console.log("Files dropped:", droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
      console.log("Files selected:", selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    console.log("Uploading files:", files);
  };

  return (
    <div className="space-y-6">
      <Card
        className={cn(
          "p-12 border-2 border-dashed transition-all duration-200",
          isDragging && "border-chart-3 bg-chart-3/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="dropzone-invoice"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors",
            isDragging ? "bg-chart-3 text-background" : "bg-gradient-to-br from-chart-1 to-chart-2 text-white"
          )}>
            <Upload className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-semibold mb-2">Upload Your Invoices</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Drag and drop your invoice files here, or click to browse. Supports PDF, JPG, PNG formats.
          </p>

          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            data-testid="input-file-upload"
          />
          <label htmlFor="file-upload">
            <Button asChild className="bg-chart-3 hover:bg-chart-3 text-background">
              <span data-testid="button-browse-files">
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </span>
            </Button>
          </label>

          <p className="text-xs text-muted-foreground mt-4">
            Maximum file size: 10MB per file
          </p>
        </div>
      </Card>

      {files.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Selected Files ({files.length})</h4>
          <div className="space-y-2 mb-6">
            {files.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 rounded-md bg-muted/50 hover-elevate"
                data-testid={`file-item-${index}`}
              >
                <FileText className="w-5 h-5 text-chart-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover-elevate rounded-sm"
                  data-testid={`button-remove-file-${index}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <Button 
            onClick={handleUpload} 
            className="w-full bg-gradient-to-r from-chart-1 to-chart-2"
            data-testid="button-upload-process"
          >
            Process with AI
          </Button>
        </Card>
      )}
    </div>
  );
}
