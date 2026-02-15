import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
}

if (!process.env.PORT) {
    throw new Error('PORT is not defined');
}
export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGODB_URI = process.env.MONGODB_URI;
export const PORT = process.env.PORT;
