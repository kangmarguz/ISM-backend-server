import express from 'express';
import authCheck from '../middleware/auth.checkToken.js';
import { authorizeRoles } from '../middleware/auth.useRole.js';
import { getAllAdmins, getAllUsers, updateUserProfile } from '../controller/admin.controller.js';

const route = express.Router();

route.get('/get-all-users', authCheck, authorizeRoles('aDmIN'), getAllUsers);
route.get('/get-all-admins', authCheck, authorizeRoles('aDmIN'), getAllAdmins);
route.put('/update-user', updateUserProfile);

export default route;   