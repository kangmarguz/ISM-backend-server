import express from 'express';
import { createProduct, createVanBooking, deleteHistory, getHistory } from '../controller/product.controller.js';
import authCheck from '../middleware/auth.checkToken.js';
import { authorizeRoles } from '../middleware/auth.useRole.js';

const route = express.Router();
export const isAdmin = authorizeRoles('aDmIN');
export const isUser = authorizeRoles('uSeR');

route.post('/create-product', authCheck, isUser, createProduct);
route.post('/booking', authCheck, createVanBooking);
route.get('/history/:id', getHistory);
route.put('/history/:id', getHistory);  
route.delete('/history/:id', deleteHistory);

export default route;
