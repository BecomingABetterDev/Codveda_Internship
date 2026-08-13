import React, { useState, useEffect } from "react";
import {
  Terminal,
  Star,
  Variable,
  Layers,
  Plus,
  ArrowUpRight,
  Copy,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import FillPromptModal from "../components/prompts/PromptModal";

export default function Dashboard() {
  const [prompts, setPrompts] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    favorites: 0,
    categories: 0,
    variables: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get("/prompts", { params: { limit: 10 } });
        const list = res.data.data || [];

        // Strictly cap displayed recent prompts to max 4 items
        setPrompts(list.slice(0, 4));

        const total = res.data.pagination?.total || list.length;
        const favorites = list.filter((p) => p.isFavorite || p.favorite).length;

        const uniqueCategories = new Set(
          list.map((p) =>
            typeof p.category === "string"
              ? p.category
              : p.category?.name || "General"
          )
        ).size;

        const totalVariables = list.reduce(
          (acc, p) =>
            acc + (p.placeholders?.length || p.variables?.length || 0),
          0
        );

        setMetrics({
          total,
          favorites,
          categories: uniqueCategories,
          variables: totalVariables,
        });
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleQuickCopy = (e, prompt) => {
    e.stopPropagation();
    const textToCopy = prompt.template || prompt.content || "";
    navigator.clipboard.writeText(textToCopy);
    const id = prompt._id || prompt.id;
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const statsCards = [
    {
      title: "Total Vault Prompts",
      value: metrics.total,
      icon: Terminal,
      color: "text-brand",
    },
    {
      title: "Favorite Templates",
      value: metrics.favorites,
      icon: Star,
      color: "text-amber-500",
    },
    {
      title: "Active Categories",
      value: metrics.categories,
      icon: Layers,
      color: "text-emerald-500",
    },
    {
      title: "Dynamic Variables",
      value: metrics.variables,
      icon: Variable,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-surface border border-surface-muted p-6 sm:p-8 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand rounded-full filter blur-[120px] opacity-15 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Prompt Vault Workspace
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
              Store, structure, and dynamically parameterize re-usable prompts
              across your workflow.
            </p>
          </div>
          <Link
            to="/prompts/new"
            className="bg-brand hover:bg-brand-hover text-white text-xs font-semibold px-4 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Prompt</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-surface border border-surface-muted p-5 rounded-2xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div
                  className={`p-2 rounded-lg bg-canvas border border-surface-muted ${stat.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? "-" : stat.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Recent Prompts Shelf (Max 4 Items) */}
      <div className="bg-surface border border-surface-muted rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Prompts
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Quick view of your latest templates
            </p>
          </div>
          <Link
            to="/prompts"
            className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center space-x-1"
          >
            <span>Explore Vault</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-16 bg-canvas rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-gray-400 text-center py-6">
            Your prompt vault is empty.
          </p>
        ) : (
          <div className="space-y-3">
            {prompts.map((prompt) => {
              const promptId = prompt._id || prompt.id;
              const categoryLabel =
                typeof prompt.category === "string"
                  ? prompt.category
                  : prompt.category?.name || "General";

              const isCopied = copiedId === promptId;

              return (
                <div
                  key={promptId}
                  onClick={() => setSelectedPrompt(prompt)}
                  className="p-4 rounded-xl bg-canvas border border-surface-muted flex items-center justify-between hover:border-brand/50 transition-all cursor-pointer group"
                >
                  <div className="flex-1 pr-4 min-w-0">
                    <div className="flex items-center space-x-2.5 mb-1">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-brand/10 text-brand border border-brand/20 shrink-0">
                        {categoryLabel}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors truncate">
                        {prompt.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-400 truncate">
                      {prompt.description || prompt.content || prompt.template}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleQuickCopy(e, prompt)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
                      isCopied
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-surface border-surface-muted text-slate-700 dark:text-gray-300 hover:bg-brand hover:text-white hover:border-brand"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Use</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedPrompt && (
        <FillPromptModal
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </div>
  );
}
