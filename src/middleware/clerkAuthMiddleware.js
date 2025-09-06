const { verifyToken } = require("@clerk/backend");
require("dotenv").config();

const clerkAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Missing auth header" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid auth format" });

    try {
        const { payload } = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        req.userId = payload.sub;
        console.log("req.userId:", req.userId);

        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(401).json({ message: "Invalid token", error: err.message });
    }
};

module.exports = clerkAuthMiddleware;
