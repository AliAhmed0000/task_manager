const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

module.exports = () => {
    return (req,res,next) => {
        const authHeader = req.headers['authorization'] || req.header['Authorization'];
        if(!authHeader) {
            const error = appError.create('token is required', 401, httpStatusText.ERROR);
            return next(error);
        }

        const token = authHeader.split(' ')[1];
        try{
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

            req.currentUser = decodedToken;

            next();
            
        } catch(e) {
            const error = appError.create('invalid token', 401, httpStatusText.ERROR);
            return next(error);
        }

        // if(!decodedToken){
        //     const error = appError.create('email or password incorrect', 401, httpStatusText.ERROR);
        //     return next(error);
        // }
    }
}