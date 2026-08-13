import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Terminal,
  Wand2,
  Settings,
  LogOut,
  Sparkles,
  X,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Sidebar({ isOpen, onClose, user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Signed out successfully");
      window.location.href = "/login";
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Prompt Vault", path: "/prompts", icon: Terminal },
    { name: "AI Builder", path: "/builder", icon: Wand2 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface border-r border-surface-muted flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-surface-muted">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-brand/10 border border-brand/20 rounded-xl text-brand">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white tracking-wide">
              Prompt<span className="text-brand">Volt</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-brand text-white shadow-glow"
                      : "text-slate-600 dark:text-white hover:text-slate-900 hover:bg-surface-hover"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Sign Out Footer */}
        <div className="p-4 border-t border-surface-muted space-y-3 bg-canvas/30">
          <div className="flex items-center space-x-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-xl bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold text-xs shrink-0">
              {user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.name || "Developer"}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {user?.email || "dev@promptvolt.com"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
