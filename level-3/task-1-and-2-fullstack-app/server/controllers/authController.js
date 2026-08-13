import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "devvolt_secret_key_2026", {
        expiresIn: "7d",
    });
};

export const registerUser = asyncHandler(async(req, res) => {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields (username, email, password) are required");
    }

    username = String(username).trim();
    email = String(email).trim().toLowerCase();

    if (username.length < 3 || username.length > 30) {
        res.status(400);
        throw new Error("Username must be between 3 and 30 characters");
    }

    if (!EMAIL_REGEX.test(email)) {
        res.status(400);
        throw new Error("Invalid email address format");
    }

    if (password.length < 6 || password.length > 128) {
        res.status(400);
        throw new Error("Password must be between 6 and 128 characters");
    }

    const userExists = await User.findOne({ email }).lean();
    if (userExists) {
        res.status(400);
        throw new Error("An account with this email address already exists");
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
        success: true,
        data: {
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        },
    });
});

export const loginUser = asyncHandler(async(req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Email and password are required");
    }

    email = String(email).trim().toLowerCase();

    const user = await User.findOne({
        email: new RegExp("^" + req.body.email + "$", "i"),
    });
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            },
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

export const getMe = asyncHandler(async(req, res) => {
    res.status(200).json({
        success: true,
        data: req.user,
    });
});