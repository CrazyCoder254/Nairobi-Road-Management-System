import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { 
  Bus, 
  MapPin, 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

export const Dashboard = () => {
  const stats = [
    {
      title: "Total Vehicles",
      value: "1,247",
      change: "+12% from last month",
      changeType: 'positive' as const,
      icon: Bus,
      iconColor: "text-primary"
    },
    {
      title: "Active Routes",
      value: "89",
      change: "+3 new routes",
      changeType: 'positive' as const,
      icon: MapPin,
      iconColor: "text-info"
    },
    {
      title: "Registered Saccos",
      value: "156",
      change: "+8 this month",
      changeType: 'positive' as const,
      icon: Building2,
      iconColor: "text-success"
    },
    {
      title: "Licensed Drivers",
      value: "2,134",
      change: "+45 new drivers",
      changeType: 'positive' as const,
      icon: Users,
      iconColor: "text-warning"
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "vehicle",
      message: "KCA 123D has been registered successfully",
      time: "2 minutes ago",
      status: "success"
    },
    {
      id: 2,
      type: "route",
      message: "Route 46 (Ngong-CBD) capacity updated",
      time: "15 minutes ago",
      status: "info"
    },
    {
      id: 3,
      type: "maintenance",
      message: "KBZ 456E requires scheduled maintenance",
      time: "1 hour ago",
      status: "warning"
    },
    {
      id: 4,
      type: "driver",
      message: "Driver John Kariuki license verified",
      time: "2 hours ago",
      status: "success"
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vehicle':
        return <Bus className="h-4 w-4" />;
      case 'route':
        return <MapPin className="h-4 w-4" />;
      case 'driver':
        return <Users className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-info';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Nairobi Road Transport Management System Overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Flow Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Traffic Flow Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">Traffic flow chart visualization</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-1 rounded-full ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terminus Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Operational Terminuses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">12</div>
            <p className="text-sm text-muted-foreground">Running smoothly</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Under Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">3</div>
            <p className="text-sm text-muted-foreground">Scheduled maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-info" />
              Peak Hour Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-info">85%</div>
            <p className="text-sm text-muted-foreground">Current capacity usage</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};