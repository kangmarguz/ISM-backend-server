import prisma from '../config/prismaclient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
    userCreateByAdminService,
    userLoginService,
    userRegisterService,
} from '../service/user.service.js';
import e from 'express';

export const userResgister = async (req, res, next) => {
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
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const {username, email, password } = req.body;
        const result = await userLoginService(username, email, password);

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: 'Login successful',
            user: result.user,
            token: result.token // mocking without CORS
        });
    } catch (error) {
        console.error('Error logging in:', error);
        next(error);
    }
};

export const userCreateByAdmin = async (req, res, next) => {
try {
    const { name, username, email, role } = req.body;
    const result = await userCreateByAdminService(name, username, email, role);
    res.status(201).json({
        message: 'User created successfully',
        userId: result.id,
    });
} catch (error) {
    console.log(error);
    next(error);
}
};

export const userLogout = async (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        });

        res.status(200).json({ code: 200, message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out:', error);
        next(error);
    }
};
