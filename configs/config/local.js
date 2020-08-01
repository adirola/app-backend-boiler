let localConfig = {
    hostname: 'localhost',
    port: 3001,
    OTP_MAX_COUNT: 5, // Max number of otp requests in within otp timout
    OTP_TIMEOUT: 5, // Validity of OTP
    OTP_BACKOFF: 5, // Time in minutes after which user can request otp after hitting max count

    // SMS Provider
    DEV_OTP: false,
    ACCOUNT_SID :'AC97919235c05365201d10f5a4e601d6d5' ,
    ACCOUNT_AUTH_TOKEN :'642380ff8c7269d3b6f073919aae1de6',
    // JWT Configuration
    JWT_SECRET: 'dev-secret-v4DJT2oDgUcVxn',
    JWT_EXPIRY: 120, //expiry in days

    ADMIN_KEY: 'covid!!!'
  };
  
  module.exports = localConfig;