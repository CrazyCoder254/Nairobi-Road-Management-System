import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { 
  Plus, 
  Search, 
  Filter,
  Download
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for vehicles
const mockVehicles = [
  {
    id: "1",
    plateNumber: "KCA 123D",
    type: "Matatu",
    capacity: 14,
    driver: "John Kariuki",
    route: "Ngong - CBD",
    status: 'active' as const,
    sacco: "Ngong Road Sacco",
    location: "Dagoretti Corner"
  },
  {
    id: "2",
    plateNumber: "KBZ 456E",
    type: "Bus",
    capacity: 33,
    driver: "Mary Wanjiku",
    route: "Kikuyu - CBD",
    status: 'maintenance' as const,
    sacco: "Kikuyu Express",
    location: "Maintenance Bay 2"
  },
  {
    id: "3",
    plateNumber: "KAA 789F",
    type: "Matatu",
    capacity: 14,
    driver: "Peter Mwangi",
    route: "Thika - CBD",
    status: 'active' as const,
    sacco: "Thika Road Matatu",
    location: "Stage 1, CBD"
  },
  {
    id: "4",
    plateNumber: "KBA 321G",
    type: "Bus",
    capacity: 51,
    driver: "Grace Muthoni",
    route: "Eastleigh - CBD",
    status: 'inactive' as const,
    sacco: "Eastlands Sacco",
    location: "Eastleigh Terminus"
  },
];

export const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.sacco.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesType = typeFilter === "all" || vehicle.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vehicle Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all registered vehicles in the system
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Register Vehicle
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by plate number, driver, route, or sacco..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Matatu">Matatu</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{mockVehicles.length}</div>
            <div className="text-sm text-muted-foreground">Total Vehicles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {mockVehicles.filter(v => v.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">
              {mockVehicles.filter(v => v.status === 'maintenance').length}
            </div>
            <div className="text-sm text-muted-foreground">Maintenance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {mockVehicles.filter(v => v.status === 'inactive').length}
            </div>
            <div className="text-sm text-muted-foreground">Inactive</div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={(vehicle) => console.log('Edit vehicle:', vehicle)}
            onViewDetails={(vehicle) => console.log('View details:', vehicle)}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              No vehicles found matching your search criteria.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};