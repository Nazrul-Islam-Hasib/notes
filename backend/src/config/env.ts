import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}
if (!process.env.DB_USER) {
    throw new Error('DB_USER is not defined');
}
if (!process.env.DB_PASS) {
    throw new Error('DB_PASSWORD is not defined');
}
export const JWT_SECRET = process.env.JWT_SECRET;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const PORT = process.env.PORT;
