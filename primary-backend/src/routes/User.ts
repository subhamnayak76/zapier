
import { Router } from 'express'
import { SigninSchema, SignupSchema } from '../types/types'
import { prismaClient } from '../config/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/utils'
import { authMiddleware } from '../middleware/auth'
const router = Router()

router.post("/signup",  async(req, res)  =>{
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);

    if (!parsedData.success) {
        console.log(parsedData.error);
          res.status(411).json({
            message: "Incorrect inputs"
        })
        return
    }
    const userExists = await prismaClient.user.findFirst({
        where : {
            email : parsedData.data.username
        }
    })
    if(userExists){
        res.status(403).json({
            message : "user is already exists"
        })
        return
    }
    const salt = 10
    const hashedpass = await bcrypt.hash(parsedData.data.password, salt)
    
    await prismaClient.user.create({
        data : {
            email : parsedData.data.username,
            password : hashedpass,
            name : parsedData.data.name
        }
    })
    
      res.json({
        message: "Please verify your account by checking your email"
    });
    return
}) 

router.post('/signin',async(req,res) =>{
        const body = req.body
        const parsedData = SigninSchema.safeParse(body)
        if(!parsedData.success){
            res.status(411).json({
                message: "invalid username or password"
            })
            return
        }
    const user = await prismaClient.user.findFirst({
        where : {
            email : parsedData.data.username
        }
    })
    if(!user){
        res.status(403).json({
            message :" invalid username or password"
        })
        return
    }

    const correctPass = await bcrypt.compare(parsedData.data.password,user.password)
    if(!correctPass){
        res.status(403).json({
            message : "invalid username or password"
        })
        return
    }
    const token = jwt.sign({id: user.id},JWT_SECRET)
    res.json({
        token: token
    })
})

router.get("/user",authMiddleware, async (req,res)=>{
    //@ts-ignore
   const id = req.id 
   const user = await prismaClient.user.findFirst({
    where : {
        id
    },
    select : {
        name : true,
        email : true
    }
   })
   res.json({
    user
   })
})

export const userRouter = router
