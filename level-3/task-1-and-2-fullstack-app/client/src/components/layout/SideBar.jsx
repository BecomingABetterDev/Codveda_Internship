import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Wand2,
  Settings,
  X,
  Sparkles,
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Prompt Vault", path: "/prompts", icon: FolderKanban },
    { label: "New Prompt", path: "/prompts/new", icon: PlusCircle },
    { label: "AI Builder", path: "/builder", icon: Wand2 },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

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
        className={`fixed top-0 left-0 bottom-0 w-64 bg-surface border-r border-surface-muted flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-surface-muted flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2.5"
          >
            <div className="p-2 rounded-xl bg-brand/10 border border-brand/20 text-brand">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Prompt<span className="text-brand">Volt</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-brand text-white shadow-glow"
                    : "text-gray-400 hover:text-white hover:bg-surface-hover"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    active ? "text-white" : "text-gray-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
