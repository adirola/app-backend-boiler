module.exports ={
    // Basic Node.js config
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Server config
    LISTEN_HOST: process.env.LISTEN_HOST || '0.0.0.0',
    LISTEN_PORT: process.env.LISTEN_PORT || 3000,

    // Database config
    DB_NAME: process.env.DB_NAME || 'postgres',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_HOST: process.env.DB_HOST || '127.0.0.1',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',

    // OTP config
    OTP_MAX_COUNT: 5, // Max number of otp requests in within otp timout
    OTP_TIMEOUT: 5, // Validity of OTP
    OTP_BACKOFF: 5, // Time in minutes after which user can request otp after hitting max count

    // SMS Provider
    DEV_OTP: process.env.DEV_OTP || false,

    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-v4DJT2oDgUcVxn',
    JWT_EXPIRY: 120, //expiry in days

    ADMIN_KEY: process.env.ADMIN_KEY || 'covid!!!'
}