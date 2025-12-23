import Inquiry from '../models/Inquiry.js';  // التأكد من استيراد موديل الاستفسار
import User from '../models/User.js';        // التأكد من استيراد موديل المستخدمين
import path from 'path';
import fs from 'fs';

// إنشاء استفسار جديد
export async function createInquiry(req, res) {
  const { phone, message } = req.body || {};
  if (!phone || !message) return res.status(400).json({ message: 'phone & message required' });

  // التحقق من صحة رقم الهاتف
  if (!/^\d{10,14}$/.test(phone)) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  // رفع الملف الصوتي إذا كان موجوداً
  let audioUrl = null;
  if (req.file && req.file.mimetype.startsWith('audio/')) {
    audioUrl = `/uploads/${req.file.filename}`;
  }

  // إنشاء الاستفسار في قاعدة البيانات
  const doc = await Inquiry.create({
    phone: String(phone).trim(),
    message: String(message).trim(),
    status: 'new',
    audioUrl: audioUrl,  // إضافة الرابط الخاص بالملف الصوتي
  });

  res.status(201).json(doc);
}

// رد على الاستفسار + رفع إثبات الرد
export async function replyInquiry(req, res) {
  const doc = await Inquiry.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not found' });

  if (doc.status === 'released') {
    return res.status(409).json({ message: 'Already released' });
  }

  const { replyText } = req.body;
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // ⛔ اجباري
  if (!replyText || !fileUrl) {
    return res.status(400).json({ message: 'Reply text and screenshot are required' });
  }

  doc.replyText = replyText;
  doc.replyScreenshotUrl = fileUrl;
  doc.status = 'released'; // 👈 خلاص كده
  doc.repliedAt = new Date();
  doc.releasedAt = new Date();
  doc.handledBy = req.user.uid;

  await doc.save();
  res.json(doc);
}


// إرجاع جميع الاستفسارات مع الفلاتر
export async function listInquiries(req, res) {
  const { status, q, from, to, page = 1 } = req.query;
  const limit = 10;  // عدد الاستفسارات في كل صفحة
  const skip = (page - 1) * limit;

  try {
    const filter = {};

    // إذا كان هناك حالة محددة
    if (status) filter.status = status;

    // إذا كان هناك بحث بالنص (الهاتف، الاستفسار، إلخ)
    if (q) {
      filter.$or = [
        { phone: { $regex: q, $options: 'i' } },
        { message: { $regex: q, $options: 'i' } },
      ];
    }

    // إذا كان هناك تاريخ بداية ونهاية
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    // استرجاع الاستفسارات بناءً على الفلاتر
    const inquiries = await Inquiry.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Inquiry.countDocuments(filter);

    res.status(200).json({
      items: inquiries,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// دالة لتغيير حالة الاستفسار إلى "مُفرج عنها"
export async function releaseInquiry(req, res) {
  const { id } = req.params;

  try {
    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // إذا كانت الحالة بالفعل "مُفرج عنها"، فلا يمكن تعديلها مرة أخرى
    if (inquiry.status === 'released') {
      return res.status(409).json({ message: 'Inquiry already released' });
    }

    // تحديث حالة الاستفسار إلى "مُفرج عنها"
    inquiry.status = 'released';
    inquiry.releasedAt = new Date();
    
    await inquiry.save();

    res.status(200).json(inquiry);  // إرجاع الاستفسار بعد التحديث
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// دالة لإرجاع ملخص تقارير الاستفسارات (مثل العدد حسب الحالة)
export async function reportsSummary(req, res) {
  try {
    const countsByStatus = await Inquiry.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },  // ترتيب حسب الحالة
    ]);

    const perDay = await Inquiry.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
    ]);

    res.status(200).json({ countsByStatus, perDay });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// دالة لإرجاع أكثر الموظفين تفاعلاً مع الاستفسارات (الردود)
export async function topHandlers(req, res) {
  try {
    const handlers = await Inquiry.aggregate([
      {
        $match: {
          handledBy: { $ne: null }  // أي استفسار تم الرد عليه
        }
      },
      {
        $group: {
          _id: "$handledBy",
          replies: { $sum: 1 }
        }
      },
      {
        $sort: { replies: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const handlerDetails = await User.find({
      _id: { $in: handlers.map(h => h._id) }
    }).select("name email").lean();

    const result = handlers.map(handler => {
      const user = handlerDetails.find(
        u => u._id.toString() === handler._id.toString()
      );
      return {
        _id: handler._id,
        replies: handler.replies,
        name: user?.name || "غير معروف",
        email: user?.email || "—"
      };
    });

    res.status(200).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// استرجاع المرفق بناءً على اسم الملف
export function getAttachment(req, res) {
  const { fileName } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', fileName);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
}
