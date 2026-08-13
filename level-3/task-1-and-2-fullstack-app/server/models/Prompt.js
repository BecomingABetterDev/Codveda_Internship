import mongoose from "mongoose";

const promptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "User",
        index: true,
    },
    title: {
        type: String,
        required: [true, "Prompt title is required"],
        trim: true,
        maxlength: [150, "Title cannot exceed 150 characters"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
        enum: {
            values: [
                "Frontend",
                "Backend",
                "Database",
                "DevOps",
                "Refactoring",
                "General",
            ],
            message: "{VALUE} is not a valid category",
        },
        default: "General",
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, "Description cannot exceed 500 characters"],
        default: "",
    },
    content: {
        type: String,
        required: [true, "Prompt content is required"],
        trim: true,
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true,
    }, ],
    placeholders: [{
        type: String,
        trim: true,
    }, ],
    isFavorite: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
});

// Compound indexes for user-scoped queries and performance sorting
promptSchema.index({ user: 1, category: 1, isFavorite: 1, createdAt: -1 });
promptSchema.index({ user: 1, title: "text", content: "text", tags: "text" });

export default mongoose.model("Prompt", promptSchema);