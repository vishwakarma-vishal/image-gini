const mongoose = require("mongoose")

require('dotenv').config()



const connectDB =async()=>{

    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })

    .then(()=>{
        console.log("Database Connected")
        console.log("    ")
        console.log("    ")
        console.log("    ")
    })
    .catch((err)=>{
        console.log('error come during connect Database')
        console.error(err.message)
        process.exit(1)
})
}

module.exports=connectDB;