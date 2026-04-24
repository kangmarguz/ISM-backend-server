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

export const updateUserProfile = async (req, res, next) => {
    try {
        //TODO: update user profile
        res.json({message: 'Update user profile endpoint'});
    } catch (error) {
        console.log(error);
        next(error);
    }
}