import { getAllUsersService } from "../service/admin.service.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const result = await getAllUsersService();
        res.json({result});
    } catch (error) {
        console.error('Error fetching all users:', error);
        next(error);
    }
};