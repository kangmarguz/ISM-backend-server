import jwt from 'jsonwebtoken';
import errorResponse from '../utils/error.js';

const authCheck = (req, res, next) => {
    try {
        //get token from cookie
        let token = req.cookies?.token;

        //IF DONT HAVE TOKEN IN COOKIE THEN CHECK IN HEADER
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
        //SET USER INFO IN REQ OBJECT
        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export default authCheck;