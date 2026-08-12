import express from "express";
import {
    getPrompts,
    createPrompt,
    updatePrompt,
    deletePrompt,
} from "../controllers/promptController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getPrompts).post(createPrompt);
router.route("/:id").put(updatePrompt).delete(deletePrompt);

export default router;