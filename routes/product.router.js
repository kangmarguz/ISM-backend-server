import express from 'express';
import { createProduct } from '../controller/product.controller.js';
import authCheck from '../middleware/auth.check.js';

const route = express.Router();

route.post('/create-product', authCheck, createProduct);

export default route;