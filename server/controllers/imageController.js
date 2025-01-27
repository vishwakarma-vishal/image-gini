const FormData = require('form-data')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const userModel = require('../models/userModel')
const axios = require('axios')

exports.generateImage = async(req,res)=>{
    try{
        console.log('1')
        const {userId, prompt} = req.body

        const user = await userModel.findById(userId)

        if(!user || !prompt){
            console.log('11')
            return res.json({
                success:false,
                message:`Missing Details`
            })
        }

        if(user.creditBalance === 0 || userModel.creditBalance < 0){
            console.log('111')
            return res.json({
                success:false,
                message:`No Credit Balance`,
                creditBalance:user.creditBalance
            })
        }
        const formData = new FormData()
        formData.append('prompt',prompt)
        
        console.log('s')
        console.log('API Key:', process.env.CLIPDROP_API);

        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1',
        formData,
        {
            headers:{
                ...formData.getHeaders(),
                'x-api-key':process.env.CLIPDROP_API,
            },
            responseType:'arraybuffer',
            
        })
        console.log('ss')
        const base64Image = Buffer.from(data,'binary').toString('base64')
        console.log('sss')
        const resultImage = `data:image/png;base64,${base64Image}`
        console.log('ssss')

        await userModel.findByIdAndUpdate(user._id, {creditBalance: user.creditBalance - 1})
        console.log('sssss')
        res.json(
            
            {
            
            success:true,
            message:'Image Generated',
            creditBalance: user.creditBalance -1 ,
            resultImage
        })

    }catch (err) {
        console.log('Error:', err.response?.data || err.message);
        res.json({
            success: false,
            message: err.response?.data?.message || err.message,
        });
    }
}

