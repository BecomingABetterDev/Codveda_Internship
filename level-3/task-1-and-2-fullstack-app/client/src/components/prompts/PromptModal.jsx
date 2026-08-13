import React, { useState, useMemo } from "react";
import { X, Copy, Check, Variable } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PromptModal({ prompt, onClose }) {
  const [variableValues, setVariableValues] = useState({});
  const [copied, setCopied] = useState(false);

  if (!prompt) return null;

  // Safe fallback extractions
  const placeholders = Array.isArray(prompt.placeholders)
    ? prompt.placeholders
    : [];
  const rawContent = prompt.content || "";
  const category = prompt.category || "General";
  const title = prompt.title || "Untitled Prompt";

  // Compute interpolated text dynamically
  const interpolatedContent = useMemo(() => {
    let text = rawContent;
    placeholders.forEach((variable) => {
      const userVal = variableValues[variable];
      const replacement =
        userVal && userVal.trim() !== "" ? userVal.trim() : `{{${variable}}}`;
      text = text.replace(
        new RegExp(`\\{\\{\\s*${variable}\\s*\\}\\}`, "g"),
        replacement
      );
    });
    return text;
  }, [rawContent, placeholders, variableValues]);

  const handleInputChange = (variable, value) => {
    setVariableValues((prev) => ({ ...prev, [variable]: value }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(interpolatedContent);
      setCopied(true);
      toast.success("Formatted prompt copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-surface border border-surface-muted rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-glass overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-muted flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-brand/20 text-brand border border-brand/30">
              {category}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-slate-500 hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Variables Section */}
          {placeholders.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                <Variable className="w-4 h-4 text-brand" />
                <span>Fill Dynamic Variables ({placeholders.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {placeholders.map((variable) => (
                  <div key={variable}>
                    <label className="block text-xs font-mono text-brand mb-1">
                      {`{{${variable}}}`}
                    </label>
                    <input
                      type="text"
                      value={variableValues[variable] || ""}
                      onChange={(e) =>
                        handleInputChange(variable, e.target.value)
                      }
                      placeholder={`Enter ${variable}...`}
                      className="w-full bg-canvas border border-surface-muted rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-brand focus:border-brand"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">
              No variable tokens detected in this prompt. Ready to copy
              directly.
            </p>
          )}

          {/* Live Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Live Output Preview
              </label>
              <span className="text-xs text-gray-600">
                {interpolatedContent.length} chars
              </span>
            </div>
            <div className="p-4 bg-canvas border border-surface-muted rounded-xl font-mono text-xs text-gray-500 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {interpolatedContent}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-muted flex items-center justify-end space-x-3 bg-surface">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-slate-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-slate-900 dark:text-white text-xs font-semibold flex items-center space-x-2 shadow-glow transition-all"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>
              {copied ? "Copied to Clipboard!" : "Copy Formatted Prompt"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
