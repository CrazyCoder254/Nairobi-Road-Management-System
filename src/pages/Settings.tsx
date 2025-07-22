import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail,
  Phone,
  MapPin,
  Building2,
  Save,
  RefreshCw,
  Download,
  Upload,
  Key,
  Users,
  Globe,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Palette,
  Lock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system preferences and user management
          </p>
        </div>
        <Button variant="premium" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Avatar className="h-32 w-32 mx-auto">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-2xl">AD</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="mr-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="System" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Administrator" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input id="email" type="email" defaultValue="admin@nrtms.go.ke" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input id="phone" defaultValue="+254 700 123 456" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Organization
                  </Label>
                  <Input id="organization" defaultValue="Nairobi County Government" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Input id="address" defaultValue="City Hall, Nairobi CBD" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive alerts via email</div>
                  </div>
                  <Switch 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive alerts via SMS</div>
                  </div>
                  <Switch 
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive browser notifications</div>
                  </div>
                  <Switch 
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">System Alerts</div>
                    <div className="text-sm text-muted-foreground">Critical system notifications</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Payment Reminders</div>
                    <div className="text-sm text-muted-foreground">Overdue payment notifications</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Vehicle Updates</div>
                    <div className="text-sm text-muted-foreground">Registration and inspection alerts</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Report Generation</div>
                    <div className="text-sm text-muted-foreground">When reports are ready</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Maintenance Alerts</div>
                    <div className="text-sm text-muted-foreground">Scheduled maintenance reminders</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Password & Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>

                <Button variant="outline" className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">Add extra security to your account</div>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Session Timeout</div>
                    <div className="text-sm text-muted-foreground">Auto logout after inactivity</div>
                  </div>
                  <select className="px-3 py-2 border border-border rounded-md bg-background text-sm">
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="0">Never</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Login Alerts</div>
                    <div className="text-sm text-muted-foreground">Notify on new device login</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-muted-foreground">Switch to dark theme</div>
                  </div>
                  <Switch 
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
                  />
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Theme Color</Label>
                  <div className="flex gap-2 mt-2">
                    <div className="w-8 h-8 bg-primary rounded-full border-2 border-primary"></div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-transparent hover:border-blue-500 cursor-pointer"></div>
                    <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-transparent hover:border-green-500 cursor-pointer"></div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-transparent hover:border-purple-500 cursor-pointer"></div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Language</Label>
                  <select className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background">
                    <option value="en">English</option>
                    <option value="sw">Kiswahili</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Data Refresh Rate</Label>
                  <select className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background">
                    <option value="5">Every 5 minutes</option>
                    <option value="10">Every 10 minutes</option>
                    <option value="30">Every 30 minutes</option>
                    <option value="60">Every hour</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Max Records Per Page</Label>
                  <select className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background">
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto Save</div>
                    <div className="text-sm text-muted-foreground">Automatically save changes</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Debug Mode</div>
                    <div className="text-sm text-muted-foreground">Enable system debugging</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage system users and their permissions
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Active Users</h3>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>

                <div className="space-y-2">
                  {[
                    { name: "System Administrator", email: "admin@nrtms.go.ke", role: "Admin", status: "Active" },
                    { name: "Transport Manager", email: "manager@nrtms.go.ke", role: "Manager", status: "Active" },
                    { name: "Terminal Operator", email: "operator@nrtms.go.ke", role: "Operator", status: "Active" },
                    { name: "Route Supervisor", email: "supervisor@nrtms.go.ke", role: "Supervisor", status: "Inactive" }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">{user.role}</div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          user.status === 'Active' 
                            ? 'bg-success/20 text-success' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {user.status}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Lock className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Backup</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage system backups and data recovery
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Automatic Backup</Label>
                  <select className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="manual">Manual Only</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Backup Location</Label>
                  <Input className="mt-2" defaultValue="/backup/nrtms/" />
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full mb-2">
                    <Download className="h-4 w-4 mr-2" />
                    Create Manual Backup
                  </Button>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restore from Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Backups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: "System Backup - January 22, 2024", size: "2.4 GB", status: "Complete" },
                    { name: "System Backup - January 21, 2024", size: "2.3 GB", status: "Complete" },
                    { name: "System Backup - January 20, 2024", size: "2.2 GB", status: "Complete" },
                    { name: "System Backup - January 19, 2024", size: "2.1 GB", status: "Complete" }
                  ].map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="text-sm font-medium">{backup.name}</div>
                        <div className="text-xs text-muted-foreground">{backup.size} • {backup.status}</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};