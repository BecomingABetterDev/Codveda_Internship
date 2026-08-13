import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ProfileModal from "../modals/ProfileModal";

export default function AppShell({
  children,
  searchQuery,
  setSearchQuery,
  user,
  onUpdateUser,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Apply Theme on Boot/Reload
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-slate-900 dark:text-gray-100 flex transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={onLogout}
      />

      {/* Main View Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={user}
          onLogout={onLogout}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Working Profile Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          user={user}
          onUpdateUser={onUpdateUser}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
}
