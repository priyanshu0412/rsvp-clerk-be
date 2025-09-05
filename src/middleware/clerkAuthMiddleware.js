const { Clerk } = require("@clerk/clerk-sdk-node");
const User = require("../models/user.model");
require("dotenv").config()
const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// -------------------------------------

const clerkAuthMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Missing auth header' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Invalid auth format' });

    try {
        const session = await clerk.verifyToken(token);
        console.log("session.userId" , )

        // if User is not found in DB 
        const isUserExist = await User.findOne({ clerkUserId: session.userId })
        if (!isUserExist) {
            return res.status(400).send({ message: "This User Is Not found In DB" })
        }

        else {
            req.userId = session.userId;
            next();
        }

    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }

}


module.exports = clerkAuthMiddleware