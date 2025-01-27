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
            return res.status(400).json({
                sucess: false,
                message: 'Missing details'
            })
        }

        const userInDb = await userModel.findOne({ email });
        if (userInDb) {
            return res.status(409).json({
                success: false,
                message: "User already exist, please login."
            });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name, email, password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.status(200).json({
            success: true,
            token,
            user: {
                name: user.name
            }
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User does not exist'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

            res.status(200).json({
                success: true,
                token,
                user: {
                    name: user.name
                }
            })
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

exports.userCredits = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await userModel.findById(userId)

        res.status(200).json({
            success: true,
            credits: user.creditBalance,
            user: {
                name: user.name
            }
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.paymentRazorpay = async (req, res) => {
    try {
        const { userId, planId } = req.body
        const userData = await userModel.findById(userId)

        if (!userId || !planId) {
            return res.json({
                success: false,
                message: 'Missing Details'
            })
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

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error.message)
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                })
            }
            res.status(200).json({ success: true, order })
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
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

            res.status(200).json({ success: true, message: 'Credits Added' })
        } else {
            res.json({
                success: false,
                message: 'Payment Failed'
            })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}