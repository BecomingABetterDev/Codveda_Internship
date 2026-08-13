import React, { useState, useEffect, useCallback } from "react";
import { Search, Star, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import API from "../api/axios";
import FillPromptModal from "../components/prompts/PromptModal";
import EditPromptModal from "../components/modals/EditPromptModal";
import DeleteConfirmModal from "../components/modals/DeleteModal";
import PromptCard from "../components/prompts/PromptCard";

export default function PromptVault({ searchQuery, setSearchQuery }) {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchQuery || "");
  const [category, setCategory] = useState("All");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Active Modals State
  const [selectedPrompt, setSelectedPrompt] = useState(null); // Variable Filler
  const [editingPrompt, setEditingPrompt] = useState(null); // Edit Modal
  const [deletingPrompt, setDeletingPrompt] = useState(null); // Delete Confirm Modal

  const categories = [
    "All",
    "Frontend",
    "Backend",
    "Database",
    "DevOps",
    "Refactoring",
    "General",
  ];

  useEffect(() => {
    if (searchQuery !== undefined) {
      setSearch(searchQuery);
      setPage(1);
    }
  }, [searchQuery]);

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (category !== "All") params.category = category;
      if (search.trim()) params.search = search.trim();
      if (favoriteOnly) params.favorite = "true";

      const res = await API.get("/prompts", { params });
      setPrompts(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch prompts");
    } finally {
      setLoading(false);
    }
  }, [page, category, search, favoriteOnly]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPrompts(), 300);
    return () => clearTimeout(timer);
  }, [fetchPrompts]);

  const handleToggleFavorite = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await API.patch(`/prompts/${id}/favorite`);
      const updatedFavState =
        res.data.data.isFavorite ?? res.data.data.favorite;

      setPrompts((prev) =>
        prev.map((p) =>
          p._id === id || p.id === id
            ? { ...p, isFavorite: updatedFavState, favorite: updatedFavState }
            : p
        )
      );
      toast.success(
        updatedFavState ? "Added to favorites" : "Removed from favorites"
      );
    } catch (err) {
      toast.error("Could not update favorite state");
    }
  };

  const confirmDelete = async () => {
    if (!deletingPrompt) return;
    const id = deletingPrompt._id || deletingPrompt.id;
    try {
      await API.delete(`/prompts/${id}`);
      toast.success("Prompt deleted successfully");
      setDeletingPrompt(null);
      fetchPrompts();
    } catch (err) {
      toast.error("Failed to delete prompt");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Prompt Vault
          </h1>
          <p className="text-gray-400 text-sm">
            Manage, filter, and fill your saved prompt templates.
          </p>
        </div>
        <Link
          to="/prompts/new"
          className="bg-brand hover:bg-brand-hover text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 shadow-glow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Prompt</span>
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="bg-surface border border-surface-muted rounded-2xl p-4 shadow-glass space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (setSearchQuery) setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, variables, content, or tags..."
              className="w-full bg-canvas border border-surface-muted rounded-xl py-2 pl-10 pr-4 text-white text-xs placeholder-gray-500 focus:ring-1 focus:ring-brand focus:border-brand"
            />
          </div>

          <button
            onClick={() => {
              setFavoriteOnly(!favoriteOnly);
              setPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center space-x-2 transition-colors ${
              favoriteOnly
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                : "bg-canvas text-gray-400 border-surface-muted hover:text-white"
            }`}
          >
            <Star
              className={`w-4 h-4 ${
                favoriteOnly ? "fill-amber-400 text-amber-400" : ""
              }`}
            />
            <span>Favorites</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-brand text-white shadow-glow"
                  : "bg-canvas text-gray-400 hover:text-white border border-surface-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-48 bg-surface border border-surface-muted rounded-2xl animate-pulse p-5"
            />
          ))}
        </div>
      ) : prompts.length === 0 ? (
        <div className="bg-surface border border-surface-muted rounded-2xl p-12 text-center shadow-glass">
          <p className="text-gray-400 text-sm mb-4">
            No prompts match your filter criteria.
          </p>
          <Link
            to="/prompts/new"
            className="text-brand text-xs font-semibold hover:underline"
          >
            Create your first prompt template →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt._id || prompt.id}
              prompt={prompt}
              onToggleFavorite={handleToggleFavorite}
              onDelete={(p) => setDeletingPrompt(p)}
              onEdit={(p) => setEditingPrompt(p)}
              onSelect={(p) => setSelectedPrompt(p)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-surface-muted pt-4">
          <p className="text-xs text-gray-400">
            Page {pagination.page} of {pagination.totalPages} (
            {pagination.total} prompts)
          </p>
          <div className="flex items-center space-x-2">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-xl bg-surface border border-surface-muted text-gray-400 disabled:opacity-40 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-xl bg-surface border border-surface-muted text-gray-400 disabled:opacity-40 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Variable Filler Modal */}
      {selectedPrompt && (
        <FillPromptModal
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}

      {/* Edit Prompt Modal */}
      {editingPrompt && (
        <EditPromptModal
          prompt={editingPrompt}
          onClose={() => setEditingPrompt(null)}
          onSuccess={() => {
            setEditingPrompt(null);
            fetchPrompts();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingPrompt && (
        <DeleteConfirmModal
          prompt={deletingPrompt}
          onClose={() => setDeletingPrompt(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
