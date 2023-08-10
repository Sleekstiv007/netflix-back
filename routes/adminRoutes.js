import { Router } from 'express';
const router = Router();

import {
  allUsers,
  editUser,
  deleteUser,
} from '../controllers/adminController.js';

// const { requireA } = require('../middleware/AdminMiddleware');
// import requireAuth from '../middleware/authMiddleware.js';

// router.use(requireAuth);

router.get('/users', allUsers);


router.put('/users/:id', editUser);

// router.delete('/users/:id', del);

router.post('/deleteuser', deleteUser);

export default router;
