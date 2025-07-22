import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  MoreVertical
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Terminuses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const terminuses = [
    {
      id: 1,
      name: "Kencom Terminus",
      location: "Kencom House, CBD",
      capacity: 150,
      currentVehicles: 120,
      status: "operational",
      routes: 12,
      operators: 8,
      dailyRevenue: 45000,
      lastMaintenance: "2024-01-15",
      facilities: ["Parking", "Washrooms", "Waiting Area", "Security"]
    },
    {
      id: 2,
      name: "Railway Terminus",
      location: "Railway Station, CBD",
      capacity: 200,
      currentVehicles: 180,
      status: "operational",
      routes: 18,
      operators: 12,
      dailyRevenue: 67000,
      lastMaintenance: "2024-01-20",
      facilities: ["Parking", "Washrooms", "Waiting Area", "Food Court", "Security"]
    },
    {
      id: 3,
      name: "Globe Roundabout",
      location: "Globe Cinema Roundabout",
      capacity: 80,
      currentVehicles: 15,
      status: "maintenance",
      routes: 6,
      operators: 4,
      dailyRevenue: 12000,
      lastMaintenance: "2024-01-22",
      facilities: ["Parking", "Basic Shelter"]
    },
    {
      id: 4,
      name: "Muthurwa Terminus",
      location: "Muthurwa Market",
      capacity: 120,
      currentVehicles: 95,
      status: "operational",
      routes: 15,
      operators: 10,
      dailyRevenue: 38000,
      lastMaintenance: "2024-01-18",
      facilities: ["Parking", "Washrooms", "Market Access", "Security"]
    },
    {
      id: 5,
      name: "Tea Room Terminus",
      location: "Tea Room Area, CBD",
      capacity: 100,
      currentVehicles: 0,
      status: "construction",
      routes: 0,
      operators: 0,
      dailyRevenue: 0,
      lastMaintenance: "N/A",
      facilities: ["Under Construction"]
    }
  ];

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
        <Button variant="premium" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Terminus
        </Button>
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
              {filteredTerminuses.map((terminus) => (
                <TableRow key={terminus.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{terminus.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {terminus.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(terminus.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`font-medium ${getCapacityColor(terminus.currentVehicles, terminus.capacity)}`}>
                        {terminus.currentVehicles}/{terminus.capacity}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ({Math.round((terminus.currentVehicles/terminus.capacity)*100)}%)
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Bus className="h-4 w-4 text-muted-foreground" />
                      {terminus.routes}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">KSh {terminus.dailyRevenue.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{terminus.lastMaintenance}</div>
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
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Wrench className="h-4 w-4" />
                          Schedule Maintenance
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