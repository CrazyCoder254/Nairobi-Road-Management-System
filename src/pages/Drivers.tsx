import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  FileText
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const drivers = [
    {
      id: 1,
      name: "John Kariuki Mwangi",
      licenseNumber: "DL001234567",
      phone: "+254 712 345 678",
      email: "john.kariuki@email.com",
      sacco: "Nairobi Matatu Sacco",
      route: "CBD - Ngong",
      vehicle: "KCA 123D",
      status: "active",
      licenseExpiry: "2025-06-15",
      experienceYears: 8,
      rating: 4.8,
      totalTrips: 1250,
      violations: 0,
      lastActivity: "2024-01-22 14:30",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Mary Wanjiku Njoroge",
      licenseNumber: "DL002345678",
      phone: "+254 723 456 789",
      email: "mary.njoroge@email.com",
      sacco: "Kikuyu Route Sacco",
      route: "CBD - Kikuyu",
      vehicle: "KBZ 456E",
      status: "active",
      licenseExpiry: "2024-12-20",
      experienceYears: 12,
      rating: 4.9,
      totalTrips: 2100,
      violations: 1,
      lastActivity: "2024-01-22 15:45",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Peter Kimani Mutua",
      licenseNumber: "DL003456789",
      phone: "+254 734 567 890",
      email: "peter.kimani@email.com",
      sacco: "Eastlands Express",
      route: "CBD - Dandora",
      vehicle: "KCX 789F",
      status: "suspended",
      licenseExpiry: "2025-03-10",
      experienceYears: 5,
      rating: 3.2,
      totalTrips: 450,
      violations: 5,
      lastActivity: "2024-01-15 09:20",
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Grace Akinyi Odhiambo",
      licenseNumber: "DL004567890",
      phone: "+254 745 678 901",
      email: "grace.akinyi@email.com",
      sacco: "Westlands Transport",
      route: "CBD - Westlands",
      vehicle: "KDA 012G",
      status: "training",
      licenseExpiry: "2024-08-25",
      experienceYears: 2,
      rating: 4.5,
      totalTrips: 180,
      violations: 0,
      lastActivity: "2024-01-22 11:10",
      avatar: "/placeholder.svg"
    },
    {
      id: 5,
      name: "Samuel Ochieng Otieno",
      licenseNumber: "DL005678901",
      phone: "+254 756 789 012",
      email: "samuel.ochieng@email.com",
      sacco: "South B Shuttle",
      route: "CBD - South B",
      vehicle: "KEB 345H",
      status: "inactive",
      licenseExpiry: "2024-02-28",
      experienceYears: 15,
      rating: 4.7,
      totalTrips: 3200,
      violations: 2,
      lastActivity: "2024-01-10 16:00",
      avatar: "/placeholder.svg"
    }
  ];

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
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.sacco.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.status === "active").length;
  const suspendedDrivers = drivers.filter(d => d.status === "suspended").length;
  const averageRating = drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Driver Management</h1>
          <p className="text-muted-foreground">
            Manage driver licenses, assignments, and performance monitoring
          </p>
        </div>
        <Button variant="premium" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Register New Driver
        </Button>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vehicle/Route</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Violations</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={driver.avatar} />
                        <AvatarFallback>{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{driver.name}</div>
                        <div className="text-sm text-muted-foreground">{driver.licenseNumber}</div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {driver.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(driver.status)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{driver.vehicle}</div>
                      <div className="text-xs text-muted-foreground">{driver.route}</div>
                      <div className="text-xs text-muted-foreground">{driver.sacco}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${getRatingColor(driver.rating)}`}>
                      ★ {driver.rating}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {driver.totalTrips} trips
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{driver.licenseExpiry}</div>
                    <div className="text-xs text-muted-foreground">
                      {driver.experienceYears} years exp.
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${getViolationColor(driver.violations)}`}>
                      {driver.violations}
                    </div>
                    <div className="text-xs text-muted-foreground">violations</div>
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
                        <DropdownMenuItem className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          View Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          License Renewal
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-danger">
                          <AlertTriangle className="h-4 w-4" />
                          Report Violation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};