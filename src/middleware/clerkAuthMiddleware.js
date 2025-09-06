const { verifyToken } = require("@clerk/backend");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const clerkAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Missing auth header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Invalid auth format" });
    }

    try {
        // Debug: dekh audience kya aa raha hai
        const decoded = jwt.decode(token);
        console.log("🔑 Decoded token:", decoded);

        const  payload  = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
            issuer: "https://intent-terrier-89.clerk.accounts.dev",
            // audience: "https://rsvp-clerk-be.onrender.com", // abhi hata diya
        });

        console.log("✅ Token verified payload:", payload);

        req.userId = payload.sub;
        console.log("req.userId:", req.userId);

        next();
    } catch (err) {
        console.error("❌ JWT verification failed:", err.message);
        return res.status(401).json({ message: "Invalid token", error: err.message });
    }
};

module.exports = clerkAuthMiddleware;
