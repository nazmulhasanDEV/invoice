import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, Edit2, Trash2, RefreshCw, Save, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExtractedItem {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  vendor: string;
  category: string;
  confidence: number;
}

const mockCategories = ["Vegetables", "Fruits", "Dairy", "Meat", "Grains", "Beverages"];

const mockExtractedData: ExtractedItem[] = [
  { id: "1", item: "Tomatoes", quantity: 50, unit: "kg", unitPrice: 2.5, total: 125, vendor: "Fresh Farm Co", category: "Vegetables", confidence: 98 },
  { id: "2", item: "Onions", quantity: 30, unit: "kg", unitPrice: 1.8, total: 54, vendor: "Fresh Farm Co", category: "Vegetables", confidence: 95 },
  { id: "3", item: "Milk", quantity: 100, unit: "L", unitPrice: 1.2, total: 120, vendor: "Dairy Direct", category: "Dairy", confidence: 99 },
];

export default function UploadAndPreview() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isReExtracting, setIsReExtracting] = useState(false);

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
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = () => {
    setIsProcessing(true);
    console.log("Processing files with AI...", files);
    setTimeout(() => {
      setExtractedItems(mockExtractedData);
      setIsProcessing(false);
    }, 1500);
  };

  const handleSaveAll = () => {
    console.log("Saving all items:", extractedItems);
    setFiles([]);
    setExtractedItems([]);
  };

  const handleCategoryChange = (id: string, category: string) => {
    setExtractedItems(items => items.map(item => 
      item.id === id ? { ...item, category } : item
    ));
  };

  const handleDelete = (id: string) => {
    setExtractedItems(items => items.filter(item => item.id !== id));
  };

  const handleReExtract = () => {
    if (!feedback.trim()) {
      console.log("Please provide feedback");
      return;
    }
    
    setIsReExtracting(true);
    console.log("Re-extracting with feedback:", feedback);
    
    setTimeout(() => {
      console.log("AI re-extraction complete with feedback:", feedback);
      setIsReExtracting(false);
      setFeedback("");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card
        className={cn(
          "p-8 border-2 border-dashed transition-all duration-200",
          isDragging && "border-chart-3 bg-chart-3/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="dropzone-upload"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
            isDragging ? "bg-chart-3 text-background" : "bg-gradient-to-br from-chart-1 to-chart-2 text-white"
          )}>
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-semibold mb-2">Upload Invoice</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            Drag and drop files or click to browse. Supports PDF, JPG, PNG
          </p>

          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload-main"
            data-testid="input-file-upload-main"
          />
          <label htmlFor="file-upload-main">
            <Button asChild size="sm" className="bg-chart-3 hover:bg-chart-3 text-background">
              <span data-testid="button-browse">Browse Files</span>
            </Button>
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="space-y-2 mb-4">
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-2 rounded-md bg-muted/30"
                  data-testid={`uploaded-file-${index}`}
                >
                  <FileText className="w-4 h-4 text-chart-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover-elevate rounded-sm"
                    data-testid={`button-remove-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleProcess} 
              className="w-full bg-gradient-to-r from-chart-1 to-chart-2"
              disabled={isProcessing}
              data-testid="button-process-ai"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Processing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Extract Data with AI
                </>
              )}
            </Button>
          </div>
        )}
      </Card>

      {extractedItems.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">Extracted Data Preview</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Review and categorize before saving
              </p>
            </div>
            <Button 
              onClick={handleSaveAll}
              className="bg-chart-3 hover:bg-chart-3 text-background"
              data-testid="button-save-all-items"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All
            </Button>
          </div>

          <div className="mb-6 p-4 rounded-md bg-muted/30 border">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-chart-1 mt-1 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div>
                  <h4 className="font-medium mb-1">Missing or Incorrect Data?</h4>
                  <p className="text-sm text-muted-foreground">
                    Describe what's missing or needs correction, and we'll re-extract the data using AI.
                  </p>
                </div>
                <Textarea
                  placeholder="Example: Missing unit for Tomatoes, incorrect price for Onions, vendor name is not extracted..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-20"
                  data-testid="textarea-feedback"
                />
                <Button 
                  onClick={handleReExtract}
                  disabled={!feedback.trim() || isReExtracting}
                  variant="outline"
                  className="w-full sm:w-auto"
                  data-testid="button-reextract-feedback"
                >
                  {isReExtracting ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                      Re-extracting with AI...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Re-Extract with Feedback
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" data-testid="table-extracted-preview">
              <thead>
                <tr className="border-b text-sm">
                  <th className="text-left p-3 font-semibold">Item</th>
                  <th className="text-left p-3 font-semibold">Qty</th>
                  <th className="text-left p-3 font-semibold">Price</th>
                  <th className="text-left p-3 font-semibold">Total</th>
                  <th className="text-left p-3 font-semibold">Vendor</th>
                  <th className="text-left p-3 font-semibold">Category</th>
                  <th className="text-left p-3 font-semibold">AI</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {extractedItems.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className="border-b hover-elevate text-sm"
                    data-testid={`preview-row-${index}`}
                  >
                    <td className="p-3 font-medium">{item.item}</td>
                    <td className="p-3">{item.quantity} {item.unit}</td>
                    <td className="p-3">${item.unitPrice.toFixed(2)}</td>
                    <td className="p-3 font-semibold">${item.total.toFixed(2)}</td>
                    <td className="p-3 text-muted-foreground">{item.vendor}</td>
                    <td className="p-3">
                      <Select 
                        value={item.category} 
                        onValueChange={(value) => handleCategoryChange(item.id, value)}
                      >
                        <SelectTrigger className="h-8 w-32" data-testid={`select-preview-category-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={item.confidence >= 95 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {item.confidence}%
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => console.log("Re-extract", item.id)}
                          data-testid={`button-preview-reextract-${index}`}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(item.id)}
                          data-testid={`button-preview-delete-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
