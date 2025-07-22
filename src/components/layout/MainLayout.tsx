import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "@/pages/Dashboard";
import { Vehicles } from "@/pages/Vehicles";
import { Routes } from "@/pages/Routes";
import { Saccos } from "@/pages/Saccos";

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "vehicles":
        return <Vehicles />;
      case "routes":
        return <Routes />;
      case "saccos":
        return <Saccos />;
      case "terminuses":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Terminus Management</h1>
            <p className="text-muted-foreground">Coming soon - Manage terminus operations and facilities</p>
          </div>
        );
      case "drivers":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Driver Management</h1>
            <p className="text-muted-foreground">Coming soon - Manage driver licenses and assignments</p>
          </div>
        );
      case "payments":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Payment Management</h1>
            <p className="text-muted-foreground">Coming soon - Track taxes, fees, and revenue</p>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Coming soon - Generate detailed reports and insights</p>
          </div>
        );
      case "documents":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Document Management</h1>
            <p className="text-muted-foreground">Coming soon - Manage licenses, permits, and compliance documents</p>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Coming soon - Configure system preferences and user management</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderPage()}
        </main>
      </div>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};