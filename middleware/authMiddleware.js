import jwt from 'jsonwebtoken'
import { ApiError } from '../exceptions/ApiError.js';

export const authMiddleware = async (req, res, next) => {
    try{
        const authorization = req.headers.authorization
        
        if (!authorization){
            throw ApiError.Unauthorized()
        }
        
        const token = authorization.split(" ")[1];
        const isCustomAuth = token.length < 500

        let decodedData

        if (token && isCustomAuth){
            decodedData = jwt.decode(token, process.env.JWT_ACCESS_SECRET)
            req.userId = decodedData?.id
        } else {
            decodedData = jwt.decode(token)
            req.userId = decodedData?.sub
        }
        next()
    } catch(e){
        console.log(e)
    }
}