import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp,
  TrendingDown,
  Users,
  Bus,
  DollarSign,
  MapPin,
  FileText,
  Printer,
  Mail,
  Eye,
  RefreshCw
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Reports = () => {
  const [dateRange, setDateRange] = useState("last_30_days");

  const reportCategories = [
    {
      title: "Traffic Flow Reports",
      description: "Analyze vehicle movement patterns and peak hours",
      icon: TrendingUp,
      reports: [
        { name: "Daily Traffic Analysis", generated: "2024-01-22", status: "ready" },
        { name: "Peak Hours Report", generated: "2024-01-22", status: "ready" },
        { name: "Route Congestion Analysis", generated: "2024-01-21", status: "ready" },
        { name: "Terminal Utilization", generated: "2024-01-20", status: "ready" }
      ]
    },
    {
      title: "Financial Reports",
      description: "Revenue tracking and financial performance",
      icon: DollarSign,
      reports: [
        { name: "Monthly Revenue Report", generated: "2024-01-22", status: "ready" },
        { name: "Tax Collection Summary", generated: "2024-01-22", status: "generating" },
        { name: "Outstanding Payments", generated: "2024-01-21", status: "ready" },
        { name: "Penalty Collection Report", generated: "2024-01-20", status: "ready" }
      ]
    },
    {
      title: "Vehicle & Driver Reports",
      description: "Fleet management and driver performance",
      icon: Bus,
      reports: [
        { name: "Vehicle Registration Report", generated: "2024-01-22", status: "ready" },
        { name: "Driver Performance Analysis", generated: "2024-01-21", status: "ready" },
        { name: "License Renewal Schedule", generated: "2024-01-20", status: "ready" },
        { name: "Violation Summary Report", generated: "2024-01-19", status: "ready" }
      ]
    },
    {
      title: "Operational Reports",
      description: "Daily operations and system performance",
      icon: BarChart3,
      reports: [
        { name: "Daily Operations Summary", generated: "2024-01-22", status: "ready" },
        { name: "Route Performance Report", generated: "2024-01-21", status: "ready" },
        { name: "Sacco Performance Analysis", generated: "2024-01-20", status: "ready" },
        { name: "Terminal Operations Report", generated: "2024-01-19", status: "ready" }
      ]
    }
  ];

  const dashboardMetrics = [
    {
      title: "Reports Generated",
      value: "156",
      change: "+23%",
      changeType: "positive",
      icon: FileText,
      period: "This Month"
    },
    {
      title: "Active Users",
      value: "1,247",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      period: "Current"
    },
    {
      title: "System Efficiency",
      value: "98.5%",
      change: "+2.1%",
      changeType: "positive",
      icon: TrendingUp,
      period: "This Week"
    },
    {
      title: "Data Processing",
      value: "2.3M",
      change: "+18%",
      changeType: "positive",
      icon: BarChart3,
      period: "Records/Day"
    }
  ];

  const quickStats = [
    { label: "Total Vehicles Tracked", value: "1,247", trend: "+5.2%" },
    { label: "Active Routes", value: "89", trend: "+2.1%" },
    { label: "Revenue Today", value: "KSh 125,000", trend: "+8.4%" },
    { label: "Violations Today", value: "23", trend: "-12.3%" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge variant="success">Ready</Badge>;
      case "generating":
        return <Badge variant="warning">Generating</Badge>;
      case "scheduled":
        return <Badge variant="info">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate detailed reports and insights for transport management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
          <Button variant="premium" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {dashboardMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <metric.icon className="h-4 w-4" />
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{metric.value}</div>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${metric.changeType === 'positive' ? 'text-success' : 'text-danger'}`}>
                  {metric.change}
                </p>
                <p className="text-sm text-muted-foreground">{metric.period}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Quick Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quickStats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                        <div className="font-semibold">{stat.value}</div>
                      </div>
                      <div className={`text-sm font-medium ${
                        stat.trend.startsWith('+') ? 'text-success' : 'text-danger'
                      }`}>
                        {stat.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Performance metrics chart visualization</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    {category.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.reports.map((report, reportIndex) => (
                      <div key={reportIndex} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{report.name}</div>
                          <div className="text-xs text-muted-foreground">Generated: {report.generated}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(report.status)}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      Generate New Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            {/* Date Range Selector */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <div className="flex gap-2">
                    <select
                      className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <option value="last_7_days">Last 7 Days</option>
                      <option value="last_30_days">Last 30 Days</option>
                      <option value="last_3_months">Last 3 Months</option>
                      <option value="last_year">Last Year</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                    <p className="text-muted-foreground">Revenue analytics chart</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Traffic Flow Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                    <p className="text-muted-foreground">Traffic flow analytics chart</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                    <p className="text-muted-foreground">Vehicle utilization chart</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Route Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                    <p className="text-muted-foreground">Route performance metrics</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage automated report generation schedules
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Daily Operations Summary</div>
                    <div className="text-sm text-muted-foreground">Generated daily at 6:00 AM</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Active</Badge>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Weekly Financial Report</div>
                    <div className="text-sm text-muted-foreground">Generated every Monday at 9:00 AM</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Active</Badge>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Monthly Performance Report</div>
                    <div className="text-sm text-muted-foreground">Generated on the 1st of each month</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Paused</Badge>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t mt-6">
                <Button variant="premium" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};