import express from 'express';
const route = express.Router();
import authCheck from '../middleware/auth.checkToken.js';
import { authorizeRoles } from '../middleware/auth.useRole.js';

import {
    userLogin,
    userLogout,
    userResgister,
    userCreateByAdmin,
} from '../controller/user.controller.js';

route.post('/register', userResgister);
route.post('/create-user', authCheck, authorizeRoles('admin'), userCreateByAdmin);
route.post('/login', userLogin);
route.post('/logout', userLogout);

export default route;
