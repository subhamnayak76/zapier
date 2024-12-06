"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const types_1 = require("../types/types");
const db_1 = require("../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../config/utils");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = types_1.SignupSchema.safeParse(body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.status(411).json({
            message: "Incorrect inputs"
        });
        return;
    }
    const userExists = yield db_1.prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username
        }
    });
    if (userExists) {
        res.status(403).json({
            message: "user is already exists"
        });
        return;
    }
    const salt = 10;
    const hashedpass = yield bcrypt_1.default.hash(parsedData.data.password, salt);
    yield db_1.prismaClient.user.create({
        data: {
            email: parsedData.data.username,
            password: hashedpass,
            name: parsedData.data.name
        }
    });
    res.json({
        message: "Please verify your account by checking your email"
    });
    return;
}));
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = types_1.SigninSchema.safeParse(body);
    if (!parsedData.success) {
        res.status(411).json({
            message: "invalid username or password"
        });
        return;
    }
    const user = yield db_1.prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username
        }
    });
    if (!user) {
        res.status(403).json({
            message: " invalid username or password"
        });
        return;
    }
    const correctPass = yield bcrypt_1.default.compare(parsedData.data.password, user.password);
    if (!correctPass) {
        res.status(403).json({
            message: "invalid username or password"
        });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, utils_1.JWT_SECRET);
    res.json({
        token: token
    });
}));
router.get("/user", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const user = yield db_1.prismaClient.user.findFirst({
        where: {
            id
        },
        select: {
            name: true,
            email: true
        }
    });
    res.json({
        user
    });
}));
exports.userRouter = router;
