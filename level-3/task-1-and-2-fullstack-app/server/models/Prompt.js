import mongoose from "mongoose";

const promptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: [true, "Prompt title is required"],
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"],
    },
    category: {
        type: String,
        enum: [
            "Architecture",
            "Refactoring",
            "Debugging",
            "Documentation",
            "General",
        ],
        default: "General",
    },
    body: {
        type: String,
        required: [true, "Prompt body is required"],
    },
    variables: [{
        type: String,
        trim: true,
    }, ],
    notes: {
        type: String,
        trim: true,
        maxlength: [500, "Notes cannot exceed 500 characters"],
    },
}, { timestamps: true });

// Compound index for user query isolation and sorted retrieval
promptSchema.index({ user: 1, category: 1 });
promptSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Prompt", promptSchema);