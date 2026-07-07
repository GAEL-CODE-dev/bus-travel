export const envConfig = () => ({
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_dev_secret',
    expiresIn: process.env.JWT_EXPIRE || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_dev',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  company: {
    name: process.env.COMPANY_NAME || 'BUS TRAVEL',
    email: process.env.COMPANY_EMAIL || 'contact@bustravel.cg',
    phone: process.env.COMPANY_PHONE || '+242 06 593 6820',
    address: process.env.COMPANY_ADDRESS || 'Brazzaville, Congo',
  },
});
