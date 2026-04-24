import express from 'express';
import authCheck from '../middleware/auth.checkToken.js';
import { authorizeRoles } from '../middleware/auth.useRole.js';
import { getAllUsers, updateUserProfile } from '../controller/admin.controller.js';

const route = express.Router();

route.get('/get-all-users', authCheck, authorizeRoles('aDmIN'), getAllUsers);
route.put('/update-user', updateUserProfile);

export default route;