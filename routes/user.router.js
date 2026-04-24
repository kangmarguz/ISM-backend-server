import express from 'express';
const route = express.Router();
import { userLogin, userResgister } from '../controller/user.controller.js';

route.post('/register', userResgister);
route.post('/login', userLogin);

export default route;
