import prisma from '../config/prismaclient.js';
import errorResponse from '../utils/error.js';

export const getAllUsersService = async () => {
    const result = await prisma.user.findMany({
        omit: {
            password: true,
            createdAt: true,
            updatedAt: true,
            passwordResetRequired: true,
        }
    });
    return result;
};