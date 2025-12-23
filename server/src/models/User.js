import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, trim: true, lowercase: true },
  name: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff'], default: 'staff', index: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
