import React, { useState, useEffect } from "react";
import { Sun, Moon, Sparkles, Key, ShieldCheck, Palette } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsView() {
  // Inside SettingsView.jsx
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  const toggleTheme = (darkMode) => {
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    toast.success(`Switched to ${darkMode ? "Dark" : "Light"} theme`);
  };

  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("openAiApiKey") || ""
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const saveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem("openAiApiKey", apiKey.trim());
    toast.success("API key stored locally in browser storage!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-surface border border-surface-muted p-6 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Palette className="w-6 h-6 text-brand" />
          <span>Workspace Preferences</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
          Customize your interface theme and local integration keys.
        </p>
      </div>

      {/* Theme Card */}
      <div className="bg-surface border border-surface-muted rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-brand/10 text-brand border border-brand/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Appearance Theme
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Select your color preference (Midnight Vault Dark is default).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Dark Theme Option */}
          <button
            type="button"
            onClick={() => toggleTheme(true)}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              isDark
                ? "bg-brand/10 border-brand text-slate-900 dark:text-white shadow-sm"
                : "bg-canvas border-surface-muted text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Moon className="w-5 h-5 text-indigo-500" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Midnight Vault (Dark)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                  Low-eyestrain dark mode
                </p>
              </div>
            </div>
            {isDark && <span className="w-2.5 h-2.5 rounded-full bg-brand" />}
          </button>

          {/* Light Theme Option */}
          <button
            type="button"
            onClick={() => toggleTheme(false)}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              !isDark
                ? "bg-brand/10 border-brand text-slate-900 dark:text-white shadow-sm"
                : "bg-canvas border-surface-muted text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Tech Orange (Light)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                  High-contrast slate & orange
                </p>
              </div>
            </div>
            {!isDark && <span className="w-2.5 h-2.5 rounded-full bg-brand" />}
          </button>
        </div>
      </div>

      {/* API Key Storage */}
      <div className="bg-surface border border-surface-muted rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Studio Integration Key
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Optional API Key stored strictly in your local browser storage.
            </p>
          </div>
        </div>

        <form
          onSubmit={saveApiKey}
          className="space-y-3 pt-2"
        >
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-proj-..."
            className="w-full bg-canvas border border-surface-muted rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand font-mono"
          />
          <button
            type="submit"
            className="bg-brand hover:bg-brand-hover text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Save API Key</span>
          </button>
        </form>
      </div>
    </div>
  );
}
