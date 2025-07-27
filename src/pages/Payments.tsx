import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { paymentsAPI } from "@/lib/api";
import { CreatePaymentForm } from "@/components/forms/CreatePaymentForm";
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Receipt,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  MoreVertical,
  Banknote,
  Wallet,
  Loader2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentsAPI.getAll({ search: searchTerm });
      setPayments(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch payments");
      console.error("Fetch payments error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const response = await paymentsAPI.getStats();
      setPaymentStats(response);
    } catch (error) {
      console.error("Fetch payment stats error:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPayments();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleCreateSuccess = () => {
    setIsDialogOpen(false);
    fetchPayments();
    fetchPaymentStats();
  };

  const handleProcessPayment = async (id: string) => {
    try {
      await paymentsAPI.processPayment(id, {
        amount: 0, // This would come from a form
        paymentMethod: 'mobile_money'
      });
      toast.success("Payment processed successfully");
      fetchPayments();
      fetchPaymentStats();
    } catch (error) {
      toast.error("Failed to process payment");
    }
  };

  const payments_mock = [
    {
      id: "PAY001",
      type: "license_fee",
      description: "Vehicle License Renewal",
      vehicle: "KCA 123D",
      sacco: "Nairobi Matatu Sacco",
      amount: 15000,
      status: "completed",
      method: "mobile_money",
      transactionId: "MP240122001",
      date: "2024-01-22",
      dueDate: "2024-01-25",
      paidBy: "John Kariuki"
    },
    {
      id: "PAY002",
      type: "terminus_fee",
      description: "Daily Terminus Fee",
      vehicle: "KBZ 456E",
      sacco: "Kikuyu Route Sacco",
      amount: 500,
      status: "pending",
      method: "cash",
      transactionId: null,
      date: "2024-01-22",
      dueDate: "2024-01-22",
      paidBy: "Mary Wanjiku"
    },
    {
      id: "PAY003",
      type: "inspection_fee",
      description: "Annual Vehicle Inspection",
      vehicle: "KCX 789F",
      sacco: "Eastlands Express",
      amount: 8000,
      status: "overdue",
      method: "bank_transfer",
      transactionId: null,
      date: "2024-01-15",
      dueDate: "2024-01-20",
      paidBy: "Peter Kimani"
    },
    {
      id: "PAY004",
      type: "route_permit",
      description: "Route Permit Renewal",
      vehicle: "KDA 012G",
      sacco: "Westlands Transport",
      amount: 12000,
      status: "completed",
      method: "mobile_money",
      transactionId: "MP240121003",
      date: "2024-01-21",
      dueDate: "2024-01-23",
      paidBy: "Grace Akinyi"
    },
    {
      id: "PAY005",
      type: "penalty",
      description: "Traffic Violation Fine",
      vehicle: "KEB 345H",
      sacco: "South B Shuttle",
      amount: 5000,
      status: "partial",
      method: "mobile_money",
      transactionId: "MP240120005",
      date: "2024-01-20",
      dueDate: "2024-01-27",
      paidBy: "Samuel Ochieng"
    }
  ];

  const taxCategories = [
    {
      name: "License Fees",
      collected: 150000,
      pending: 25000,
      count: 45
    },
    {
      name: "Terminus Fees",
      collected: 75000,
      pending: 12000,
      count: 150
    },
    {
      name: "Inspection Fees",
      collected: 200000,
      pending: 40000,
      count: 25
    },
    {
      name: "Route Permits",
      collected: 180000,
      pending: 15000,
      count: 15
    },
    {
      name: "Penalties",
      collected: 95000,
      pending: 30000,
      count: 19
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Completed
        </Badge>;
      case "pending":
        return <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>;
      case "overdue":
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Overdue
        </Badge>;
      case "partial":
        return <Badge variant="info" className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          Partial
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentTypeLabel = (type: string) => {
    const labels = {
      license_fee: "License Fee",
      terminus_fee: "Terminus Fee",
      inspection_fee: "Inspection Fee",
      route_permit: "Route Permit",
      penalty: "Penalty/Fine"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "mobile_money":
        return <Wallet className="h-4 w-4" />;
      case "bank_transfer":
        return <CreditCard className="h-4 w-4" />;
      case "cash":
        return <Banknote className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.sacco.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === "pending" || p.status === "partial").reduce((sum, p) => sum + p.amount, 0);
  const overdueCount = payments.filter(p => p.status === "overdue").length;
  const monthlyRevenue = taxCategories.reduce((sum, cat) => sum + cat.collected, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
          <p className="text-muted-foreground">
            Track taxes, fees, and revenue collection
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="premium" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Payment Record</DialogTitle>
            </DialogHeader>
            <CreatePaymentForm 
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Collected Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              KSh {paymentStats?.totalRevenue ? paymentStats.totalRevenue.toLocaleString() : '0'}
            </div>
            <p className="text-sm text-success">+18% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              KSh {paymentStats?.pendingAmount ? paymentStats.pendingAmount.toLocaleString() : '0'}
            </div>
            <p className="text-sm text-muted-foreground">{paymentStats?.pendingCount || 0} transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">{paymentStats?.overdueCount || 0}</div>
            <p className="text-sm text-muted-foreground">require immediate action</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              KSh {paymentStats?.totalRevenue ? paymentStats.totalRevenue.toLocaleString() : '0'}
            </div>
            <p className="text-sm text-success">+25% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="categories">Tax Categories</TabsTrigger>
          <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search payments..."
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
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="partial">Partial</option>
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
                      <TableHead>Payment Details</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment: any) => (
                      <TableRow key={payment._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">{payment.description}</div>
                            <div className="text-sm text-muted-foreground">{payment.referenceNumber}</div>
                            <div className="text-sm text-muted-foreground">
                              {getPaymentTypeLabel(payment.paymentType)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">
                              {payment.vehicle ? `Vehicle: ${payment.vehicle.plateNumber}` : 
                               payment.driver ? `Driver: ${payment.driver.userId?.firstName} ${payment.driver.userId?.lastName}` : 'N/A'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              by {payment.paidBy?.firstName} {payment.paidBy?.lastName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">KSh {payment.amount.toLocaleString()}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(payment.dueDate).toLocaleDateString()}
                          </div>
                          {payment.paidDate && (
                            <div className="text-xs text-muted-foreground">
                              Paid: {new Date(payment.paidDate).toLocaleDateString()}
                            </div>
                          )}
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
                              {payment.status === 'pending' && (
                                <DropdownMenuItem 
                                  className="flex items-center gap-2"
                                  onClick={() => handleProcessPayment(payment._id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Process Payment
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Receipt className="h-4 w-4" />
                                Generate Receipt
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {payments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No payments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {taxCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Collected</span>
                        <span className="font-bold text-success">KSh {category.collected.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Pending</span>
                        <span className="font-bold text-warning">KSh {category.pending.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Transactions</span>
                        <span className="font-bold text-primary">{category.count}</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="bg-muted rounded-full h-2">
                        <div 
                          className="bg-success h-2 rounded-full" 
                          style={{ 
                            width: `${(category.collected / (category.collected + category.pending)) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round((category.collected / (category.collected + category.pending)) * 100)}% collected
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Revenue trend chart visualization</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Collection Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Payment schedule calendar</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};