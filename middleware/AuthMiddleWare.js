const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await userModel.findById(decoded.userID).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Access denied");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Access denied");
    }
});

module.exports = { protect };