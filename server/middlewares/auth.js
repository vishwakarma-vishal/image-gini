const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.userAuth = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        console.log('0')
        return res.json({
            success: false,
            message: 'Not Authorized. Login Again'
        })
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id;
        } else {
            return res.json({
                success: false,
                messae: 'Not Authorized. Login Again'
            })
        }
        next();

    } catch (err) {
        console.log(err.message)
        res.json({
            success: false,
            message: err.message
        })
    }
}