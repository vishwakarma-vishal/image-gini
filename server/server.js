const express = require('express')
const cors = require ('cors')
require('dotenv').config()
const connectDB = require('./config/mongodb')
const userRouter =require('./routes/userRouter')
const imageRouter =require('./routes/imageRoutes')


const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use(cors())

connectDB()

app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)



app.get("/",(req,res)=>{
    res.send('yah mera page he re babu ')
})

app.listen(PORT,()=>{
    console.log("    ")
    console.log("    ")
    console.log("    ")
    console.log('server start successfully at')
    console.log('http://localhost:',PORT)
    
})

