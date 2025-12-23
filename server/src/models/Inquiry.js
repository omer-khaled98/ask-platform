import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  phone: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'replied', 'released'], default: 'new', index: true },
  replyText: { type: String },
  replyScreenshotUrl: { type: String },
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  repliedAt: { type: Date },
  releasedAt: { type: Date },
  replyAudioUrl: { type: String }, // إضافة حقل الصوت
}, { timestamps: true });

export default mongoose.model('Inquiry', inquirySchema);
