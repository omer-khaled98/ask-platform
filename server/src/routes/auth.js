import { Router } from 'express';
import { login, listUsers, createUser, toggleUser , updateUser , deleteUser} from '../controllers/authController.js';
import { requireAuth, requireRole } from '../middleware/auth.js'; // ← هنا التعديل

const router = Router();

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/users          (admin)
router.get('/users', requireAuth, requireRole('admin'), listUsers);

// POST /api/auth/users         (admin)
router.post('/users', requireAuth, requireRole('admin'), createUser);

// PATCH /api/auth/users/:id/toggle  (admin)
router.patch('/users/:id/toggle', requireAuth, requireRole('admin'), toggleUser);

// تعديل بيانات المستخدم
router.patch('/users/:id', requireAuth, requireRole('admin'), updateUser);

// حذف مستخدم
router.delete('/users/:id', requireAuth, requireRole('admin'), deleteUser);


export default router;
