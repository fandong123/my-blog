export const ironOptions =   {
  cookieName: process.env.SESSION_COOKIE_NAME as string,
  password: process.env.SESSION_PASSWORD as string,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
    secure: process.env.NODE_ENV === "production",
  },
}