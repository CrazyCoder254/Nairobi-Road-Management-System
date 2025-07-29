import { 
  Home, 
  Bus, 
  MapPin, 
  Building2, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  Route,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { name: 'Dashboard', icon: Home, id: 'dashboard' },
  { name: 'Vehicles', icon: Bus, id: 'vehicles' },
  { name: 'Routes', icon: Route, id: 'routes' },
  { name: 'Terminuses', icon: MapPin, id: 'terminuses' },
  { name: 'Saccos', icon: Building2, id: 'saccos' },
  { name: 'Drivers', icon: Users, id: 'drivers' },
  { name: 'Payments', icon: CreditCard, id: 'payments' }
  // { name: 'Reports', icon: BarChart3, id: 'reports' },
  // { name: 'Documents', icon: FileText, id: 'documents' },
  // { name: 'Settings', icon: Settings, id: 'settings' },
];

export const Sidebar = ({ isOpen, currentPage, onPageChange }: SidebarProps) => {
  return (
    <aside className={cn(
      "bg-card border-r border-border transition-all duration-300 flex flex-col",
      "fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0",
      isOpen ? "translate-x-0 w-64" : "-translate-x-full w-0 lg:w-16"
    )}>
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-10 px-3",
                  !isOpen && "lg:justify-center lg:px-0"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className={cn("h-5 w-5", !isOpen && "lg:mx-0")} />
                {(isOpen || window.innerWidth < 1024) && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-border">
        <div className={cn(
          "text-center",
          !isOpen && "lg:hidden"
        )}>
          <p className="text-xs text-muted-foreground">Version 1.0</p>
          <p className="text-xs text-muted-foreground">© 2024 NRTMS</p>
        </div>
      </div>
    </aside>
  );
};