"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("./routes/User");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(cors())
app.use('/api/v1/user', User_1.userRouter);
app.listen(3000, () => {
    console.log("server is listening in port 3000");
});
