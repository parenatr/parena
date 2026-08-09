/** BFF `GET /api/auth/me` yanıtı (Keycloak claim'lerinden türetilir). */
export type SessionUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
};


export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  marketingConsent: boolean;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  /** E-postadaki sıfırlama bağlantısından gelen tek kullanımlık token. */
  token: string;
  password: string;
};
