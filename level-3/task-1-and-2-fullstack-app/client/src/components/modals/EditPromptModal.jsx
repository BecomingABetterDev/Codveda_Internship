import React, { useState } from "react";
import { X, Sparkles, Tag, Folder, Edit3 } from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../../api/axios";

export default function EditPromptModal({ prompt, onClose, onSuccess }) {
  const promptId = prompt._id || prompt.id;

  const [formData, setFormData] = useState({
    title: prompt.title || "",
    category:
      typeof prompt.category === "string"
        ? prompt.category
        : prompt.category?.name || "General",
    description: prompt.description || "",
    content: prompt.content || prompt.template || "",
    tags: Array.isArray(prompt.tags)
      ? prompt.tags.join(", ")
      : prompt.tags || "",
  });

  const [saving, setSaving] = useState(false);

  const categories = [
    "Frontend",
    "Backend",
    "Database",
    "DevOps",
    "Refactoring",
    "General",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Auto extract placeholders like {{variable}}
      const detectedPlaceholders = Array.from(
        formData.content.matchAll(/\{\{\s*([a-zA-Z0-0_-]+)\s*\}\}/g),
        (m) => m[1]
      );
      const uniquePlaceholders = [...new Set(detectedPlaceholders)];

      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        content: formData.content,
        template: formData.content,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        placeholders: uniquePlaceholders,
      };

      await API.put(`/prompts/${promptId}`, payload);
      toast.success("Prompt updated successfully!");
      onSuccess && onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update prompt");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-surface border border-surface-muted rounded-2xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-muted flex items-center justify-between">
          <div className="flex items-center space-x-2 text-brand">
            <Edit3 className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">
              Edit Prompt Template
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto max-h-[80vh]"
        >
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-canvas border border-surface-muted rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-canvas border border-surface-muted rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand"
            >
              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-surface text-white"
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Short description..."
              className="w-full bg-canvas border border-surface-muted rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand"
            />
          </div>

          {/* Content / Template */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Prompt Content (Use {"{{variable}}"} for dynamic inputs)
            </label>
            <textarea
              required
              rows={5}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full bg-canvas border border-surface-muted rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-brand"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="react, tailwind, refactor"
              className="w-full bg-canvas border border-surface-muted rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-surface-muted flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-brand hover:bg-brand-hover text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-glow disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
