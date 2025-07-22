import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MapPin,
  Route as RouteIcon,
  Clock,
  Users,
  TrendingUp
} from "lucide-react";

// Mock data for routes
const mockRoutes = [
  {
    id: "1",
    name: "Route 46",
    origin: "Ngong",
    destination: "CBD",
    distance: "18.5 km",
    estimatedTime: "45 min",
    activeVehicles: 24,
    capacity: 30,
    status: "operational",
    peakHours: "7:00 AM - 10:00 AM, 4:00 PM - 7:00 PM",
    fare: "KSh 50"
  },
  {
    id: "2",
    name: "Route 23",
    origin: "Kikuyu",
    destination: "CBD",
    distance: "22.3 km",
    estimatedTime: "55 min",
    activeVehicles: 18,
    capacity: 25,
    status: "operational",
    peakHours: "6:30 AM - 9:30 AM, 5:00 PM - 8:00 PM",
    fare: "KSh 60"
  },
  {
    id: "3",
    name: "Route 12",
    origin: "Thika",
    destination: "CBD",
    distance: "35.7 km",
    estimatedTime: "70 min",
    activeVehicles: 32,
    capacity: 40,
    status: "operational",
    peakHours: "6:00 AM - 9:00 AM, 4:30 PM - 7:30 PM",
    fare: "KSh 80"
  },
  {
    id: "4",
    name: "Route 8",
    origin: "Eastleigh",
    destination: "CBD",
    distance: "12.1 km",
    estimatedTime: "35 min",
    activeVehicles: 0,
    capacity: 20,
    status: "suspended",
    peakHours: "7:30 AM - 10:00 AM, 5:00 PM - 7:30 PM",
    fare: "KSh 40"
  },
];

export const Routes = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-success text-success-foreground';
      case 'suspended':
        return 'bg-destructive text-destructive-foreground';
      case 'maintenance':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCapacityColor = (active: number, capacity: number) => {
    const percentage = (active / capacity) * 100;
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Route Management</h1>
          <p className="text-muted-foreground">
            Manage transport routes and monitor vehicle allocation
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Route
        </Button>
      </div>

      {/* Route Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{mockRoutes.length}</div>
            <div className="text-sm text-muted-foreground">Total Routes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {mockRoutes.filter(r => r.status === 'operational').length}
            </div>
            <div className="text-sm text-muted-foreground">Operational</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {mockRoutes.reduce((sum, route) => sum + route.activeVehicles, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Active Vehicles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-info">
              {mockRoutes.reduce((sum, route) => sum + route.capacity, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Capacity</div>
          </CardContent>
        </Card>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockRoutes.map((route) => (
          <Card key={route.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <RouteIcon className="h-5 w-5" />
                  {route.name}
                </CardTitle>
                <Badge className={getStatusColor(route.status)}>
                  {route.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Route Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{route.origin} → {route.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{route.estimatedTime}</span>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-muted-foreground">Distance: </span>
                <span className="font-medium">{route.distance}</span>
              </div>

              <div className="text-sm">
                <span className="text-muted-foreground">Fare: </span>
                <span className="font-medium">{route.fare}</span>
              </div>

              {/* Vehicle Capacity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vehicle Allocation</span>
                  <span className={getCapacityColor(route.activeVehicles, route.capacity)}>
                    {route.activeVehicles}/{route.capacity}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(route.activeVehicles / route.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* Peak Hours */}
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Peak Hours: </span>
                {route.peakHours}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  Manage Vehicles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Route Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Route Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <p className="text-muted-foreground">Route performance chart visualization</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};