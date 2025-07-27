import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { driversAPI, saccosAPI } from "@/lib/api";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
  Edit,
  MoreVertical,
  Shield,
  FileText,
  Loader2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drivers, setDrivers] = useState([]);
  const [saccos, setSaccos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    dateOfBirth: "",
    sacco: ""
  });

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await driversAPI.getAll({ search: searchTerm });
      setDrivers(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch drivers");
      console.error("Fetch drivers error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSaccos = async () => {
    try {
      const response = await saccosAPI.getAll();
      setSaccos(response.data || []);
    } catch (error) {
      console.error("Fetch saccos error:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchSaccos();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDrivers();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await driversAPI.create(formData);
      toast.success("Driver created successfully");
      setIsDialogOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        licenseNumber: "",
        licenseExpiryDate: "",
        dateOfBirth: "",
        sacco: ""
      });
      fetchDrivers();
    } catch (error) {
      toast.error("Failed to create driver");
      console.error("Create driver error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;
    try {
      await driversAPI.delete(id);
      toast.success("Driver deleted successfully");
      fetchDrivers();
    } catch (error) {
      toast.error("Failed to delete driver");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Active
        </Badge>;
      case "suspended":
        return <Badge variant="destructive" className="flex items-center gap-1">
          <UserX className="h-3 w-3" />
          Suspended
        </Badge>;
      case "training":
        return <Badge variant="info" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Training
        </Badge>;
      case "inactive":
        return <Badge variant="outline" className="flex items-center gap-1">
          <UserX className="h-3 w-3" />
          Inactive
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-success";
    if (rating >= 4.0) return "text-info";
    if (rating >= 3.5) return "text-warning";
    return "text-danger";
  };

  const getViolationColor = (violations: number) => {
    if (violations === 0) return "text-success";
    if (violations <= 2) return "text-warning";
    return "text-danger";
  };

  const filteredDrivers = drivers.filter(driver => {
    const driverName = `${driver.userId?.firstName || ''} ${driver.userId?.lastName || ''}`;
    const matchesSearch = driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.saccoId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.status === "active").length;
  const suspendedDrivers = drivers.filter(d => d.status === "suspended").length;
  const averageRating = drivers.length > 0 ? drivers.reduce((sum, d) => sum + (d.rating || 0), 0) / drivers.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Driver Management</h1>
          <p className="text-muted-foreground">
            Manage driver licenses, assignments, and performance monitoring
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="premium" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Register New Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Driver</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
                <Input
                  id="licenseExpiryDate"
                  type="date"
                  value={formData.licenseExpiryDate}
                  onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sacco">Sacco</Label>
                <Select value={formData.sacco} onValueChange={(value) => setFormData({ ...formData, sacco: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Sacco" />
                  </SelectTrigger>
                  <SelectContent>
                    {saccos.map((sacco: any) => (
                      <SelectItem key={sacco._id} value={sacco._id}>
                        {sacco.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Register Driver
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalDrivers}</div>
            <p className="text-sm text-success">+12 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeDrivers}</div>
            <p className="text-sm text-muted-foreground">{Math.round((activeDrivers/totalDrivers)*100)}% of total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">{suspendedDrivers}</div>
            <p className="text-sm text-muted-foreground">Need review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{averageRating.toFixed(1)}</div>
            <p className="text-sm text-success">+0.2 from last month</p>
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
                placeholder="Search drivers..."
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
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="training">Training</option>
                <option value="inactive">Inactive</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sacco</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver: any) => {
                  const driverName = `${driver.userId?.firstName || ''} ${driver.userId?.lastName || ''}`.trim();
                  return (
                    <TableRow key={driver._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {driver.userId?.firstName?.[0]}{driver.userId?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">{driverName}</div>
                            <div className="text-sm text-muted-foreground">{driver.licenseNumber}</div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {driver.userId?.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(driver.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{driver.saccoId?.name || 'N/A'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">{driver.licenseClass}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{driver.experienceYears || 0} years</div>
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
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Edit Driver
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 text-destructive"
                              onClick={() => handleDelete(driver._id)}
                            >
                              <AlertTriangle className="h-4 w-4" />
                              Delete Driver
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredDrivers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No drivers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};