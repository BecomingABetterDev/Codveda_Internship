import Prompt from "../models/Prompt.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Parse and deduplicate {{variable}} placeholders safely
const extractVariables = (text) => {
    if (typeof text !== "string") return [];
    const matches = text.match(/\{\{([^}]+)\}\}/g);
    if (!matches) return [];

    // Clean, trim, and cap maximum placeholder count to prevent payload bloating
    const vars = matches
        .map((m) => m.replace(/[\{\}]/g, "").trim())
        .filter((v) => v.length > 0 && v.length <= 50);

    return [...new Set(vars)].slice(0, 20);
};

export const getPrompts = asyncHandler(async(req, res) => {
    const { category, search, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const query = { user: req.user._id };

    if (category && category !== "All" && typeof category === "string") {
        query.category = category.trim();
    }

    if (search && typeof search === "string") {
        const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.$or = [
            { title: { $regex: sanitizedSearch, $options: "i" } },
            { body: { $regex: sanitizedSearch, $options: "i" } },
        ];
    }

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
        },
    });
});

export const createPrompt = asyncHandler(async(req, res) => {
    let { title, category, body, notes } = req.body;

    if (!title || !body) {
        res.status(400);
        throw new Error("Title and body are required fields");
    }

    title = String(title).trim();
    body = String(body).trim();
    notes = notes ? String(notes).trim() : "";
    category = category ? String(category).trim() : "General";

    if (title.length > 100) {
        res.status(400);
        throw new Error("Title cannot exceed 100 characters");
    }

    if (notes.length > 500) {
        res.status(400);
        throw new Error("Notes cannot exceed 500 characters");
    }

    const variables = extractVariables(body);

    const prompt = await Prompt.create({
        user: req.user._id,
        title,
        category,
        body,
        variables,
        notes,
    });

    res.status(201).json({
        success: true,
        data: prompt,
    });
});

export const updatePrompt = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const prompt = await Prompt.findById(id);

    if (!prompt) {
        res.status(404);
        throw new Error("Prompt record not found");
    }

    if (prompt.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Access forbidden: You do not own this resource");
    }

    let { title, category, body, notes } = req.body;

    if (title !== undefined) prompt.title = String(title).trim();
    if (category !== undefined) prompt.category = String(category).trim();
    if (notes !== undefined) prompt.notes = String(notes).trim();

    if (body !== undefined) {
        prompt.body = String(body).trim();
        prompt.variables = extractVariables(prompt.body);
    }

    const updatedPrompt = await prompt.save();

    res.status(200).json({
        success: true,
        data: updatedPrompt,
    });
});

export const deletePrompt = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const prompt = await Prompt.findById(id);

    if (!prompt) {
        res.status(404);
        throw new Error("Prompt record not found");
    }

    if (prompt.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Access forbidden: You do not own this resource");
    }

    await prompt.deleteOne();

    res.status(200).json({
        success: true,
        data: { id },
        message: "Prompt permanently deleted",
    });
});