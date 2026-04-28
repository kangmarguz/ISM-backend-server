import prisma from '../config/prismaclient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import errorResponse from '../utils/error.js';
import { saltPassword } from '../utils/salt.password.js';

export const userLoginService = async (username, email, password) => {
    console.log(username, email, password);

    if (!username || !password) {
        return errorResponse('Email and password are required.', 400);
    }

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        return errorResponse('Invalid email or password.', 401);
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
