import  express from "express";
<<<<<<< HEAD
import { userRouter } from "./routes/User";
const app = express()

app.use(express.json())

// app.use(cors())

app.use('/api/v1/user',userRouter)

app.listen(3000,() =>{
    console.log("server is listening in port 3000")
})
=======
const app = express()

>>>>>>> 6b6bb5754c9b25e82baddb00e76faf79485a05f2
