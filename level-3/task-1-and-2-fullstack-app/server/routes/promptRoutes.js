import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getPrompts,
    getPromptById,
    createPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
} from "../controllers/promptController.js";

const router = express.Router();

// Apply auth middleware globally to all prompt operations
router.use(protect);

router.route("/").get(getPrompts).post(createPrompt);

router.route("/:id").get(getPromptById).put(updatePrompt).delete(deletePrompt);

router.route("/:id/favorite").patch(toggleFavorite);

export default router;