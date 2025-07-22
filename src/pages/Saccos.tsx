import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Building2,
  Users,
  Bus,
  CreditCard,
  Phone,
  Mail
} from "lucide-react";

// Mock data for Saccos
const mockSaccos = [
  {
    id: "1",
    name: "Ngong Road Sacco",
    registrationNumber: "SCS/2018/001",
    chairman: "James Mwangi",
    contact: "+254 712 345 678",
    email: "info@ngongroadsacco.co.ke",
    vehicles: 45,
    drivers: 52,
    routes: ["Route 46", "Route 12A"],
    status: "active",
    license: "Valid until Dec 2024",
    monthlyRevenue: "KSh 2,450,000"
  },
  {
    id: "2",
    name: "Kikuyu Express Sacco",
    registrationNumber: "SCS/2019/002",
    chairman: "Mary Wanjiku",
    contact: "+254 723 456 789",
    email: "admin@kikuyuexpress.co.ke",
    vehicles: 38,
    drivers: 41,
    routes: ["Route 23", "Route 23B"],
    status: "active",
    license: "Valid until Mar 2025",
    monthlyRevenue: "KSh 1,890,000"
  },
  {
    id: "3",
    name: "Thika Road Matatu Sacco",
    registrationNumber: "SCS/2017/003",
    chairman: "Peter Kamau",
    contact: "+254 734 567 890",
    email: "contact@thikaroadmatatu.co.ke",
    vehicles: 62,
    drivers: 68,
    routes: ["Route 12", "Route 12B", "Route 12C"],
    status: "active",
    license: "Valid until Aug 2024",
    monthlyRevenue: "KSh 3,120,000"
  },
  {
    id: "4",
    name: "Eastlands Transport Sacco",
    registrationNumber: "SCS/2020/004",
    chairman: "Grace Muthoni",
    contact: "+254 745 678 901",
    email: "info@eastlandstransport.co.ke",
    vehicles: 28,
    drivers: 32,
    routes: ["Route 8", "Route 8A"],
    status: "suspended",
    license: "Expired - Renewal Pending",
    monthlyRevenue: "KSh 0"
  },
];

export const Saccos = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'suspended':
        return 'bg-destructive text-destructive-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sacco Management</h1>
          <p className="text-muted-foreground">
            Manage registered Saccos and their operations
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Register Sacco
        </Button>
      </div>

      {/* Sacco Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{mockSaccos.length}</div>
            <div className="text-sm text-muted-foreground">Total Saccos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {mockSaccos.filter(s => s.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {mockSaccos.reduce((sum, sacco) => sum + sacco.vehicles, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Vehicles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-info">
              {mockSaccos.reduce((sum, sacco) => sum + sacco.drivers, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Drivers</div>
          </CardContent>
        </Card>
      </div>

      {/* Saccos Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {mockSaccos.map((sacco) => (
          <Card key={sacco.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {sacco.name}
                </CardTitle>
                <Badge className={getStatusColor(sacco.status)}>
                  {sacco.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Reg: {sacco.registrationNumber}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chairman & Contact */}
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Chairman: </span>
                  <span className="font-medium">{sacco.chairman}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{sacco.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {sacco.email}
                  </span>
                </div>
              </div>

              {/* Fleet Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Bus className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{sacco.vehicles}</div>
                    <div className="text-muted-foreground">Vehicles</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{sacco.drivers}</div>
                    <div className="text-muted-foreground">Drivers</div>
                  </div>
                </div>
              </div>

              {/* Routes */}
              <div>
                <div className="text-sm text-muted-foreground mb-2">Assigned Routes:</div>
                <div className="flex flex-wrap gap-1">
                  {sacco.routes.map((route, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {route}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* License Status */}
              <div className="text-sm">
                <span className="text-muted-foreground">License: </span>
                <span className={sacco.license.includes("Valid") ? "text-success" : "text-destructive"}>
                  {sacco.license}
                </span>
              </div>

              {/* Monthly Revenue */}
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Monthly Revenue: </span>
                  <span className="font-bold text-success">{sacco.monthlyRevenue}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  Finance
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Sacco Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <p className="text-muted-foreground">Sacco revenue analytics chart</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};