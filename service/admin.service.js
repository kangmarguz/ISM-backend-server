import prisma from '../config/prismaclient.js';
import errorResponse from '../utils/error.js';

export const getAllUsersService = async () => {
    const result = await prisma.user.findMany({
        where: {
            isActive: true,
            role: {
                in: ['USER', 'GUEST'],
            },
        },
        omit: {
            password: true,
            createdAt: true,
            updatedAt: true,
            passwordResetRequired: true,
        },
    });
    return result;
};

export const getAllAdminService = async () => {
    const result = await prisma.user.findMany({
        where: {
            role: 'ADMIN',
        }
    });
    return result;
}
