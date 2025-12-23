import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// تسجيل دخول
export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

  const u = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!u || !u.active) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, u.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { uid: u._id, role: u.role, email: u.email, name: u.name || '' },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '7d' }
  );

  res.json({ token, role: u.role, name: u.name || '', email: u.email });
}

// إنشاء مستخدم جديد
export async function createUser(req, res) {
  const { email, name, password, role } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email & password required' });

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) return res.status(409).json({ message: 'Email already exists' });

  const hash = await bcrypt.hash(password, 10);

  const doc = await User.create({
    email: String(email).toLowerCase().trim(),
    name: name || '',
    password: hash,
    role: role === 'admin' ? 'admin' : 'staff',
    active: true,
  });

  res.status(201).json({
    _id: doc._id,
    email: doc.email,
    name: doc.name,
    role: doc.role,
    active: doc.active,
  });
}

// قائمة المستخدمين
export async function listUsers(req, res) {
  const users = await User.find({}, { password: 0 })
    .sort({ createdAt: -1 })
    .lean();

  res.json(users);
}

// تفعيل / تعطيل مستخدم
export async function toggleUser(req, res) {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.active = !user.active;
  await user.save();

  res.status(200).json({ message: `User ${user.active ? 'activated' : 'deactivated'}` });
}

// تعديل مستخدم
export async function updateUser(req, res) {
  const { id } = req.params;
  const { email, name, role } = req.body;

  if (!email || !name)
    return res.status(400).json({ message: 'Email & name required' });

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists && exists._id.toString() !== id)
    return res.status(409).json({ message: 'Email already exists' });

  user.email = String(email).toLowerCase().trim();
  user.name = name;
  user.role = role === 'admin' ? 'admin' : 'staff';

  await user.save();

  res.status(200).json({
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    active: user.active,
  });
}

// حذف مستخدم
export async function deleteUser(req, res) {
  const { id } = req.params;

  const deleted = await User.findByIdAndDelete(id);

  if (!deleted)
    return res.status(404).json({ message: 'User not found' });

  res.status(200).json({ message: 'User deleted successfully' });
}
