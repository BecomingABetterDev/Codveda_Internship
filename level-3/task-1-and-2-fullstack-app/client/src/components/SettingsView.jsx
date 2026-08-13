import React, { useState } from "react";
import {
  Sliders,
  Key,
  Database,
  RefreshCw,
  Check,
  Sparkles,
} from "lucide-react";

export default function SettingsView() {
  const [apiKey, setApiKey] = useState("sk-devvolt-local-mock-key");
  const [autoCopy, setAutoCopy] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          Preferences & Settings
        </h1>
        <p className="text-sm text-gray-400">
          Manage your PromptVolt workspace, local keys, and editor default
          settings.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6"
      >
        {/* Workspace Configuration */}
        <div className="bg-surface border border-surface-muted rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-surface-muted">
            <div className="p-2 bg-brand/10 text-brand rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                General Preferences
              </h2>
              <p className="text-xs text-gray-400">
                Control copying and UI behavior
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  Auto-Copy on Selection
                </p>
                <p className="text-xs text-gray-400">
                  Automatically copy prompt code to clipboard when opening
                  detail modal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoCopy(!autoCopy)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  autoCopy ? "bg-brand" : "bg-surface-muted"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    autoCopy ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="pt-4 border-t border-surface-muted/60">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Interface Color Mode
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    theme === "dark"
                      ? "bg-brand/20 border-brand text-white shadow-glow"
                      : "bg-canvas border-surface-muted text-gray-400 hover:text-white"
                  }`}
                >
                  Dark Glow (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("midnight")}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    theme === "midnight"
                      ? "bg-brand/20 border-brand text-white shadow-glow"
                      : "bg-canvas border-surface-muted text-gray-400 hover:text-white"
                  }`}
                >
                  Midnight Blue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* API Integration Settings (Builder Mock) */}
        <div className="bg-surface border border-surface-muted rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-surface-muted">
            <div className="p-2 bg-brand/10 text-brand rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                AI Builder Local API Keys
              </h2>
              <p className="text-xs text-gray-400">
                Optional credentials for future prompt generation extensions.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Local OpenAI / Custom Endpoint Key
            </label>
            <div className="relative max-w-md">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-canvas border border-surface-muted rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand font-mono"
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-brand" />
              <span>Keys are strictly saved in your local browser state.</span>
            </p>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-brand hover:bg-brand-hover text-white shadow-glow transition-all"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Save Workspace Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
