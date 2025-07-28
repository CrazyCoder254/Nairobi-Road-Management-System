import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { saccosAPI } from "@/lib/api";
import { 
  Plus, 
  Building2,
  Users,
  Bus,
  CreditCard,
  Phone,
  Mail,
  Loader2,
  Edit,
  Trash2
} from "lucide-react";

export const Saccos = () => {
  const [saccos, setSaccos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    chairperson: "",
    phone: "",
    email: "",
    address: ""
  });

  const fetchSaccos = async () => {
    try {
      setLoading(true);
      const response = await saccosAPI.getAll();
    setSaccos(response.saccos || []);
    } catch (error) {
      toast.error("Failed to fetch SACCOs");
      console.error("Fetch saccos error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaccos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saccosAPI.create({
        name: formData.name,
        registrationNumber: formData.registrationNumber,
        contactPerson: { 
          name: formData.chairperson, 
          phone: formData.phone, 
          email: formData.email 
        },
        officeLocation: { 
          address: formData.address, 
        }
      });
      toast.success("SACCO created successfully");
      setIsDialogOpen(false);
      setFormData({
        name: "",
        registrationNumber: "",
        chairperson: "",
        phone: "",
        email: "",
        address: ""
      });
      fetchSaccos();
    } catch (error) {
      toast.error("Failed to create SACCO");
      console.error("Create sacco error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this SACCO?")) return;
    try {
      await saccosAPI.delete(id);
      toast.success("SACCO deleted successfully");
      fetchSaccos();
    } catch (error) {
      toast.error("Failed to delete SACCO");
    }
  };
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Register Sacco
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Register New SACCO</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">SACCO Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="chairperson">Chairperson</Label>
                <Input
                  id="chairperson"
                  value={formData.chairperson}
                  onChange={(e) => setFormData({ ...formData, chairperson: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Register SACCO
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sacco Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{saccos.length}</div>
            <div className="text-sm text-muted-foreground">Total Saccos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {saccos.filter((s: any) => s.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {saccos.reduce((sum: number, sacco: any) => sum + (sacco.totalVehicles || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Vehicles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-info">
              {saccos.reduce((sum: number, sacco: any) => sum + (sacco.drivers?.length || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Drivers</div>
          </CardContent>
        </Card>
      </div>

      {/* Saccos Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {saccos.map((sacco: any) => (
            <Card key={sacco._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {sacco.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(sacco.status)}>
                      {sacco.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sacco._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
                  <span className="font-medium">{sacco.contactPerson?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{sacco.contactPerson?.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {sacco.contactPerson?.email || 'N/A'}
                  </span>
                </div>

                </div>

                {/* Fleet Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Bus className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{sacco.totalVehicles || 0}</div>
                      <div className="text-muted-foreground">Vehicles</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{sacco.drivers?.length || 0}</div>
                      <div className="text-muted-foreground">Drivers</div>
                    </div>
                  </div>
                </div>

                {/* License Status */}
                <div className="text-sm">
                  <span className="text-muted-foreground">License: </span>
                  <span className={sacco.licenseExpiry ? "text-success" : "text-destructive"}>
                    {sacco.licenseExpiry ? `Valid until ${new Date(sacco.licenseExpiry).toLocaleDateString()}` : 'No license info'}
                  </span>
                </div>

                {/* Monthly Revenue */}
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Monthly Revenue: </span>
                    <span className="font-bold text-success">KSh {(sacco.monthlyRevenue || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {saccos.length === 0 && !loading && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No SACCOs found. Create your first SACCO to get started.</p>
            </div>
          )}
        </div>
      )}

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