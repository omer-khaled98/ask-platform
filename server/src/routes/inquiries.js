import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  createInquiry,
  listInquiries,
  replyInquiry,
  reportsSummary,
  topHandlers,
  getAttachment,
} from '../controllers/inquiryController.js';
import { upload } from '../utils/upload.js';

const router = Router();

// إنشاء استفسار (بدون توكين)
router.post('/', createInquiry);

// عرض الاستفسارات (موظف / أدمن)
router.get(
  '/',
  requireAuth,
  requireRole('staff', 'admin'),
  listInquiries
);

// رد على استفسار + رفع صورة الإثبات
// (الرد + الصورة إجباري + يعمل Release تلقائي)
router.patch(
  '/:id/reply',
  requireAuth,
  requireRole('staff', 'admin'),
  upload.single('screenshot'),
  replyInquiry
);

// تقارير للإدارة
router.get(
  '/reports/summary',
  requireAuth,
  requireRole('admin'),
  reportsSummary
);

router.get(
  '/reports/top-handlers',
  requireAuth,
  requireRole('admin'),
  topHandlers
);

// تحميل المرفقات
router.get(
  '/inquiries/attachments/:fileName',
  getAttachment
);

export default router;
