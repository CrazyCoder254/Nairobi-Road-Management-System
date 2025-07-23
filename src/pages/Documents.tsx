import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Upload, Plus, Search, Calendar, User, Car, Building2, Filter, Eye, Edit, Trash2, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  title: string;
  type: string;
  category: "vehicle" | "driver" | "sacco" | "terminus" | "compliance";
  status: "active" | "expired" | "pending" | "rejected";
  uploadDate: string;
  expiryDate?: string;
  fileSize: string;
  uploadedBy: string;
  entityId: string;
  entityName: string;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Vehicle Registration Certificate",
    type: "PDF",
    category: "vehicle",
    status: "active",
    uploadDate: "2024-01-15",
    expiryDate: "2025-01-15",
    fileSize: "2.3 MB",
    uploadedBy: "John Kamau",
    entityId: "KBZ-123A",
    entityName: "KBZ-123A Nissan Matatu"
  },
  {
    id: "2",
    title: "Driving License",
    type: "PDF",
    category: "driver",
    status: "active",
    uploadDate: "2024-02-10",
    expiryDate: "2026-02-10",
    fileSize: "1.8 MB",
    uploadedBy: "Mary Wanjiku",
    entityId: "DL001",
    entityName: "Peter Mwangi"
  },
  {
    id: "3",
    title: "SACCO Operating License",
    type: "PDF",
    category: "sacco",
    status: "expired",
    uploadDate: "2023-06-01",
    expiryDate: "2024-06-01",
    fileSize: "3.1 MB",
    uploadedBy: "Admin User",
    entityId: "SAC001",
    entityName: "Nairobi Express SACCO"
  },
  {
    id: "4",
    title: "Insurance Certificate",
    type: "PDF",
    category: "vehicle",
    status: "pending",
    uploadDate: "2024-03-20",
    expiryDate: "2025-03-20",
    fileSize: "2.7 MB",
    uploadedBy: "James Ochieng",
    entityId: "KCA-456B",
    entityName: "KCA-456B Toyota Hiace"
  },
  {
    id: "5",
    title: "Terminus Compliance Report",
    type: "DOCX",
    category: "terminus",
    status: "active",
    uploadDate: "2024-03-01",
    fileSize: "1.2 MB",
    uploadedBy: "Sarah Njeri",
    entityId: "TER001",
    entityName: "CBD Terminus"
  }
];

export const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: Document["status"]) => {
    const statusConfig = {
      active: { variant: "success" as const, icon: CheckCircle, label: "Active" },
      expired: { variant: "destructive" as const, icon: XCircle, label: "Expired" },
      pending: { variant: "warning" as const, icon: Clock, label: "Pending" },
      rejected: { variant: "destructive" as const, icon: XCircle, label: "Rejected" }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getCategoryIcon = (category: Document["category"]) => {
    const icons = {
      vehicle: Car,
      driver: User,
      sacco: Building2,
      terminus: Building2,
      compliance: FileText
    };
    return icons[category];
  };

  const handleUpload = () => {
    toast({
      title: "Document Uploaded",
      description: "Your document has been uploaded successfully and is pending review.",
    });
    setIsUploadDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Document Deleted",
      description: "The document has been removed from the system.",
      variant: "destructive",
    });
  };

  const documentStats = {
    total: documents.length,
    active: documents.filter(d => d.status === "active").length,
    expired: documents.filter(d => d.status === "expired").length,
    pending: documents.filter(d => d.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Document Management</h1>
          <p className="text-muted-foreground">Manage licenses, permits, and compliance documents</p>
        </div>
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>
                Upload a new document for vehicles, drivers, SACCOs, or compliance.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="docTitle">Document Title</Label>
                <Input id="docTitle" placeholder="Enter document title" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="docCategory">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="sacco">SACCO</SelectItem>
                    <SelectItem value="terminus">Terminus</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entityId">Related Entity</Label>
                <Input id="entityId" placeholder="Vehicle/Driver/SACCO ID" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input id="expiryDate" type="date" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">Upload File</Label>
                <Input id="file" type="file" accept=".pdf,.doc,.docx,.jpg,.png" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional notes or comments" />
              </div>
              
              <Button onClick={handleUpload} className="w-full">
                Upload Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{documentStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-success">{documentStats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-destructive">{documentStats.expired}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{documentStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="vehicle">Vehicle</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="sacco">SACCO</SelectItem>
                  <SelectItem value="terminus">Terminus</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
          <CardDescription>
            Manage all documents, licenses, and permits in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => {
                  const CategoryIcon = getCategoryIcon(doc.category);
                  return (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            <p className="text-sm text-muted-foreground">{doc.type}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4" />
                          <span className="capitalize">{doc.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{doc.entityName}</p>
                          <p className="text-sm text-muted-foreground">{doc.entityId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.expiryDate ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(doc.expiryDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{doc.fileSize}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};