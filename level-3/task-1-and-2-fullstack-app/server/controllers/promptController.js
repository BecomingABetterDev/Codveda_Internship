import mongoose from "mongoose";
import Prompt from "../models/Prompt.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Helper: Extract unique template variable tokens matching {{variableName}}
 * @param {string} text
 * @returns {string[]} Unique array of placeholder token strings
 */
const extractPlaceholders = (text) => {
    if (!text || typeof text !== "string") return [];
    const matches = text.match(/\{\{\s*([a-zA-Z0-9_\-\s]+)\s*\}\}/g) || [];
    const cleaned = matches
        .map((match) => match.replace(/[\{\}]/g, "").trim())
        .filter(Boolean);
    return [...new Set(cleaned)];
};

/**
 * @desc    Get paginated, filtered, and searched prompts for authenticated user
 * @route   GET /api/v1/prompts
 * @access  Private
 */
export const getPrompts = asyncHandler(async(req, res) => {
    const { category, search, favorite, page = 1, limit = 10 } = req.query;

    // Sanitize and bound pagination bounds strictly
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const query = { user: req.user._id };

    // Category Filter
    if (category && category !== "All" && typeof category === "string") {
        query.category = category.trim();
    }

    // Favorite Filter
    if (favorite !== undefined && favorite !== "") {
        query.isFavorite = favorite === "true";
    }

    // Regex Search with Escaped Input to prevent ReDoS / Pattern Injection
    if (search && typeof search === "string" && search.trim() !== "") {
        const sanitizedSearch = search
            .trim()
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const searchRegex = new RegExp(sanitizedSearch, "i");

        query.$or = [
            { title: { $regex: searchRegex } },
            { content: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { tags: { $in: [searchRegex] } },
        ];
    }

    // Execute database count and lean query concurrently for max performance
    const [prompts, total] = await Promise.all([
        Prompt.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
        Prompt.countDocuments(query),
    ]);

    res.status(200).json({
        success: true,
        data: prompts,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
            hasNextPage: pageNum * limitNum < total,
            hasPrevPage: pageNum > 1,
        },
    });
});

/**
 * @desc    Get single prompt by ID
 * @route   GET /api/v1/prompts/:id
 * @access  Private
 */
export const getPromptById = asyncHandler(async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("Invalid prompt ID format");
    }

    const prompt = await Prompt.findOne({ _id: id, user: req.user._id }).lean();

    if (!prompt) {
        res.status(404);
        throw new Error("Prompt not found in vault");
    }

    res.status(200).json({ success: true, data: prompt });
});

/**
 * @desc    Create a new user prompt with dynamic placeholder parsing
 * @route   POST /api/v1/prompts
 * @access  Private
 */
export const createPrompt = asyncHandler(async(req, res) => {
    const { title, category, description, content, tags } = req.body;

    // Strict Validation
    if (!title || typeof title !== "string" || !title.trim()) {
        res.status(400);
        throw new Error("A valid prompt title is required");
    }

    if (!content || typeof content !== "string" || !content.trim()) {
        res.status(400);
        throw new Error("Prompt content cannot be empty");
    }

    const sanitizedTitle = title.trim();
    const sanitizedContent = content.trim();
    const sanitizedDescription =
        typeof description === "string" ? description.trim() : "";

    // Sanitize tags
    const sanitizedTags = Array.isArray(tags) ?
        [
            ...new Set(
                tags
                .filter((t) => typeof t === "string" && t.trim())
                .map((t) => t.trim().toLowerCase())
            ),
        ] :
        [];

    // Parse {{placeholders}} automatically
    const placeholders = extractPlaceholders(sanitizedContent);

    const prompt = await Prompt.create({
        user: req.user._id,
        title: sanitizedTitle,
        category: category && typeof category === "string" ? category.trim() : "General",
        description: sanitizedDescription,
        content: sanitizedContent,
        tags: sanitizedTags,
        placeholders,
    });

    res.status(201).json({ success: true, data: prompt });
});

/**
 * @desc    Update existing prompt
 * @route   PUT /api/v1/prompts/:id
 * @access  Private
 */
export const updatePrompt = asyncHandler(async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("Invalid prompt ID format");
    }

    const prompt = await Prompt.findOne({ _id: id, user: req.user._id });

    if (!prompt) {
        res.status(404);
        throw new Error("Prompt not found in vault");
    }

    const { title, category, description, content, tags } = req.body;

    if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            res.status(400);
            throw new Error("Title cannot be blank");
        }
        prompt.title = title.trim();
    }

    if (content !== undefined) {
        if (typeof content !== "string" || !content.trim()) {
            res.status(400);
            throw new Error("Content cannot be blank");
        }
        prompt.content = content.trim();
        prompt.placeholders = extractPlaceholders(prompt.content);
    }

    if (category !== undefined && typeof category === "string") {
        prompt.category = category.trim();
    }

    if (description !== undefined && typeof description === "string") {
        prompt.description = description.trim();
    }

    if (tags !== undefined && Array.isArray(tags)) {
        prompt.tags = [
            ...new Set(
                tags
                .filter((t) => typeof t === "string" && t.trim())
                .map((t) => t.trim().toLowerCase())
            ),
        ];
    }

    const updatedPrompt = await prompt.save();

    res.status(200).json({ success: true, data: updatedPrompt });
});

/**
 * @desc    Toggle prompt favorite state
 * @route   PATCH /api/v1/prompts/:id/favorite
 * @access  Private
 */
export const toggleFavorite = asyncHandler(async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("Invalid prompt ID format");
    }

    const prompt = await Prompt.findOne({ _id: id, user: req.user._id });

    if (!prompt) {
        res.status(404);
        throw new Error("Prompt not found in vault");
    }

    prompt.isFavorite = !prompt.isFavorite;
    await prompt.save();

    res.status(200).json({ success: true, data: prompt });
});

/**
 * @desc    Delete prompt from vault
 * @route   DELETE /api/v1/prompts/:id
 * @access  Private
 */
export const deletePrompt = asyncHandler(async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("Invalid prompt ID format");
    }

    const prompt = await Prompt.findOneAndDelete({ _id: id, user: req.user._id });

    if (!prompt) {
        res.status(404);
        throw new Error("Prompt not found in vault");
    }

    res
        .status(200)
        .json({ success: true, message: "Prompt permanently removed from vault" });
});