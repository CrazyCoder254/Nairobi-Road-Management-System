import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "@/pages/Dashboard";
import { Vehicles } from "@/pages/Vehicles";
import { Routes } from "@/pages/Routes";
import { Saccos } from "@/pages/Saccos";
import { Terminuses } from "@/pages/Terminuses";
import { Drivers } from "@/pages/Drivers";
import { Payments } from "@/pages/Payments";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";
import { Auth } from "@/pages/Auth";

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Auth onAuth={() => setIsAuthenticated(true)} />;
  }

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
        return <Terminuses />;
      case "drivers":
        return <Drivers />;
      case "payments":
        return <Payments />;
      case "reports":
        return <Reports />;
      case "documents":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Document Management</h1>
            <p className="text-muted-foreground">Coming soon - Manage licenses, permits, and compliance documents</p>
          </div>
        );
      case "settings":
        return <Settings />;
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