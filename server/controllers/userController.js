const bcrypt = require('bcryptjs')
require('dotenv').config()
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const transactionModel = require('../models/transactionModel')
const axios = require('axios')
const razorpay = require('razorpay');

exports.registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                sucess: false,
                message: 'Missing details'
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name, email, password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)


        res.json({
            success: true,
            token,
            user: {
                name: user.name
            }
        })

    } catch (err) {
        console.log("error")
        console.error(err.message)
        res.json({
            success: false,
            message: err.message,
        })

    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            console.log('User Does not exist')
            return res.json({
                success: false,
                message: 'User does not exist'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

            res.json({
                success: true,
                token,
                user: {
                    name: user.name
                }
            })
        } else {
            return res.json({
                success: false,
                message: 'Invalid credentials'
            })
        }



    } catch (err) {
        console.log(error)
        console.error(err.message)
        res.json({
            success: false,
            message: err.message
        })

    }
}

exports.userCredits = async (req, res) => {

    try {
        const { userId } = req.body

        const user = await userModel.findById(userId)
        res.json({
            success: true,
            credits: user.creditBalance,
            user: {
                name: user.name
            }
        })
    } catch (err) {
        console.log(err.message)
        res.json({
            success: false,
            messae: err.message
        })
    }

}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.paymentRazorpay = async (req, res) => {
    console.log('5')
    try {
        console.log('55')
        const { userId, planId } = req.body

        const userData = await userModel.findById(userId)

        if (!userId || !planId) {
            console.log('555')
            return res.json({
                success: false,
                message: 'Missin Details'
            })
            console.log('user is not exiest')
        }

        let credits, plan, amount, date

        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;

            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;

            case 'Business':
                plan = 'Businessc'
                credits = 5000
                amount = 250
                break;

            default:
                return res.json({
                    success: false,
                    message: 'plan not found'
                })
        }

        date = Date.now();

        const transactionData = {
            userId, plan, amount, credits, date
        }

        const newTransaction = await transactionModel.create(transactionData)

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id,
        }
        console.log('52')
        await razorpayInstance.orders.create(options, (error, order) => {
            console.log('5555')
            if (error) {
                console.log(error)
                console.log('..1..')
                return res.json({
                    success: false,
                    message: error
                }

                )
            }
            console.log('51')
            res.json({ success: true, order })
        })

    } catch (error) {
        console.log('55555')
        console.log(error)
        console.error(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

exports.verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt)

            if (transactionData.paymet) {
                return res.json({
                    success: false,
                    message: 'Payment Failed'
                })
            }

            const userData = await userModel.findById(transactionData.userId)

            const creditBalance = userData.creditBalance + transactionData.credits
            await userModel.findByIdAndUpdate(userData._id, { creditBalance })

            await transactionModel.findByIdAndUpdate(transactionData._id, { paymet: true })

            res.json({ success: true, message: 'Credits Added' })
        } else {
            res.json({
                success: false,
                message: 'Payment Failed'

            })
        }
    } catch (error) {
        console.log(error);
    }
}