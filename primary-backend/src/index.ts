import  express from "express";
import { userRouter } from "./routes/User";
const app = express()

app.use(express.json())

// app.use(cors())

app.use('/api/v1/user',userRouter)

app.listen(3000,() =>{
    console.log("server is listening in port 3000")
})