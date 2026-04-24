import prisma from '../config/prismaclient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
    userLoginService,
    userRegisterService,
} from '../service/user.service.js';

export const userResgister = async (req, res) => {
    try {
        const { name, username, email, password, phone } = req.body;
        
        const result = await userRegisterService(
            name,
            username,
            email,
            password,
            phone,
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.id,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userLoginService(email, password);

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: 'Login successful',
            user: result.user,
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
