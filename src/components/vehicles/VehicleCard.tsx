import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bus, MapPin, User, Settings } from "lucide-react";

interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  capacity: number;
  driver: string;
  route: string;
  status: 'active' | 'inactive' | 'maintenance';
  sacco: string;
  location?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onViewDetails?: (vehicle: Vehicle) => void;
}

export const VehicleCard = ({ vehicle, onEdit, onViewDetails }: VehicleCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      case 'maintenance':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{vehicle.plateNumber}</CardTitle>
          <Badge className={getStatusColor(vehicle.status)}>
            {vehicle.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Bus className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Capacity:</span>
            <span>{vehicle.capacity}</span>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.driver}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.route}</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Sacco: {vehicle.sacco}
        </div>
        
        {vehicle.location && (
          <div className="text-xs text-info">
            Current: {vehicle.location}
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails?.(vehicle)}
          >
            View Details
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit?.(vehicle)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};