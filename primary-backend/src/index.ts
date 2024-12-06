import  express from "express";
import { userRouter } from "./routes/User";
import {zapRouter} from './routes/zap'

const app = express()

app.use(express.json())

// app.use(cors())

app.use('/api/v1/user',userRouter)
app.use("/api/v1/zap", zapRouter);

app.listen(3000,() =>{
    console.log("server is listening in port 3000")
})
