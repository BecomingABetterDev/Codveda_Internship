import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({ prompt, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-surface border border-surface-muted rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-1">Delete Prompt?</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Are you sure you want to remove{" "}
            <span className="text-white font-semibold">"{prompt?.title}"</span>{" "}
            from your vault? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-all shadow-glow disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}
