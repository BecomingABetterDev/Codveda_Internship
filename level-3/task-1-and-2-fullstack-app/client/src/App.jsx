import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import PromptVault from "./pages/PromptVault";
import PromptBuilder from "./pages/PromptBuilder";
import SettingsView from "./components/SettingsView";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PromptModal from "./components/prompts/PromptModal";
import AddPrompt from "./pages/AddPrompt";

function ProtectedLayout({ searchQuery, setSearchQuery, children }) {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to login if unauthenticated
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <AppShell
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      user={user}
      onLogout={logout}
    >
      {children}
    </AppShell>
  );
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Routes>
      {/* Standalone Login Route (No Header or Sidebar) */}
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/register"
        element={<Register />}
      />
      {/* Protected App Routes */}
      <Route
        path="/*"
        element={
          <ProtectedLayout
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          >
            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />
              <Route
                path="/prompts"
                element={<PromptVault searchQuery={searchQuery} />}
              />
              <Route
                path="/prompts/new"
                element={<AddPrompt />}
              />

              <Route
                path="/builder"
                element={<PromptBuilder />}
              />
              <Route
                path="/settings"
                element={<SettingsView />}
              />
              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />
            </Routes>
          </ProtectedLayout>
        }
      />
    </Routes>
  );
}
