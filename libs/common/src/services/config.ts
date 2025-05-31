import z from 'zod';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

const envPath = path.resolve(process.cwd(), '.env');

// Nếu không phải production thì load .env từ file
if (process.env.NODE_ENV !== 'production') {
    if (!fs.existsSync(envPath)) {
        console.log('Không tìm thấy file .env tại:', envPath);
        process.exit(1);
    }

    config({ path: envPath });
}

const configSchema = z.object({
    DATABASE_URL_MAIN: z.string(),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_EXPIRES_IN: z.string(),
    APP_NAME: z.string(),
    ADMIN_NAME: z.string(),
    ADMIN_PASSWORD: z.string(),
    ADMIN_EMAIL: z.string(),
    ADMIN_PHONE_NUMBER: z.string(),
    PAYMENT_API_KEY: z.string(),
    RESEND_API_KEY: z.string(),
    OTP_EXPIRES_IN: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_REDIRECT_URI: z.string(),
    GOOGLE_CLIENT_REDIRECT_URI: z.string(),
    S3_REGION: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
    S3_BUCKET_NAME: z.string(),
    S3_ENPOINT: z.string(),
});

const configServer = configSchema.safeParse(process.env);

if (!configServer.success) {
    console.error('❌ Các giá trị khai báo trong biến môi trường không hợp lệ');
    console.error(configServer.error.format());
    process.exit(1);
}

const envConfig = configServer.data;
export default envConfig;
