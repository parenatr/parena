/** BFF `GET /api/auth/me` yanıtı (Keycloak claim'lerinden türetilir). */
export type SessionUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
};

export type LoginRequest = {
  email: string;
  password: string;
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
