export default {
  meEndpoint: "/auth/me",
  loginEndpoint: process.env.NEXT_PUBLIC_API_BASE_LOGIN_ENDPOINT,
  registerEndpoint: process.env.NEXT_PUBLIC_API_REGISTER_ENDPOINT,
  storageAccessTokenKey: "accessToken",
  storageRefreshTokenKey: "refreshToken",
  storageUserDataKey: "userData"
};
