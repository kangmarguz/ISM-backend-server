import jwt from 'jsonwebtoken';
import errorResponse from '../utils/error.js';

const authCheck = (req, res, next) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;

            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        if (!token) {
            return errorResponse('Unauthorized', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DECODE FROM JWT : ",decoded);
        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export default authCheck;