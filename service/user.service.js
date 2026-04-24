import prisma from '../config/prismaclient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userLoginService = async (email, password) => {
    if (!email || !password) {
        throw new Error('Email and password are required.');
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password.');
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
        return res
            .status(400)
            .json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { username }],
        },
    });

    if (existingUser) {
        if (existingUser.email === email) {
            return res.status(409).json({ error: 'Email already registered.' });
        }
        if (existingUser.username === username) {
            return res.status(409).json({ error: 'Username already taken.' });
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
