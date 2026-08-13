import React, { useState } from "react";
import { Wand2, Sparkles, Copy, Save, Check, Code2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function PromptBuilder() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [role, setRole] = useState("Senior Full-Stack Engineer");
  const [outputFormat, setOutputFormat] = useState(
    "Clean Code & Markdown Explanation"
  );
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!goal.trim()) {
      toast.error("Please enter a prompt objective!");
      return;
    }

    const template = `You are an expert ${role}.\n\nObjective:\n${goal}\n\nInput Context:\n- Code Snippet / Context: {{context}}\n- Output Requirements: ${outputFormat}\n\nPlease generate a clean, modular solution with inline explanations.`;

    setGeneratedPrompt(template);
    if (!title) setTitle(`AI Generated: ${goal.slice(0, 30)}...`);
    toast.success("Prompt template formulated!");
  };

  const handleSaveToVault = async () => {
    if (!generatedPrompt) return;
    setSaving(true);
    try {
      const placeholders = Array.from(
        generatedPrompt.matchAll(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g),
        (m) => m[1]
      );

      await API.post("/prompts", {
        title: title || "Untitled AI Prompt",
        category,
        description: `Generated prompt for: ${goal}`,
        content: generatedPrompt,
        template: generatedPrompt,
        placeholders: [...new Set(placeholders)],
        tags: ["ai-generated", category.toLowerCase()],
      });

      toast.success("Saved directly to your Prompt Vault!");
      navigate("/prompts");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save prompt");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-surface border border-surface-muted rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Wand2 className="w-6 h-6 text-brand" />
            <span>AI Prompt Studio</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Build structured, production-grade prompts with dynamic variables.
          </p>
        </div>
      </div>

      {/* Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Configurator Card */}
        <div className="lg:col-span-5 bg-surface border border-surface-muted p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-surface-muted pb-3">
              Prompt Parameters
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
                Objective / Task Goal
              </label>
              <textarea
                rows={4}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Refactor Express route handler to use async/await and robust input validation..."
                className="w-full bg-canvas border border-surface-muted rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
                  Persona Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-canvas border border-surface-muted rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-canvas border border-surface-muted rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Refactoring">Refactoring</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
                Output Format
              </label>
              <input
                type="text"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full bg-canvas border border-surface-muted rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-brand hover:bg-brand-hover text-white text-xs font-semibold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 mt-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Structured Template</span>
          </button>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-7 bg-surface border border-surface-muted p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-surface-muted pb-3 mb-4">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-brand" />
                <span>Generated Output Preview</span>
              </h2>
              {generatedPrompt && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPrompt);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? "Copied" : "Copy Template"}</span>
                </button>
              )}
            </div>

            {generatedPrompt ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Template Title..."
                  className="w-full bg-canvas border border-surface-muted rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
                <textarea
                  rows={12}
                  value={generatedPrompt}
                  onChange={(e) => setGeneratedPrompt(e.target.value)}
                  className="w-full bg-canvas border border-surface-muted rounded-xl p-3.5 text-xs text-brand font-mono focus:outline-none leading-relaxed"
                />
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-gray-500 border border-dashed border-surface-muted rounded-2xl">
                <Wand2 className="w-10 h-10 mb-3 opacity-40 text-brand" />
                <p className="text-xs max-w-sm">
                  Configure your parameters on the left to generate an optimized
                  prompt template with dynamic variables.
                </p>
              </div>
            )}
          </div>

          {generatedPrompt && (
            <button
              onClick={handleSaveToVault}
              disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>
                {saving ? "Saving to Vault..." : "Save to Prompt Vault"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
