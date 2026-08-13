import React, { useState } from "react";
import { Star, Copy, Check, Edit3, Trash2, Tag } from "lucide-react";

export default function PromptCard({
  prompt,
  onToggleFavorite,
  onEdit,
  onDelete,
  onSelect,
}) {
  const [copied, setCopied] = useState(false);

  // Safely normalize MongoDB _id vs id and favorite state
  const promptId = prompt._id || prompt.id;
  const isFav = Boolean(prompt.isFavorite ?? prompt.favorite);

  // Normalize category text string
  const categoryLabel =
    typeof prompt.category === "string"
      ? prompt.category
      : prompt.category?.name || "General";

  // Normalize tags list
  const tagList = Array.isArray(prompt.tags)
    ? prompt.tags
    : typeof prompt.tags === "string"
    ? prompt.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const handleCopy = (e) => {
    e.stopPropagation();
    const contentToCopy = prompt.template || prompt.content || "";
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => onSelect && onSelect(prompt)}
      className="bg-surface border border-surface-muted rounded-2xl p-5 hover:border-brand/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:shadow-glow relative overflow-hidden h-full"
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Visible Category Badge */}
          <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-lg bg-brand/10 text-brand border border-brand/20">
            {categoryLabel}
          </span>

          <div className="flex items-center space-x-1">
            {/* Favorite Star Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite && onToggleFavorite(promptId, e);
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-surface-hover transition-colors"
              title={isFav ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Star
                className={`w-4 h-4 transition-all duration-200 ${
                  isFav
                    ? "text-amber-400 fill-amber-400 scale-110"
                    : "text-gray-400 fill-none hover:text-amber-400"
                }`}
              />
            </button>

            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(prompt, e);
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover transition-colors"
              title="Edit Prompt"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(prompt, e);
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-surface-hover transition-colors"
              title="Delete Prompt"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-white group-hover:text-brand transition-colors line-clamp-1 mb-1.5">
          {prompt.title}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {prompt.description || "No description provided."}
        </p>
      </div>

      {/* Footer Tags & Actions */}
      <div className="pt-3 border-t border-surface-muted/60 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center space-x-1.5 overflow-hidden">
          <Tag className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {tagList.length > 0 ? (
              tagList.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] font-medium text-gray-400 bg-canvas rounded-md border border-surface-muted whitespace-nowrap"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-gray-500 italic">No tags</span>
            )}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            copied
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-surface-hover text-gray-200 hover:text-white hover:bg-brand/20 hover:border-brand/30 border border-transparent"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
