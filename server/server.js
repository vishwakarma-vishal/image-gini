const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/mongodb')
const userRouter = require('./routes/userRouter')
const imageRouter = require('./routes/imageRoutes')

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(cors())

connectDB()

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

