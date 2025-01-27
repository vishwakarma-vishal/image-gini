const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.userAuth = async (req,res,next)=>{
    const {token }= req.headers;

    if(!token){
        console.log('0')
        return res.json({
            success:false,
            message:'Not Authorized. Login Again'
        })

    }

    try{
        console.log('00')
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if(tokenDecode.id){
            console.log('000')
            req.body.userId = tokenDecode.id;
        }else{
            console.log('0000')
            return res.json({
                success: false,
                messae:'Not Authorized. Login Again'
            })
        }

        next();

    }catch(err){
        console.log('00000')
         console.log(err.message)
        res.json({
            success:false,
            message:err.message
        })
    }
}