import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export async function ensureAdminSeed() {
  const email = process.env.ADMIN_EMAIL || 'admin@ask.local';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';

  let u = await User.findOne({ email });
  if (!u) {
    const hash = await bcrypt.hash(password, 10);
    u = await User.create({
      email,
      password: hash,
      role: 'admin',
      name: 'Administrator',
      active: true,
    });
    console.log('Seeded admin:', email);
  }
}
