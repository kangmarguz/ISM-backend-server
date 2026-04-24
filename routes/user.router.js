import express from 'express';
const route = express.Router();
import { userLogin, userLogout, userResgister } from '../controller/user.controller.js';

route.post('/register', userResgister);
route.post('/login', userLogin);
route.post('/logout', userLogout);

export default route;
