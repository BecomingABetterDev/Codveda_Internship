import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async(req, res, next) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500);
        throw new Error("Server Configuration Error: Missing JWT_SECRET");
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401);
        throw new Error("Unauthorized: Missing or malformed authorization header");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id).select("-password").lean();

        if (!user) {
            res.status(401);
            throw new Error(
                "Unauthorized: User belonging to this token no longer exists"
            );
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Unauthorized: Token invalid or expired");
    }
});