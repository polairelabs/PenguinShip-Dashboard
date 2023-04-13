export default {
  userInformationEndpoint: process.env.NEXT_PUBLIC_API_USER_INFORMATION_ENDPOINT,
  loginEndpoint: process.env.NEXT_PUBLIC_API_BASE_LOGIN_ENDPOINT,
  logoutEndpoint: process.env.NEXT_PUBLIC_API_BASE_LOGOUT_ENDPOINT,
  refreshTokenEndpoint: process.env.NEXT_PUBLIC_API_BASE_REFRESH_TOKEN_ENDPOINT,
  storageUserDataKey: "user_data",
  refreshTokenCookieKey: "refresh_token"
};
