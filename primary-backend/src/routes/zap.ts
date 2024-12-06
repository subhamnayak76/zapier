import {Router} from 'express'

import { authMiddleware } from '../middleware/auth'
import { ZapCreateSchema } from '../types/types'
import { prismaClient } from '../config/db'

const router = Router()

router.post('/',authMiddleware,async (req,res) =>{
    const body = req.body
    //@ts-ignore
    const id : string = req.id
    const parsedData = ZapCreateSchema.safeParse(body)
    if(!parsedData.success) {
        res.status(411).json({
            message : "Incorrects inputs"
        })
        return
    }

    const zapid = await prismaClient.$transaction(async tx => {
        const zap = await prismaClient.zap.create({
            data : {
                userId : parseInt(id),
                triggerId : "",
                action : {
                    create: parsedData.data.actions.map((x,index) =>({
                        actionId : x.availableActionsId,
                        sortingOrder : index
                    }))
                }
            }
        })
        const trigger = await tx.trigger.create({
            data : {
                triggerId : parsedData.data.availableTriggerId,
                zapId : zap.id
            }
        })
        await tx.zap.update({
            where : {
                id : zap.id
            },
            data : {
                triggerId : trigger.id
            }
        })
        return zap.id
    })
    res.json({
        zapid
    })
})

router.get('/',authMiddleware,async(req,res) =>{

    //@ts-ignore
    const id = req.id
    const zapId = req.params.zapId
    const zap = await prismaClient.zap.findMany({
        where : {
            id : zapId,
            userId : id
        },
        include : {
            action : {
                include : {
                    type : true
                }
            }
        }
    })
    res.json({
        zap
    })
    
})

export const zapRouter = router;