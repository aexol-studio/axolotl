export type RichText = unknown;
export type GeneratedCode = unknown;

export enum EditUserError {
  USERNAME_ALREADY_TAKEN = 'USERNAME_ALREADY_TAKEN',
  FAILED_MONGO_UPDATE = 'FAILED_MONGO_UPDATE',
  USER_DOES_NOT_EXIST = 'USER_DOES_NOT_EXIST',
}
export enum VerifyEmailError {
  TOKEN_CANNOT_BE_FOUND = 'TOKEN_CANNOT_BE_FOUND',
}
export enum ChangePasswordWhenLoggedError {
  CANNOT_CHANGE_PASSWORD_FOR_USER_REGISTERED_VIA_SOCIAL = 'CANNOT_CHANGE_PASSWORD_FOR_USER_REGISTERED_VIA_SOCIAL',
  OLD_PASSWORD_IS_INVALID = 'OLD_PASSWORD_IS_INVALID',
  PASSWORD_WEAK = 'PASSWORD_WEAK',
}
export enum ChangePasswordWithTokenError {
  CANNOT_CHANGE_PASSWORD_FOR_USER_REGISTERED_VIA_SOCIAL = 'CANNOT_CHANGE_PASSWORD_FOR_USER_REGISTERED_VIA_SOCIAL',
  TOKEN_IS_INVALID = 'TOKEN_IS_INVALID',
  PASSWORD_IS_TOO_WEAK = 'PASSWORD_IS_TOO_WEAK',
}
export enum SquashAccountsError {
  YOU_HAVE_ONLY_ONE_ACCOUNT = 'YOU_HAVE_ONLY_ONE_ACCOUNT',
  YOUR_ACCOUNTS_DO_NOT_HAVE_CONFIRMED_EMAIL = 'YOUR_ACCOUNTS_DO_NOT_HAVE_CONFIRMED_EMAIL',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
}
export enum IntegrateSocialAccountError {
  YOU_HAVE_ONLY_ONE_ACCOUNT = 'YOU_HAVE_ONLY_ONE_ACCOUNT',
  YOUR_ACCOUNT_DOES_NOT_HANDLE_CHANGE_PASSWORD_MODE = 'YOUR_ACCOUNT_DOES_NOT_HANDLE_CHANGE_PASSWORD_MODE',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  CANNOT_FIND_USER = 'CANNOT_FIND_USER',
  YOUR_ACCOUNT_DOES_NOT_HAVE_CONFIRMED_EMAIL = 'YOUR_ACCOUNT_DOES_NOT_HAVE_CONFIRMED_EMAIL',
}
export enum DeleteAccountError {
  CANNOT_FIND_USER = 'CANNOT_FIND_USER',
  CANNOT_DELETE_ALL_ELEMENTS = 'CANNOT_DELETE_ALL_ELEMENTS',
}
export enum GenerateOAuthTokenError {
  TOKEN_NOT_GENERATED = 'TOKEN_NOT_GENERATED',
  CANNOT_RETRIEVE_USER_INFORMATION_FROM_APPLE = 'CANNOT_RETRIEVE_USER_INFORMATION_FROM_APPLE',
}
export enum SocialKind {
  Google = 'Google',
  Github = 'Github',
  Apple = 'Apple',
  Microsoft = 'Microsoft',
}
export enum RegisterErrors {
  USERNAME_EXISTS = 'USERNAME_EXISTS',
  PASSWORD_WEAK = 'PASSWORD_WEAK',
  INVITE_DOMAIN_INCORRECT = 'INVITE_DOMAIN_INCORRECT',
  LINK_EXPIRED = 'LINK_EXPIRED',
  USERNAME_INVALID = 'USERNAME_INVALID',
}
export enum LoginErrors {
  CONFIRM_EMAIL_BEFOR_LOGIN = 'CONFIRM_EMAIL_BEFOR_LOGIN',
  INVALID_LOGIN_OR_PASSWORD = 'INVALID_LOGIN_OR_PASSWORD',
  CANNOT_FIND_CONNECTED_USER = 'CANNOT_FIND_CONNECTED_USER',
  YOU_PROVIDED_OTHER_METHOD_OF_LOGIN_ON_THIS_EMAIL = 'YOU_PROVIDED_OTHER_METHOD_OF_LOGIN_ON_THIS_EMAIL',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}
export enum ProviderErrors {
  CANNOT_RETRIVE_PROFILE_FROM_GOOGLE_TRY_REFRESH_TOKEN = 'CANNOT_RETRIVE_PROFILE_FROM_GOOGLE_TRY_REFRESH_TOKEN',
  CANNOT_FIND_EMAIL_FOR_THIS_PROFIL = 'CANNOT_FIND_EMAIL_FOR_THIS_PROFIL',
  CANNOT_RETRIVE_USER_INFORMATION_FROM_APPLE = 'CANNOT_RETRIVE_USER_INFORMATION_FROM_APPLE',
  CODE_IS_NOT_EXIST_IN_ARGS = 'CODE_IS_NOT_EXIST_IN_ARGS',
  CANNOT_RETRIVE_SUB_FIELD_FROM_JWT_TOKEN = 'CANNOT_RETRIVE_SUB_FIELD_FROM_JWT_TOKEN',
  CANNOT_RETRIVE_TOKEN_FROM_MICROSOFT = 'CANNOT_RETRIVE_TOKEN_FROM_MICROSOFT',
}
export enum GenerateInviteTokenError {
  YOU_ARE_NOT_THE_OWNER_OF_A_TEAM_OR_TEAM_DOES_NOT_EXIST = 'YOU_ARE_NOT_THE_OWNER_OF_A_TEAM_OR_TEAM_DOES_NOT_EXIST',
}
export enum RemoveUserFromTeamError {
  YOU_ARE_NOT_THE_OWNER_OF_A_TEAM_OR_TEAM_DOES_NOT_EXIST = 'YOU_ARE_NOT_THE_OWNER_OF_A_TEAM_OR_TEAM_DOES_NOT_EXIST',
  YOU_CANNOT_KICK_YOURSELF_FROM_THE_TEAM = 'YOU_CANNOT_KICK_YOURSELF_FROM_THE_TEAM',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}
export enum JoinToTeamError {
  TEAM_INVITATION_DOES_NOT_EXIST_OR_CAPTURED = 'TEAM_INVITATION_DOES_NOT_EXIST_OR_CAPTURED',
  MEMBER_ALREADY_EXISTS_IN_THE_TEAM = 'MEMBER_ALREADY_EXISTS_IN_THE_TEAM',
}
export enum CreateTeamError {
  TEAM_NOT_CREATED = 'TEAM_NOT_CREATED',
}
export enum JoinToTeamWithInvitationTokenError {
  INVITATION_TOKEN_NOT_FOUND = 'INVITATION_TOKEN_NOT_FOUND',
  TEAM_IN_INVITATION_TOKEN_NOT_SPECIFIED = 'TEAM_IN_INVITATION_TOKEN_NOT_SPECIFIED',
  MEMBER_ALREADY_EXISTS_IN_THE_TEAM = 'MEMBER_ALREADY_EXISTS_IN_THE_TEAM',
  INVITATION_TOKEN_EXPIRED = 'INVITATION_TOKEN_EXPIRED',
}
export enum InvitationTeamStatus {
  Waiting = 'Waiting',
  Taken = 'Taken',
}
export enum RegistrationError {
  EXISTS_WITH_SAME_NAME = 'EXISTS_WITH_SAME_NAME',
  INVALID_SLUG = 'INVALID_SLUG',
  INVALID_NAME = 'INVALID_NAME',
}
export enum VisitStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  RESCHEDULED = 'RESCHEDULED',
  COMPLETED = 'COMPLETED',
}
export enum VisitError {
  INVALID_DATE = 'INVALID_DATE',
}
export enum ReservationStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
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
export interface RemoveUserFromTeamInput {
  userId: string;
}
export interface InviteTokenInput {
  expires?: string | undefined;
  domain?: string | undefined;
  name?: string | undefined;
}
export interface CreateSalon {
  name: string;
  slug: string;
}
export interface UpdateSalon {
  name?: string | undefined;
  slug?: string | undefined;
}
export interface DateFilter {
  from: string;
  to?: string | undefined;
}
export interface CreateService {
  approximateDurationInMinutes: string;
  name: string;
  description: string;
  price?: number | undefined;
}
export interface UpdateService {
  approximateDurationInMinutes?: string | undefined;
  name?: string | undefined;
  description?: string | undefined;
  price?: number | undefined;
}
export interface CreateVisitFromClient {
  whenDateTime: string;
  serviceId: string;
}
export interface CreateVisitFromAdmin {
  whenDateTime: string;
  serviceId: string;
  clientId: string;
}
export interface UpdateVisitFromAdmin {
  whenDateTime?: string | undefined;
  serviceId?: string | undefined;
  userId?: string | undefined;
}
export interface CreateClient {
  firstName: string;
  lastName: string;
  email?: string | undefined;
  phone?: string | undefined;
}
export interface UpdateClient {
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
}
export interface MessageInput {
  message: string;
}
export interface DeterminePrice {
  from: string;
  to: string;
}
export interface CreateReservation {
  from: string;
  to: string;
  guests: number;
  message?: string | undefined;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address?: string | undefined;
  houseAddons?: Array<string> | undefined;
}
export interface EditReservation {
  from?: string | undefined;
  to?: string | undefined;
  guests: number;
  message?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  status?: ReservationStatus | undefined;
  address?: string | undefined;
  houseAddons?: Array<string> | undefined;
}
export interface CreateHouse {
  name: string;
  outOfSeasonPrice: number;
  addons?: Array<string> | undefined;
  text?: RichText | undefined;
}
export interface CreatePricingRule {
  maxDays: number;
  price: number;
  season: string;
}
export interface CreateSeason {
  from: string;
  to: string;
  name: string;
}
export interface EditHouse {
  name?: string | undefined;
  outOfSeasonPrice?: number | undefined;
  addons?: Array<string> | undefined;
  text?: RichText | undefined;
}
export interface EditPricingRule {
  maxDays?: number | undefined;
  price?: number | undefined;
  season?: string | undefined;
}
export interface EditSeason {
  from?: string | undefined;
  to?: string | undefined;
  name?: string | undefined;
}
export interface CreatePaymentSessionInput {
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
}
export interface CreateHouseAddon {
  name: string;
  price: number;
  perDay?: boolean | undefined;
}
export interface UpdateHouseAddon {
  name?: string | undefined;
  price?: number | undefined;
  perDay?: boolean | undefined;
}
export interface CreateLandingPage {
  domain?: string | undefined;
  slug: string;
  description: string;
  generatedCode?: GeneratedCode | undefined;
}
export interface UpdateLandingPage {
  domain?: string | undefined;
  slug?: string | undefined;
  description?: string | undefined;
}

export type Models = {
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
  ['DeleteAccountResponse']: {
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
  ['GenerateInviteTokenResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['RemoveUserFromTeamResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['JoinToTeamResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['CreateTeamResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['JoinToTeamWithInvitationTokenResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['InvitationTeamToken']: {
    teamId: {
      args: Record<string, never>;
    };
    recipient: {
      args: Record<string, never>;
    };
    status: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    teamName: {
      args: Record<string, never>;
    };
  };
  ['Team']: {
    _id: {
      args: Record<string, never>;
    };
    name: {
      args: Record<string, never>;
    };
    owner: {
      args: Record<string, never>;
    };
    members: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
  };
  ['TeamMember']: {
    _id: {
      args: Record<string, never>;
    };
    username: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
    user: {
      args: Record<string, never>;
    };
    team: {
      args: Record<string, never>;
    };
  };
  ['TeamMemberQuery']: {
    showTeamInvitations: {
      args: {
        sentFromMyTeam?: boolean | undefined;
        status?: InvitationTeamStatus | undefined;
      };
    };
    showInviteTokens: {
      args: Record<string, never>;
    };
    team: {
      args: Record<string, never>;
    };
  };
  ['TeamMemberMutation']: {
    generateInviteToken: {
      args: {
        tokenOptions: InviteTokenInput;
      };
    };
    removeUserFromTeam: {
      args: {
        data: RemoveUserFromTeamInput;
      };
    };
    deleteInviteToken: {
      args: {
        id: string;
      };
    };
  };
  ['InviteToken']: {
    token: {
      args: Record<string, never>;
    };
    expires: {
      args: Record<string, never>;
    };
    domain: {
      args: Record<string, never>;
    };
    teamId: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    name: {
      args: Record<string, never>;
    };
  };
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
  ['SalonProfile']: {
    name: {
      args: Record<string, never>;
    };
    slug: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    user: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
    updatedAt: {
      args: Record<string, never>;
    };
    services: {
      args: Record<string, never>;
    };
  };
  ['SalonOps']: {
    createService: {
      args: {
        service: CreateService;
      };
    };
    serviceOps: {
      args: {
        _id: string;
      };
    };
    update: {
      args: {
        salon: UpdateSalon;
      };
    };
    delete: {
      args: Record<string, never>;
    };
    createVisit: {
      args: {
        visit: CreateVisitFromAdmin;
      };
    };
    visitOps: {
      args: {
        _id: string;
      };
    };
    sendMessage: {
      args: {
        salonClientId: string;
        message: MessageInput;
      };
    };
  };
  ['EntityUpdateResponse']: {
    errors: {
      args: Record<string, never>;
    };
  };
  ['SalonClient']: {
    salon: {
      args: Record<string, never>;
    };
    visits: {
      args: {
        filterDates: DateFilter;
        salonId?: string | undefined;
      };
    };
    _id: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
    updatedAt: {
      args: Record<string, never>;
    };
    messageThread: {
      args: Record<string, never>;
    };
    client: {
      args: Record<string, never>;
    };
  };
  ['Visit']: {
    _id: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
    updatedAt: {
      args: Record<string, never>;
    };
    service: {
      args: Record<string, never>;
    };
    status: {
      args: Record<string, never>;
    };
    whenDateTime: {
      args: Record<string, never>;
    };
    client: {
      args: Record<string, never>;
    };
  };
  ['SalonQuery']: {
    me: {
      args: Record<string, never>;
    };
    clients: {
      args: Record<string, never>;
    };
    visits: {
      args: {
        filterDates: DateFilter;
      };
    };
    analytics: {
      args: {
        filterDates: DateFilter;
      };
    };
    client: {
      args: {
        _id: string;
      };
    };
  };
  ['Service']: {
    salon: {
      args: Record<string, never>;
    };
    approximateDurationInMinutes: {
      args: Record<string, never>;
    };
    name: {
      args: Record<string, never>;
    };
    description: {
      args: Record<string, never>;
    };
    price: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
    updatedAt: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
  };
  ['ServiceOps']: {
    delete: {
      args: Record<string, never>;
    };
    update: {
      args: {
        service: UpdateService;
      };
    };
  };
  ['VisitOps']: {
    update: {
      args: {
        visit: UpdateVisitFromAdmin;
      };
    };
    delete: {
      args: Record<string, never>;
    };
  };
  ['AnalyticsAmountPerDate']: {
    date: {
      args: Record<string, never>;
    };
    amount: {
      args: Record<string, never>;
    };
  };
  ['SalonAnalytics']: {
    visitsPerDay: {
      args: Record<string, never>;
    };
    cashPerDay: {
      args: Record<string, never>;
    };
  };
  ['ClientQuery']: {
    clients: {
      args: Record<string, never>;
    };
    me: {
      args: Record<string, never>;
    };
    client: {
      args: {
        _id: string;
      };
    };
  };
  ['SalonClientOps']: {
    createVisit: {
      args: {
        visit: CreateVisitFromClient;
      };
    };
    sendMessage: {
      args: {
        message: MessageInput;
      };
    };
  };
  ['ClientOps']: {
    update: {
      args: {
        client: UpdateClient;
      };
    };
    registerToSalon: {
      args: {
        salonSlug: string;
      };
    };
    salonClientOps: {
      args: {
        _id: string;
      };
    };
  };
  ['VisitResponse']: {
    errors: {
      args: Record<string, never>;
    };
  };
  ['Message']: {
    createdAt: {
      args: Record<string, never>;
    };
    updatedAt: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    sender: {
      args: Record<string, never>;
    };
    messageThread: {
      args: Record<string, never>;
    };
    message: {
      args: Record<string, never>;
    };
  };
  ['MessageThread']: {
    salonClient: {
      args: Record<string, never>;
    };
    messages: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
    updatedAt: {
      args: Record<string, never>;
    };
  };
  ['Client']: {
    firstName: {
      args: Record<string, never>;
    };
    lastName: {
      args: Record<string, never>;
    };
    email: {
      args: Record<string, never>;
    };
    phone: {
      args: Record<string, never>;
    };
    user: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
    updatedAt: {
      args: Record<string, never>;
    };
  };
  ['Query']: {
    users: {
      args: Record<string, never>;
    };
    housePublic: {
      args: {
        id: string;
      };
    };
    houses: {
      args: Record<string, never>;
    };
  };
  ['Mutation']: {
    users: {
      args: Record<string, never>;
    };
    housePublic: {
      args: {
        id: string;
      };
    };
    createPaymentSession: {
      args: {
        payload: CreatePaymentSessionInput;
      };
    };
  };
  ['AuthorizedUserQuery']: {
    me: {
      args: Record<string, never>;
    };
    showTeamInvitations: {
      args: {
        status: InvitationTeamStatus;
      };
    };
    teams: {
      args: Record<string, never>;
    };
    teamMember: {
      args: {
        _id: string;
      };
    };
    salon: {
      args: Record<string, never>;
    };
    client: {
      args: Record<string, never>;
    };
    admin: {
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
    deleteAccount: {
      args: Record<string, never>;
    };
    joinToTeam: {
      args: {
        teamId: string;
      };
    };
    joinToTeamWithInvitationToken: {
      args: {
        token: string;
      };
    };
    createTeam: {
      args: {
        teamName: string;
      };
    };
    teamMember: {
      args: {
        _id: string;
      };
    };
    registerAsSalon: {
      args: {
        salon: CreateSalon;
      };
    };
    registerAsClient: {
      args: {
        client: CreateClient;
      };
    };
    client: {
      args: Record<string, never>;
    };
    salon: {
      args: Record<string, never>;
    };
    admin: {
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
    updatedAt: {
      args: Record<string, never>;
    };
  };
  ['PricingRule']: {
    maxDays: {
      args: Record<string, never>;
    };
    price: {
      args: Record<string, never>;
    };
    season: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    house: {
      args: Record<string, never>;
    };
  };
  ['Season']: {
    from: {
      args: Record<string, never>;
    };
    to: {
      args: Record<string, never>;
    };
    name: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
  };
  ['HousePublicQuery']: {
    house: {
      args: Record<string, never>;
    };
    getPrice: {
      args: {
        period: DeterminePrice;
      };
    };
    getAvailability: {
      args: {
        year: number;
      };
    };
  };
  ['Reservation']: {
    price: {
      args: Record<string, never>;
    };
    from: {
      args: Record<string, never>;
    };
    to: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    house: {
      args: Record<string, never>;
    };
    paid: {
      args: Record<string, never>;
    };
    guests: {
      args: Record<string, never>;
    };
    message: {
      args: Record<string, never>;
    };
    firstName: {
      args: Record<string, never>;
    };
    lastName: {
      args: Record<string, never>;
    };
    phone: {
      args: Record<string, never>;
    };
    email: {
      args: Record<string, never>;
    };
    status: {
      args: Record<string, never>;
    };
    address: {
      args: Record<string, never>;
    };
    houseAddons: {
      args: Record<string, never>;
    };
  };
  ['HousePublicMutation']: {
    reserve: {
      args: {
        reservation: CreateReservation;
      };
    };
  };
  ['Availability']: {
    date: {
      args: Record<string, never>;
    };
    booked: {
      args: Record<string, never>;
    };
    start: {
      args: Record<string, never>;
    };
    end: {
      args: Record<string, never>;
    };
    price: {
      args: Record<string, never>;
    };
  };
  ['AdminMutation']: {
    createSeason: {
      args: {
        season: CreateSeason;
      };
    };
    createHouse: {
      args: {
        house: CreateHouse;
      };
    };
    houseOps: {
      args: {
        _id: string;
      };
    };
    seasonOps: {
      args: {
        _id: string;
      };
    };
    reservationOps: {
      args: {
        _id: string;
      };
    };
    createHouseAddon: {
      args: {
        addon: CreateHouseAddon;
      };
    };
    addonOps: {
      args: {
        _id: string;
      };
    };
    createLandingPage: {
      args: {
        landingPage: CreateLandingPage;
      };
    };
    landingPageOps: {
      args: {
        _id: string;
      };
    };
  };
  ['AdminHouseOps']: {
    delete: {
      args: Record<string, never>;
    };
    update: {
      args: {
        house: EditHouse;
      };
    };
    pricingRuleOps: {
      args: {
        _id: string;
      };
    };
    createPricingRule: {
      args: {
        pricingRule: CreatePricingRule;
      };
    };
  };
  ['SeasonOps']: {
    delete: {
      args: Record<string, never>;
    };
    edit: {
      args: {
        season: EditSeason;
      };
    };
  };
  ['PricingRuleOps']: {
    delete: {
      args: Record<string, never>;
    };
    update: {
      args: {
        pricingRule: EditPricingRule;
      };
    };
  };
  ['House']: {
    _id: {
      args: Record<string, never>;
    };
    name: {
      args: Record<string, never>;
    };
    outOfSeasonPrice: {
      args: Record<string, never>;
    };
    owner: {
      args: Record<string, never>;
    };
    addons: {
      args: Record<string, never>;
    };
    text: {
      args: Record<string, never>;
    };
  };
  ['AdminQuery']: {
    houses: {
      args: Record<string, never>;
    };
    houseById: {
      args: {
        _id: string;
      };
    };
    reservations: {
      args: Record<string, never>;
    };
    seasons: {
      args: Record<string, never>;
    };
    pricingRules: {
      args: Record<string, never>;
    };
    me: {
      args: Record<string, never>;
    };
    addons: {
      args: Record<string, never>;
    };
    pages: {
      args: Record<string, never>;
    };
  };
  ['ReservationOps']: {
    delete: {
      args: Record<string, never>;
    };
    update: {
      args: {
        reservation: EditReservation;
      };
    };
  };
  ['HouseAddon']: {
    name: {
      args: Record<string, never>;
    };
    price: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    perDay: {
      args: Record<string, never>;
    };
  };
  ['HouseAddonOps']: {
    update: {
      args: {
        addon: UpdateHouseAddon;
      };
    };
    delete: {
      args: Record<string, never>;
    };
  };
  ['LandingPage']: {
    houses: {
      args: Record<string, never>;
    };
    domain: {
      args: Record<string, never>;
    };
    slug: {
      args: Record<string, never>;
    };
    description: {
      args: Record<string, never>;
    };
    generatedCode: {
      args: Record<string, never>;
    };
  };
  ['LandingPageOps']: {
    delete: {
      args: Record<string, never>;
    };
    update: {
      args: {
        landingPage: UpdateLandingPage;
      };
    };
  };
};

export type Directives = unknown;

export interface Dated {
  createdAt: string;
  updatedAt: string;
}
export interface Owned {
  user: User;
}
export interface StringId {
  _id: string;
}
export interface Nameable {
  name: string;
}
export interface WithId {
  _id: string;
}

export type MessageSender = SalonClient | SalonProfile;

export type Scalars = {
  ['RichText']: unknown;
  ['GeneratedCode']: unknown;
};

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
export interface DeleteAccountResponse {
  result?: boolean | undefined;
  hasError?: DeleteAccountError | undefined;
}
export interface GenerateOAuthTokenResponse {
  result?: string | undefined;
  hasError?: GenerateOAuthTokenError | undefined;
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
export interface GenerateInviteTokenResponse {
  result?: string | undefined;
  hasError?: GenerateInviteTokenError | undefined;
}
export interface RemoveUserFromTeamResponse {
  result?: boolean | undefined;
  hasError?: RemoveUserFromTeamError | undefined;
}
export interface JoinToTeamResponse {
  result?: boolean | undefined;
  hasError?: JoinToTeamError | undefined;
}
export interface CreateTeamResponse {
  result?: string | undefined;
  hasError?: CreateTeamError | undefined;
}
export interface JoinToTeamWithInvitationTokenResponse {
  result?: boolean | undefined;
  hasError?: JoinToTeamWithInvitationTokenError | undefined;
}
export interface InvitationTeamToken {
  teamId: string;
  recipient: string;
  status: InvitationTeamStatus;
  _id: string;
  teamName: string;
}
export interface Team {
  _id: string;
  name: string;
  owner: User;
  members: Array<TeamMember>;
  createdAt: string;
}
export interface TeamMember {
  _id: string;
  username: string;
  createdAt: string;
  user: User;
  team: Team;
}
export interface TeamMemberQuery {
  showTeamInvitations: Array<InvitationTeamToken>;
  showInviteTokens: Array<InviteToken>;
  team: Team;
}
export interface TeamMemberMutation {
  generateInviteToken: GenerateInviteTokenResponse;
  removeUserFromTeam: RemoveUserFromTeamResponse;
  deleteInviteToken: boolean;
}
export interface InviteToken {
  token: string;
  expires: string;
  domain: string;
  teamId?: string | undefined;
  _id: string;
  name?: string | undefined;
}
export interface UsersQuery {
  publicUsers?: PublicUsersQuery | undefined;
  user?: AuthorizedUserQuery | undefined;
}
export interface UsersMutation {
  publicUsers?: PublicUsersMutation | undefined;
  user?: AuthorizedUserMutation | undefined;
}
export interface SalonProfile {
  name: string;
  slug: string;
  _id: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  services?: Array<Service> | undefined;
}
export interface SalonOps {
  createService?: string | undefined;
  serviceOps?: ServiceOps | undefined;
  update?: EntityUpdateResponse | undefined;
  delete?: boolean | undefined;
  createVisit?: string | undefined;
  visitOps?: VisitOps | undefined;
  sendMessage?: boolean | undefined;
}
export interface EntityUpdateResponse {
  errors: Array<RegistrationError>;
}
export interface SalonClient {
  salon: SalonProfile;
  visits: Array<Visit>;
  _id: string;
  createdAt: string;
  updatedAt: string;
  messageThread: MessageThread;
  client: Client;
}
export interface Visit {
  _id: string;
  createdAt: string;
  updatedAt: string;
  service: Service;
  status: VisitStatus;
  whenDateTime: string;
  client: Client;
}
export interface SalonQuery {
  me: SalonProfile;
  clients: Array<SalonClient>;
  visits: Array<Visit>;
  analytics?: SalonAnalytics | undefined;
  client?: SalonClient | undefined;
}
export interface Service {
  salon: SalonProfile;
  approximateDurationInMinutes: string;
  name: string;
  description: string;
  price?: number | undefined;
  createdAt: string;
  updatedAt: string;
  _id: string;
}
export interface ServiceOps {
  delete?: boolean | undefined;
  update?: boolean | undefined;
}
export interface VisitOps {
  update?: VisitResponse | undefined;
  delete?: boolean | undefined;
}
export interface AnalyticsAmountPerDate {
  date: string;
  amount: number;
}
export interface SalonAnalytics {
  visitsPerDay: Array<AnalyticsAmountPerDate>;
  cashPerDay: Array<AnalyticsAmountPerDate>;
}
export interface ClientQuery {
  clients: Array<SalonClient>;
  me: Client;
  client?: SalonClient | undefined;
}
export interface SalonClientOps {
  createVisit?: VisitResponse | undefined;
  sendMessage?: boolean | undefined;
}
export interface ClientOps {
  update?: EntityUpdateResponse | undefined;
  registerToSalon?: boolean | undefined;
  salonClientOps?: SalonClientOps | undefined;
}
export interface VisitResponse {
  errors: Array<VisitError>;
}
export interface Message {
  createdAt: string;
  updatedAt: string;
  _id: string;
  sender: MessageSender;
  messageThread: MessageThread;
  message: string;
}
export interface MessageThread {
  salonClient: SalonClient;
  messages: Array<Message>;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
export interface Client {
  firstName: string;
  lastName: string;
  email?: string | undefined;
  phone?: string | undefined;
  user: User;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
export interface Query {
  users?: UsersQuery | undefined;
  housePublic?: HousePublicQuery | undefined;
  houses: Array<House>;
}
export interface Mutation {
  users?: UsersMutation | undefined;
  housePublic?: HousePublicMutation | undefined;
  createPaymentSession: string;
}
export interface AuthorizedUserQuery {
  me?: User | undefined;
  showTeamInvitations: Array<InvitationTeamToken>;
  teams?: Array<Team> | undefined;
  teamMember?: TeamMemberQuery | undefined;
  salon?: SalonQuery | undefined;
  client?: ClientQuery | undefined;
  admin?: AdminQuery | undefined;
}
export interface AuthorizedUserMutation {
  changePasswordWhenLogged: ChangePasswordWhenLoggedResponse;
  editUser: EditUserResponse;
  integrateSocialAccount: IntegrateSocialAccountResponse;
  deleteAccount: DeleteAccountResponse;
  joinToTeam: JoinToTeamResponse;
  joinToTeamWithInvitationToken: JoinToTeamWithInvitationTokenResponse;
  createTeam: CreateTeamResponse;
  teamMember?: TeamMemberMutation | undefined;
  registerAsSalon?: EntityUpdateResponse | undefined;
  registerAsClient?: EntityUpdateResponse | undefined;
  client?: ClientOps | undefined;
  salon?: SalonOps | undefined;
  admin?: AdminMutation | undefined;
}
export interface User {
  username: string;
  emailConfirmed: boolean;
  createdAt?: string | undefined;
  fullName?: string | undefined;
  avatarUrl?: string | undefined;
  _id: string;
  updatedAt: string;
}
export interface PricingRule {
  maxDays: number;
  price: number;
  season: Season;
  _id: string;
  house: House;
}
export interface Season {
  from: string;
  to: string;
  name: string;
  _id: string;
}
export interface HousePublicQuery {
  house: House;
  getPrice: number;
  getAvailability: Array<Availability>;
}
export interface Reservation {
  price: number;
  from: string;
  to: string;
  _id: string;
  house: House;
  paid?: boolean | undefined;
  guests: number;
  message?: string | undefined;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  status: ReservationStatus;
  address?: string | undefined;
  houseAddons?: Array<HouseAddon> | undefined;
}
export interface HousePublicMutation {
  reserve?: string | undefined;
}
export interface Availability {
  date: string;
  booked?: boolean | undefined;
  start?: boolean | undefined;
  end?: boolean | undefined;
  price: number;
}
export interface AdminMutation {
  createSeason?: string | undefined;
  createHouse?: string | undefined;
  houseOps?: AdminHouseOps | undefined;
  seasonOps?: SeasonOps | undefined;
  reservationOps?: ReservationOps | undefined;
  createHouseAddon?: string | undefined;
  addonOps?: HouseAddonOps | undefined;
  createLandingPage?: string | undefined;
  landingPageOps?: LandingPageOps | undefined;
}
export interface AdminHouseOps {
  delete?: boolean | undefined;
  update?: boolean | undefined;
  pricingRuleOps?: PricingRuleOps | undefined;
  createPricingRule?: string | undefined;
}
export interface SeasonOps {
  delete?: boolean | undefined;
  edit?: boolean | undefined;
}
export interface PricingRuleOps {
  delete?: boolean | undefined;
  update?: boolean | undefined;
}
export interface House {
  _id: string;
  name: string;
  outOfSeasonPrice: number;
  owner: User;
  addons?: Array<HouseAddon> | undefined;
  text?: RichText | undefined;
}
export interface AdminQuery {
  houses: Array<House>;
  houseById?: House | undefined;
  reservations: Array<Reservation>;
  seasons: Array<Season>;
  pricingRules: Array<PricingRule>;
  me: User;
  addons?: Array<HouseAddon> | undefined;
  pages?: Array<LandingPage> | undefined;
}
export interface ReservationOps {
  delete?: boolean | undefined;
  update?: boolean | undefined;
}
export interface HouseAddon {
  name: string;
  price: number;
  _id: string;
  perDay?: boolean | undefined;
}
export interface HouseAddonOps {
  update?: boolean | undefined;
  delete?: boolean | undefined;
}
export interface LandingPage {
  houses?: Array<House> | undefined;
  domain?: string | undefined;
  slug: string;
  description: string;
  generatedCode?: GeneratedCode | undefined;
}
export interface LandingPageOps {
  delete?: boolean | undefined;
  update?: boolean | undefined;
}
