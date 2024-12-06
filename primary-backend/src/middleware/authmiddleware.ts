import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/utils";
import { JsonWebTokenError } from "jsonwebtoken";

export function authMiddleware (req:Request,res:Response,next:NextFunction) {
    const token = req.headers.authorization as unknown as string
    try{
    const payload = jwt.verify(token,JWT_SECRET)
    //@ts-ignore
    req.id = payload.id
    next()
    }
    catch(e){
        res.status(403).json({
            message : "your are not logged in "
        })
        return
    }
}