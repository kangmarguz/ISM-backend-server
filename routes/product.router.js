import express from 'express';
import { createProduct } from '../controller/product.controller.js';
import authCheck from '../middleware/auth.check.js';
import { authorizeRoles } from '../middleware/auth.useRole.js';

const route = express.Router();
export const isAdmin = authorizeRoles('ADMIN');
export const isUser = authorizeRoles('USER');

route.post('/create-product', authCheck, isUser, createProduct);

export default route;
