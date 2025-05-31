import z from 'zod'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'
const envPath = path.resolve(__dirname, '../../../apps/auth/.env')

if (!fs.existsSync(envPath)) {
    console.log('Không tìm thấy file .env tại:', envPath)
    process.exit(1)
}

config({ path: envPath })
const configSchema = z.object({
    DATABASE_URL_MAIN: z.string(),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_EXPIRES_IN: z.string(),
    PAYMENT_API_KEY: z.string(),
    RESEND_API_KEY: z.string(),
    OTP_EXPIRES_IN: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_REDIRECT_URI: z.string(),
    GOOGLE_CLIENT_REDIRECT_URI: z.string(),
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
    console.log('Các giá trị khai báo trong file .env không hợp lệ')
    console.error(configServer.error)
    process.exit(1)
}

const envConfig = configServer.data

export default envConfig