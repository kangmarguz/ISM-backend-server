import errorResponse from "../utils/error.js";

export const authorizeRoles = (role) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                return errorResponse('Unauthorized', 401);
            }
            if (role.toLowerCase() !== user.role.toLowerCase()) {
                return errorResponse('Forbidden: Access denied', 403);
            }
            next();
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
};
