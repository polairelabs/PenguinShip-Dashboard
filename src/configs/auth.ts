export default {
  userInformationEndpoint:
    process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/user-information",
  loginEndpoint: process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/login",
  logoutEndpoint: process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/logout",
  refreshTokenEndpoint:
    process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/refresh-token",
  storageAccessTokenDataKey: "access_token",
  storageUserDataKey: "user_data",
  refreshTokenCookieKey: "refresh_token"
};
