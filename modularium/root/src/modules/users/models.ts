export enum EditUserError {
  USERNAME_ALREADY_TAKEN = "USERNAME_ALREADY_TAKEN",
  FAILED_MONGO_UPDATE = "FAILED_MONGO_UPDATE",
  USER_DOES_NOT_EXIST = "USER_DOES_NOT_EXIST"
}
export enum VerifyEmailError {
  TOKEN_CANNOT_BE_FOUND = "TOKEN_CANNOT_BE_FOUND"
}
export enum ChangePasswordWhenLoggedError {
  CANNOT_CHANGE_PASSWORD_FOR_USER_REGISTERED_VIA_SOCIAL = "CANNOT_CHANGE_PASSWORD_FOR_USER_REGISTERED_VIA_SOCIAL",
  OLD_PASSWORD_IS_INVALID = "OLD_PASSWORD_IS_INVALID",
  PASSWORD_WEAK = "PASSWORD_WEAK"
}
export enum ChangePasswordWithTokenError {
  CANNOT_CHANGE_PASSWORD_FOR_USER_REGISTERED_VIA_SOCIAL = "CANNOT_CHANGE_PASSWORD_FOR_USER_REGISTERED_VIA_SOCIAL",
  TOKEN_IS_INVALID = "TOKEN_IS_INVALID",
  PASSWORD_IS_TOO_WEAK = "PASSWORD_IS_TOO_WEAK"
}
export enum SquashAccountsError {
  YOU_HAVE_ONLY_ONE_ACCOUNT = "YOU_HAVE_ONLY_ONE_ACCOUNT",
  YOUR_ACCOUNTS_DO_NOT_HAVE_CONFIRMED_EMAIL = "YOUR_ACCOUNTS_DO_NOT_HAVE_CONFIRMED_EMAIL",
  INCORRECT_PASSWORD = "INCORRECT_PASSWORD"
}
export enum IntegrateSocialAccountError {
  YOU_HAVE_ONLY_ONE_ACCOUNT = "YOU_HAVE_ONLY_ONE_ACCOUNT",
  YOUR_ACCOUNT_DOES_NOT_HANDLE_CHANGE_PASSWORD_MODE = "YOUR_ACCOUNT_DOES_NOT_HANDLE_CHANGE_PASSWORD_MODE",
  INCORRECT_PASSWORD = "INCORRECT_PASSWORD",
  CANNOT_FIND_USER = "CANNOT_FIND_USER",
  YOUR_ACCOUNT_DOES_NOT_HAVE_CONFIRMED_EMAIL = "YOUR_ACCOUNT_DOES_NOT_HAVE_CONFIRMED_EMAIL"
}
export enum GenerateOAuthTokenError {
  TOKEN_NOT_GENERATED = "TOKEN_NOT_GENERATED",
  CANNOT_RETRIEVE_USER_INFORMATION_FROM_APPLE = "CANNOT_RETRIEVE_USER_INFORMATION_FROM_APPLE"
}
export enum SocialKind {
  Google = "Google",
  Github = "Github",
  Apple = "Apple",
  Microsoft = "Microsoft"
}
export enum RegisterErrors {
  USERNAME_EXISTS = "USERNAME_EXISTS",
  PASSWORD_WEAK = "PASSWORD_WEAK",
  INVITE_DOMAIN_INCORRECT = "INVITE_DOMAIN_INCORRECT",
  LINK_EXPIRED = "LINK_EXPIRED",
  USERNAME_INVALID = "USERNAME_INVALID"
}
export enum LoginErrors {
  CONFIRM_EMAIL_BEFOR_LOGIN = "CONFIRM_EMAIL_BEFOR_LOGIN",
  INVALID_LOGIN_OR_PASSWORD = "INVALID_LOGIN_OR_PASSWORD",
  CANNOT_FIND_CONNECTED_USER = "CANNOT_FIND_CONNECTED_USER",
  YOU_PROVIDED_OTHER_METHOD_OF_LOGIN_ON_THIS_EMAIL = "YOU_PROVIDED_OTHER_METHOD_OF_LOGIN_ON_THIS_EMAIL",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR"
}
export enum ProviderErrors {
  CANNOT_RETRIVE_PROFILE_FROM_GOOGLE_TRY_REFRESH_TOKEN = "CANNOT_RETRIVE_PROFILE_FROM_GOOGLE_TRY_REFRESH_TOKEN",
  CANNOT_FIND_EMAIL_FOR_THIS_PROFIL = "CANNOT_FIND_EMAIL_FOR_THIS_PROFIL",
  CANNOT_RETRIVE_USER_INFORMATION_FROM_APPLE = "CANNOT_RETRIVE_USER_INFORMATION_FROM_APPLE",
  CODE_IS_NOT_EXIST_IN_ARGS = "CODE_IS_NOT_EXIST_IN_ARGS",
  CANNOT_RETRIVE_SUB_FIELD_FROM_JWT_TOKEN = "CANNOT_RETRIVE_SUB_FIELD_FROM_JWT_TOKEN",
  CANNOT_RETRIVE_TOKEN_FROM_MICROSOFT = "CANNOT_RETRIVE_TOKEN_FROM_MICROSOFT"
}

export interface GetOAuthInput {
  scopes?: Array<string> | undefined;
  state?: string | undefined;
  redirectUri?: string | undefined;
}
export interface UpdateUserInput {
  username?: string | undefined;
  fullName?: string | undefined;
  avatarUrl?: string | undefined;
}
export interface GenerateOAuthTokenInput {
  social: SocialKind;
  code: string;
}
export interface SimpleUserInput {
  username: string;
  password: string;
}
export interface LoginInput {
  username: string;
  password: string;
}
export interface VerifyEmailInput {
  token: string;
}
export interface ChangePasswordWithTokenInput {
  username: string;
  forgotToken: string;
  newPassword: string;
}
export interface ChangePasswordWhenLoggedInput {
  oldPassword: string;
  newPassword: string;
}
export interface RegisterInput {
  username: string;
  password: string;
  fullName?: string | undefined;
  invitationToken?: string | undefined;
}
export interface ProviderLoginInput {
  code: string;
  redirectUri: string;
}

export type Models = {
  ['UsersQuery']: {
    publicUsers: {
      args: Record<string, never>;
    };
    user: {
      args: Record<string, never>;
    };
  };
  ['UsersMutation']: {
    publicUsers: {
      args: Record<string, never>;
    };
    user: {
      args: Record<string, never>;
    };
  };
  ['Query']: {
    users: {
      args: Record<string, never>;
    };
  };
  ['Mutation']: {
    users: {
      args: Record<string, never>;
    };
  };
  ['AuthorizedUserQuery']: {
    me: {
      args: Record<string, never>;
    };
  };
  ['AuthorizedUserMutation']: {
    changePasswordWhenLogged: {
      args: {
        changePasswordData: ChangePasswordWhenLoggedInput;
      };
    };
    editUser: {
      args: {
        updatedUser: UpdateUserInput;
      };
    };
    integrateSocialAccount: {
      args: {
        userData: SimpleUserInput;
      };
    };
  };
  ['PublicUsersQuery']: {
    login: {
      args: Record<string, never>;
    };
    getGoogleOAuthLink: {
      args: {
        setup: GetOAuthInput;
      };
    };
    getMicrosoftOAuthLink: {
      args: {
        setup: GetOAuthInput;
      };
    };
    getGithubOAuthLink: {
      args: {
        setup: GetOAuthInput;
      };
    };
    getAppleOAuthLink: {
      args: {
        setup: GetOAuthInput;
      };
    };
    requestForForgotPassword: {
      args: {
        username: string;
      };
    };
  };
  ['PublicUsersMutation']: {
    register: {
      args: {
        user: RegisterInput;
      };
    };
    verifyEmail: {
      args: {
        verifyData: VerifyEmailInput;
      };
    };
    changePasswordWithToken: {
      args: {
        token: ChangePasswordWithTokenInput;
      };
    };
    generateOAuthToken: {
      args: {
        tokenData: GenerateOAuthTokenInput;
      };
    };
  };
  ['EditUserResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['VerifyEmailResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['ChangePasswordWhenLoggedResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['ChangePasswordWithTokenResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['IntegrateSocialAccountResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['GenerateOAuthTokenResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['User']: {
    username: {
      args: Record<string, never>;
    };
    emailConfirmed: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
    fullName: {
      args: Record<string, never>;
    };
    avatarUrl: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
  };
  ['LoginQuery']: {
    password: {
      args: {
        user: LoginInput;
      };
    };
    provider: {
      args: {
        params: ProviderLoginInput;
      };
    };
    refreshToken: {
      args: {
        refreshToken: string;
      };
    };
  };
  ['ProviderLoginQuery']: {
    apple: {
      args: Record<string, never>;
    };
    google: {
      args: Record<string, never>;
    };
    github: {
      args: Record<string, never>;
    };
    microsoft: {
      args: Record<string, never>;
    };
  };
  ['RegisterResponse']: {
    registered: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['LoginResponse']: {
    login: {
      args: Record<string, never>;
    };
    accessToken: {
      args: Record<string, never>;
    };
    refreshToken: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['ProviderResponse']: {
    jwt: {
      args: Record<string, never>;
    };
    accessToken: {
      args: Record<string, never>;
    };
    refreshToken: {
      args: Record<string, never>;
    };
    providerAccessToken: {
      args: Record<string, never>;
    };
    register: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
};

export interface UsersQuery {
  publicUsers?: PublicUsersQuery | undefined;
  user?: AuthorizedUserQuery | undefined;
}
export interface UsersMutation {
  publicUsers?: PublicUsersMutation | undefined;
  user?: AuthorizedUserMutation | undefined;
}
export interface Query {
  users?: UsersQuery | undefined;
}
export interface Mutation {
  users?: UsersMutation | undefined;
}
export interface AuthorizedUserQuery {
  me?: User | undefined;
}
export interface AuthorizedUserMutation {
  changePasswordWhenLogged: ChangePasswordWhenLoggedResponse;
  editUser: EditUserResponse;
  integrateSocialAccount: IntegrateSocialAccountResponse;
}
export interface PublicUsersQuery {
  login: LoginQuery;
  getGoogleOAuthLink: string;
  getMicrosoftOAuthLink: string;
  getGithubOAuthLink: string;
  getAppleOAuthLink: string;
  requestForForgotPassword: boolean;
}
export interface PublicUsersMutation {
  register: RegisterResponse;
  verifyEmail: VerifyEmailResponse;
  changePasswordWithToken: ChangePasswordWithTokenResponse;
  generateOAuthToken: GenerateOAuthTokenResponse;
}
export interface EditUserResponse {
  result?: boolean | undefined;
  hasError?: EditUserError | undefined;
}
export interface VerifyEmailResponse {
  result?: boolean | undefined;
  hasError?: VerifyEmailError | undefined;
}
export interface ChangePasswordWhenLoggedResponse {
  result?: boolean | undefined;
  hasError?: ChangePasswordWhenLoggedError | undefined;
}
export interface ChangePasswordWithTokenResponse {
  result?: boolean | undefined;
  hasError?: ChangePasswordWithTokenError | undefined;
}
export interface IntegrateSocialAccountResponse {
  result?: boolean | undefined;
  hasError?: IntegrateSocialAccountError | undefined;
}
export interface GenerateOAuthTokenResponse {
  result?: string | undefined;
  hasError?: GenerateOAuthTokenError | undefined;
}
export interface User {
  username: string;
  emailConfirmed: boolean;
  createdAt?: string | undefined;
  fullName?: string | undefined;
  avatarUrl?: string | undefined;
  _id: string;
}
export interface LoginQuery {
  password: LoginResponse;
  provider: ProviderLoginQuery;
  refreshToken: string;
}
export interface ProviderLoginQuery {
  apple?: ProviderResponse | undefined;
  google?: ProviderResponse | undefined;
  github?: ProviderResponse | undefined;
  microsoft?: ProviderResponse | undefined;
}
export interface RegisterResponse {
  registered?: boolean | undefined;
  hasError?: RegisterErrors | undefined;
}
export interface LoginResponse {
  login?: string | undefined;
  accessToken?: string | undefined;
  refreshToken?: string | undefined;
  hasError?: LoginErrors | undefined;
}
export interface ProviderResponse {
  jwt?: string | undefined;
  accessToken?: string | undefined;
  refreshToken?: string | undefined;
  providerAccessToken?: string | undefined;
  register?: boolean | undefined;
  hasError?: ProviderErrors | undefined;
}
