const mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        uqique:true,
    },
    password:{
        type:String,
        required:true,
    },
    creditBalance:{
        type:Number,
        default:5,
    },
})

module.exports = mongoose.model('user',userSchema)