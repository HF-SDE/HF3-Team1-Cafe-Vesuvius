export type AccessResult = {
  accessToken: {
    token: string;
    authType: 'bearer';
  };
};

export type RefreshResult = {
  refreshToken: {
    token: string;
  };
};

/** Interface for the login request body */
export interface LoginRequestBody {
  username: string;
  password: string;
  ip: string;
}

export interface TokenRequestBody {
  token: string;
  ip: string;
}
