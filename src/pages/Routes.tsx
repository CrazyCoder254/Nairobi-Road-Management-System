import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { routesAPI, terminusesAPI } from "@/lib/api";
import { CreateRouteForm } from "@/components/forms/CreateRouteForm";
import { 
  Plus, 
  MapPin,
  Route as RouteIcon,
  Clock,
  Users,
  TrendingUp,
  Loader2,
  Trash2
} from "lucide-react";

export const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [terminuses, setTerminuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await routesAPI.getAll();
      setRoutes(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch routes");
      console.error("Fetch routes error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTerminuses = async () => {
    try {
      const response = await terminusesAPI.getAll();
      setTerminuses(response.data || []);
    } catch (error) {
      console.error("Fetch terminuses error:", error);
    }
  };

  useEffect(() => {
    fetchRoutes();
    fetchTerminuses();
  }, []);

  const handleCreateSuccess = () => {
    setIsDialogOpen(false);
    fetchRoutes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    try {
      await routesAPI.delete(id);
      toast.success("Route deleted successfully");
      fetchRoutes();
    } catch (error) {
      toast.error("Failed to delete route");
    }
  };
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Route
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Route</DialogTitle>
            </DialogHeader>
            <CreateRouteForm 
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsDialogOpen(false)}
              terminuses={terminuses}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Route Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{routes.length}</div>
            <div className="text-sm text-muted-foreground">Total Routes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {routes.filter((r: any) => r.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {routes.reduce((sum: number, route: any) => sum + (route.assignedVehicles?.length || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Assigned Vehicles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-info">
              {routes.length > 0 ? Math.round(routes.reduce((sum: number, route: any) => sum + (route.distance || 0), 0) / routes.length) : 0}km
            </div>
            <div className="text-sm text-muted-foreground">Avg Distance</div>
          </CardContent>
        </Card>
      </div>

      {/* Routes Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {routes.map((route: any) => (
            <Card key={route._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <RouteIcon className="h-5 w-5" />
                    {route.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(route.status)}>
                      {route.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(route._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Route Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {route.startTerminus?.name || route.startPoint} → {route.endTerminus?.name || route.endPoint}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{route.estimatedTravelTime} min</span>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Distance: </span>
                  <span className="font-medium">{route.distance} km</span>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Fare: </span>
                  <span className="font-medium">KSh {route.fare}</span>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Operating Hours: </span>
                  <span className="font-medium">
                    {route.operatingHours?.start} - {route.operatingHours?.end}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Assigned Vehicles: </span>
                  <span className="font-medium">{route.assignedVehicles?.length || 0}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {routes.length === 0 && !loading && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No routes found. Create your first route to get started.</p>
            </div>
          )}
        </div>
      )}

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