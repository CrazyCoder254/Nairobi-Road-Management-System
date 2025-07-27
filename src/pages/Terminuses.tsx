import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { terminusesAPI } from "@/lib/api";
import { CreateTerminusForm } from "@/components/forms/CreateTerminusForm";
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Bus, 
  Wrench, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  Eye,
  Edit,
  MoreVertical,
  Loader2,
  Trash2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Terminuses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [terminuses, setTerminuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchTerminuses = async () => {
    try {
      setLoading(true);
      const response = await terminusesAPI.getAll({ search: searchTerm, status: statusFilter === 'all' ? undefined : statusFilter });
      setTerminuses(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch terminuses");
      console.error("Fetch terminuses error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerminuses();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTerminuses();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  const handleCreateSuccess = () => {
    setIsDialogOpen(false);
    fetchTerminuses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this terminus?")) return;
    try {
      await terminusesAPI.delete(id);
      toast.success("Terminus deleted successfully");
      fetchTerminuses();
    } catch (error) {
      toast.error("Failed to delete terminus");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Operational
        </Badge>;
      case "maintenance":
        return <Badge variant="warning" className="flex items-center gap-1">
          <Wrench className="h-3 w-3" />
          Maintenance
        </Badge>;
      case "construction":
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Construction
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return "text-danger";
    if (percentage >= 70) return "text-warning";
    return "text-success";
  };

  const filteredTerminuses = terminuses.filter(terminus => {
    const matchesSearch = terminus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         terminus.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || terminus.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCapacity = terminuses.reduce((sum, t) => sum + t.capacity, 0);
  const totalVehicles = terminuses.reduce((sum, t) => sum + t.currentVehicles, 0);
  const operationalCount = terminuses.filter(t => t.status === "operational").length;
  const totalRevenue = terminuses.reduce((sum, t) => sum + t.dailyRevenue, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Terminus Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all transport terminuses in Nairobi
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="premium" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Terminus
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Terminus</DialogTitle>
            </DialogHeader>
            <CreateTerminusForm 
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Terminuses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{terminuses.length}</div>
            <p className="text-sm text-success">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{totalCapacity.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">vehicles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{Math.round((totalVehicles/totalCapacity)*100)}%</div>
            <p className="text-sm text-muted-foreground">{totalVehicles}/{totalCapacity} vehicles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">KSh {totalRevenue.toLocaleString()}</div>
            <p className="text-sm text-success">+15% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search terminuses..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="operational">Operational</option>
                <option value="maintenance">Maintenance</option>
                <option value="construction">Construction</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Terminus</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Routes</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {filteredTerminuses.map((terminus: any) => (
                  <TableRow key={terminus._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{terminus.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {terminus.location?.address || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(terminus.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`font-medium ${getCapacityColor(terminus.currentOccupancy || 0, terminus.totalCapacity)}`}>
                          {terminus.currentOccupancy || 0}/{terminus.totalCapacity}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ({Math.round(((terminus.currentOccupancy || 0) / terminus.totalCapacity) * 100)}%)
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Bus className="h-4 w-4 text-muted-foreground" />
                        {terminus.routes?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">KSh {(terminus.dailyRevenue || 0).toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {terminus.lastInspection ? new Date(terminus.lastInspection).toLocaleDateString() : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Terminus
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="flex items-center gap-2 text-destructive"
                            onClick={() => handleDelete(terminus._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Terminus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTerminuses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No terminuses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};