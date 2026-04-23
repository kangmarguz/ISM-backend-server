import express from 'express';
const route = express.Router();
import prisma from '../config/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

route.post('/register', async (req, res) => {
    try {
        const { name, username, email, password, phone } =
            req.body;

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
                return res
                    .status(409)
                    .json({ error: 'Email already registered.' });
            }
            if (existingUser.username === username) {
                return res
                    .status(409)
                    .json({ error: 'Username already taken.' });
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

        res.status(201).json({
            message: 'User registered successfully',
            userId: user.id,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

route.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: 'Email and password are required.' });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res
                .status(401)
                .json({ error: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1hr' },
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
            sameSite: 'lax', // Blocks cross-site CSRF attacks
            maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default route;
