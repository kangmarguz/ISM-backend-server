import express from 'express';
const route = express.Router();
import authCheck from '../middleware/auth.checkToken.js';
import { authorizeRoles } from '../middleware/auth.useRole.js';

import {
    userLogin,
    userLogout,
    userResgister,
    userCreateByAdmin,
    getAllUserByAdmin,
    updateUserRole,
    updateUserActive,
} from '../controller/user.controller.js';

route.post('/register', userResgister);
route.post('/create-user', authCheck, authorizeRoles('admin'), userCreateByAdmin);
route.get('/users', authCheck, authorizeRoles('admin'), getAllUserByAdmin);
route.patch('/users/:id/role', authCheck, authorizeRoles('admin'), updateUserRole);
route.patch('/users/:id/active', authCheck, authorizeRoles('admin'), updateUserActive);
route.post('/login', userLogin);
route.post('/logout', userLogout);

export default route;
