import prisma from '../config/prismaclient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import errorResponse from '../utils/error.js';

export const userLoginService = async (email, password) => {
    if (!email || !password) {
        return errorResponse('Email and password are required.', 400);
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return errorResponse('Invalid email or password.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return errorResponse('Invalid email or password.', 401);
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
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

    const saltRounds = parseInt(process.env.SALTED_ENCODE);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

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
