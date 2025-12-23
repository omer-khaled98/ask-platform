import 'dotenv/config';


export const config = {
port: process.env.PORT || 4000,
mongoUri: process.env.MONGO_URI,
jwtSecret: process.env.JWT_SECRET,
adminEmail: process.env.ADMIN_EMAIL,
adminPassword: process.env.ADMIN_PASSWORD,
corsOrigin: process.env.CORS_ORIGIN || '*',
};