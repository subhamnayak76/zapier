"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../config/utils");
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    try {
        const payload = jsonwebtoken_1.default.verify(token, utils_1.JWT_SECRET);
        //@ts-ignore
        req.id = payload.id;
        next();
    }
    catch (e) {
        res.status(403).json({
            message: "your are not logged in "
        });
        return;
    }
}
