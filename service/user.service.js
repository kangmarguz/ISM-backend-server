import prisma from '../config/prismaclient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import errorResponse from '../utils/error.js';
import { saltPassword } from '../utils/salt.password.js';

export const userLoginService = async (username, email, password) => {
    if (!username || !password) {
        return errorResponse('Email and password are required.', 400);
    }

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        return errorResponse('Invalid email or password.', 401);
    }

    if (!user.isActive) {
        return errorResponse('Your account is inactive. Please contact admin.', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return errorResponse('Invalid email or password.', 401);
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

export const userRegisterService = async (
    name,
    username,
    email,
    password,
    phone,
) => {
    if (!name || !email || !password || !username) {
        return errorResponse('Name, email, and password are required.', 400);
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { username }],
        },
    });

    if (existingUser) {
        if (existingUser.email === email) {
            return errorResponse('Email already registered.', 409);
        }
        if (existingUser.username === username) {
            return errorResponse('Username already taken.', 409);
        }
    }

    const hashedPassword = await saltPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            username,
            email,
            phone: phone || '',
            password: hashedPassword,
        },
    });

    return user;
};

export const userCreateByAdminService = async (name, username, email, role) => {
    if (!name || !username || !email) {
        return errorResponse('Name, username, and email are required.', 400);
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ username: username }, { email: email }],
        },
    });

    if (existingUser) {
        return errorResponse('Username or email already in use.', 409);
    }

    const hashedPassword = await saltPassword(
        process.env.DEFAULT_USER_PASSWORD,
    );

    const user = await prisma.user.create({
        data: {
            name,
            username,
            email,
            password: hashedPassword,
            role: role || 'GUEST',
            passwordResetRequired: true,
        },
    });

    return user;
};

export const getAllUserByAdminService = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            passwordResetRequired: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return users;
};

export const updateUserRoleService = async (id, role) => {
    if (!id) {
        return errorResponse('User id is required.', 400);
    }

    if (!role || typeof role !== 'string') {
        return errorResponse('Role is required.', 400);
    }

    const normalizedRole = role.toUpperCase();
    const allowedRoles = ['USER', 'ADMIN', 'GUEST'];

    if (!allowedRoles.includes(normalizedRole)) {
        return errorResponse('Invalid role.', 400);
    }

    const existingUser = await prisma.user.findUnique({
        where: { id },
    });

    if (!existingUser) {
        return errorResponse('User not found.', 404);
    }

    const user = await prisma.user.update({
        where: { id },
        data: { role: normalizedRole },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            passwordResetRequired: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;
};

export const updateUserActiveService = async (id, isActive) => {
    if (!id) {
        return errorResponse('User id is required.', 400);
    }

    if (typeof isActive !== 'boolean') {
        return errorResponse('isActive must be a boolean.', 400);
    }

    const existingUser = await prisma.user.findUnique({
        where: { id },
    });

    if (!existingUser) {
        return errorResponse('User not found.', 404);
    }

    const user = await prisma.user.update({
        where: { id },
        data: { isActive },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            passwordResetRequired: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;
};

export const resetUserPasswordService = async (id) => {
    if (!id) {
        return errorResponse('User id is required.', 400);
    }

    const existingUser = await prisma.user.findUnique({
        where: { id },
    });

    if (!existingUser) {
        return errorResponse('User not found.', 404);
    }

    const hashedPassword = await saltPassword('12345678');

    const user = await prisma.user.update({
        where: { id },
        data: {
            password: hashedPassword,
            passwordResetRequired: true,
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            passwordResetRequired: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;
};

export const updateUserPasswordService = async (id, data, requestUser) => {
    if (!id) {
        return errorResponse('User id is required.', 400);
    }

    const password = data?.newPassword || data?.password;
    const currentPassword = data?.currentPassword;

    if (!password || typeof password !== 'string') {
        return errorResponse('Password is required.', 400);
    }

    if (password.length < 8) {
        return errorResponse('Password must be at least 8 characters.', 400);
    }

    const isAdmin = requestUser?.role?.toLowerCase() === 'admin';
    const isSameUser = requestUser?.userId === id;

    if (!isAdmin && !isSameUser) {
        return errorResponse('Forbidden', 403);
    }

    const existingUser = await prisma.user.findUnique({
        where: { id },
    });

    if (!existingUser) {
        return errorResponse('User not found.', 404);
    }

    if (!isAdmin && currentPassword) {
        const isMatch = await bcrypt.compare(currentPassword, existingUser.password);

        if (!isMatch) {
            return errorResponse('Current password is incorrect.', 400);
        }
    }

    if (!isAdmin && !currentPassword && !existingUser.passwordResetRequired) {
        return errorResponse('Current password is required.', 400);
    }

    const hashedPassword = await saltPassword(password);

    const user = await prisma.user.update({
        where: { id },
        data: {
            password: hashedPassword,
            passwordResetRequired: false,
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            passwordResetRequired: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;
};
