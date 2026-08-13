import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import PromptVault from "./pages/PromptVault";
import AddPrompt from "./pages/AddPrompt";
import SettingsView from "./components/SettingsView";
import PromptBuilder from "./pages/PromptBuilder";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BrowserRouter>
      <AppShell
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      >
        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />
          <Route
            path="/dashboard"
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
            path="/settings"
            element={<SettingsView />}
          />
          <Route
            path="/builder"
            element={<PromptBuilder />}
          />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
