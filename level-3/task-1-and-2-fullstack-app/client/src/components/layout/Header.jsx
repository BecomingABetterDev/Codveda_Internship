import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ArrowRight,
  Command,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function Header({
  onOpenSidebar,
  searchQuery,
  setSearchQuery,
  user,
  onOpenProfileModal,
  onLogout,
}) {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const containerRef = useRef(null);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  // Global Keyboard Shortcut Listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsFocused(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Quick search API fetcher
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await API.get("/prompts", {
          params: { search: searchQuery.trim(), limit: 5 },
        });
        setSearchResults(res.data.data || []);
      } catch (err) {
        console.error("Header search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <header className="h-16 border-b border-surface-muted bg-surface/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 transition-colors duration-200">
      {/* Left Trigger (Mobile Sidebar Toggle) */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-surface-hover transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input with Cmd+K Shortcut Badge */}
      <div
        className="flex-1 max-w-md mx-4 relative"
        ref={containerRef}
      >
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3.5 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery || ""}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => {
              setSearchQuery && setSearchQuery(e.target.value);
              setIsFocused(true);
            }}
            placeholder="Search prompts, categories, tags..."
            className="w-full bg-canvas border border-surface-muted rounded-xl pl-10 pr-16 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
          />

          {/* Keyboard Badge or Clear Input Action */}
          <div className="absolute right-2.5 flex items-center space-x-1">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery && setSearchQuery("")}
                className="text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white p-0.5 rounded-md transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-gray-400 bg-surface border border-surface-muted rounded-md pointer-events-none">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            )}
          </div>
        </div>

        {/* Live Search Overlay Results */}
        {isFocused && searchQuery && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-surface-muted rounded-2xl shadow-2xl overflow-hidden z-50">
            <div className="p-2 border-b border-surface-muted/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400 px-3">
              <span>Quick Search Results</span>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-surface-muted/40">
              {loading ? (
                <div className="p-4 text-center text-xs text-slate-500 dark:text-gray-400 animate-pulse">
                  Searching vault...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 dark:text-gray-400">
                  No matching prompts found.
                </div>
              ) : (
                searchResults.map((prompt) => (
                  <div
                    key={prompt._id || prompt.id}
                    onClick={() => {
                      setIsFocused(false);
                      navigate("/prompts");
                    }}
                    className="p-3 hover:bg-surface-hover cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-brand transition-colors truncate">
                        {prompt.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-1">
                        {prompt.description || prompt.content}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 dark:text-gray-500 group-hover:text-brand transition-transform group-hover:translate-x-1 shrink-0 ml-2" />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right User Profile Dropdown */}
      <div
        className="relative"
        ref={profileRef}
      >
        <button
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-surface-hover border border-transparent hover:border-surface-muted transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold text-xs">
            {user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {user?.name || "Developer"}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-tight">
              {user?.email || "dev@promptvolt.com"}
            </p>
          </div>
        </button>

        {/* Profile Popover Menu */}
        {profileMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-surface border border-surface-muted rounded-2xl shadow-2xl py-2 z-50 divide-y divide-surface-muted/50">
            <div className="px-4 py-2.5">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.name || "Account"}
              </p>
              <p className="text-[11px] text-brand font-medium truncate">
                {user?.email || "dev@promptvolt.com"}
              </p>
            </div>

            <div className="py-1">
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  onOpenProfileModal && onOpenProfileModal();
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-surface-hover transition-colors"
              >
                <User className="w-4 h-4 text-brand" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  navigate("/settings");
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-surface-hover transition-colors"
              >
                <Settings className="w-4 h-4 text-indigo-500" />
                <span>Preferences</span>
              </button>
            </div>

            <div className="pt-1">
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  onLogout && onLogout();
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
