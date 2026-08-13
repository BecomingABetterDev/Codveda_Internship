import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Variable,
  Tag as TagIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../api/axios";

export default function AddPrompt() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    description: "",
    content: "",
    tags: "",
  });

  const categories = [
    "Frontend",
    "Backend",
    "Database",
    "DevOps",
    "Refactoring",
    "General",
  ];

  // Real-time extraction of {{placeholders}} to show preview to author
  const detectedPlaceholders = useMemo(() => {
    if (!formData.content) return [];
    const matches =
      formData.content.match(/\{\{\s*([a-zA-Z0-9_\-\s]+)\s*\}\}/g) || [];
    const cleaned = matches
      .map((m) => m.replace(/[\{\}]/g, "").trim())
      .filter(Boolean);
    return [...new Set(cleaned)];
  }, [formData.content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return toast.error("Please enter a prompt title");
    }
    if (!formData.content.trim()) {
      return toast.error("Prompt content cannot be empty");
    }

    setSubmitting(true);
    try {
      const parsedTags = formData.tags
        ? formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      await API.post("/prompts", {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        content: formData.content.trim(),
        tags: parsedTags,
      });

      toast.success("Prompt created and saved to vault!");
      navigate("/prompts");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create prompt");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to="/prompts"
            className="p-2 rounded-xl bg-surface border border-surface-muted text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Create Prompt Template
            </h1>
            <p className="text-gray-400 text-sm">
              Add a reusable template with optional dynamic variables.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="bg-surface border border-surface-muted rounded-2xl p-6 shadow-glass space-y-5">
          {/* Title & Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Prompt Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Node.js Express Controller Generator"
                className="w-full bg-canvas border border-surface-muted rounded-xl px-4 py-2.5 text-white text-xs placeholder-gray-500 focus:ring-1 focus:ring-brand focus:border-brand"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-canvas border border-surface-muted rounded-xl px-4 py-2.5 text-white text-xs focus:ring-1 focus:ring-brand focus:border-brand"
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Short Description (Optional)
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief summary of what this prompt produces..."
              className="w-full bg-canvas border border-surface-muted rounded-xl px-4 py-2.5 text-white text-xs placeholder-gray-500 focus:ring-1 focus:ring-brand focus:border-brand"
            />
          </div>

          {/* Content Body with Placeholder Tip */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Prompt Content <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-gray-400">
                Use{" "}
                <code className="text-brand font-mono">{`{{variableName}}`}</code>{" "}
                for fillable fields
              </span>
            </div>
            <textarea
              name="content"
              rows={8}
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your prompt content here... Example: Write a {{language}} function that accepts {{parameter}} and returns {{outputType}}."
              className="w-full bg-canvas border border-surface-muted rounded-xl p-4 text-white font-mono text-xs placeholder-gray-500 focus:ring-1 focus:ring-brand focus:border-brand leading-relaxed"
              required
            />
          </div>

          {/* Auto-detected Variables Banner */}
          {detectedPlaceholders.length > 0 && (
            <div className="p-3 bg-brand/10 border border-brand/20 rounded-xl flex items-center space-x-3">
              <Variable className="w-4 h-4 text-brand shrink-0" />
              <div className="flex-1 overflow-hidden">
                <span className="text-xs font-medium text-brand block mb-1">
                  Detected Variables ({detectedPlaceholders.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {detectedPlaceholders.map((v) => (
                    <span
                      key={v}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-brand/30 text-white"
                    >
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Tags (Comma separated)
            </label>
            <div className="relative flex items-center">
              <TagIcon className="absolute left-3.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="express, mongodb, controller, refactor"
                className="w-full bg-canvas border border-surface-muted rounded-xl py-2.5 pl-10 pr-4 text-white text-xs placeholder-gray-500 focus:ring-1 focus:ring-brand focus:border-brand"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/prompts")}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-2 shadow-glow transition-all"
          >
            <Save className="w-4 h-4" />
            <span>
              {submitting ? "Saving Template..." : "Save Prompt to Vault"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
