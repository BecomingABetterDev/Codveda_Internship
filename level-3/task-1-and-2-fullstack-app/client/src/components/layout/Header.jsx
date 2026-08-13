import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
  Sparkles,
  X,
  ArrowRight,
  CornerDownLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function Header({ onOpenSidebar, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  // Close search overlay on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch quick live search results
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

  const handleSelectPrompt = (promptId) => {
    setIsFocused(false);
    navigate(`/prompts`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsFocused(false);
      navigate(`/prompts?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-16 border-b border-surface-muted bg-surface/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      {/* Left Menu Trigger */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface-hover transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center Search Container with Dropdown Overlay */}
      <div
        className="flex-1 max-w-md mx-4 relative"
        ref={containerRef}
      >
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery || ""}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => {
              setSearchQuery && setSearchQuery(e.target.value);
              setIsFocused(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search prompts, categories, tags..."
            className="w-full bg-canvas border border-surface-muted rounded-xl pl-10 pr-8 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery && setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Floating Dropdown Menu */}
        {isFocused && searchQuery && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-surface-muted rounded-2xl shadow-2xl overflow-hidden z-50">
            <div className="p-2 border-b border-surface-muted/60 flex items-center justify-between text-[11px] text-gray-400 px-3">
              <span>Search Results</span>
              <span className="flex items-center gap-1 font-mono text-[10px]">
                <CornerDownLeft className="w-3 h-3" /> Press Enter to view in
                Vault
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-surface-muted/40">
              {loading ? (
                <div className="p-4 text-center text-xs text-gray-400 animate-pulse">
                  Searching vault templates...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400">
                  No matching prompts found.
                </div>
              ) : (
                searchResults.map((prompt) => (
                  <div
                    key={prompt._id || prompt.id}
                    onClick={() => handleSelectPrompt(prompt._id || prompt.id)}
                    className="p-3 hover:bg-surface-hover cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-0.5">
                        <span className="text-[10px] uppercase font-bold text-brand bg-brand/10 px-1.5 py-0.5 rounded border border-brand/20">
                          {typeof prompt.category === "string"
                            ? prompt.category
                            : prompt.category?.name || "General"}
                        </span>
                        <h4 className="text-xs font-semibold text-white group-hover:text-brand transition-colors">
                          {prompt.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-1">
                        {prompt.description || prompt.content}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => {
                setIsFocused(false);
                navigate(`/prompts?search=${encodeURIComponent(searchQuery)}`);
              }}
              className="w-full py-2.5 bg-canvas/80 hover:bg-brand text-gray-300 hover:text-white text-xs font-semibold text-center transition-colors border-t border-surface-muted flex items-center justify-center space-x-1.5"
            >
              <span>View all matching results in Prompt Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Right Tier Badge */}
      <div className="flex items-center space-x-3">
        <span className="px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-semibold hidden md:inline-block">
          Enterprise Tier
        </span>
      </div>
    </header>
  );
}
