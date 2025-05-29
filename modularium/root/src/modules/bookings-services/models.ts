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

export type Models = {
  ['User']: {
    username: {
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
  ['UsersQuery']: {
    user: {
      args: Record<string, never>;
    };
  };
  ['UsersMutation']: {
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
  ['AuthorizedUserMutation']: {
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
  ['AuthorizedUserQuery']: {
    salon: {
      args: Record<string, never>;
    };
    client: {
      args: Record<string, never>;
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

export type MessageSender = SalonClient | SalonProfile;

export type Scalars = unknown;

export interface User {
  username: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
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
export interface UsersQuery {
  user?: AuthorizedUserQuery | undefined;
}
export interface UsersMutation {
  user?: AuthorizedUserMutation | undefined;
}
export interface Query {
  users?: UsersQuery | undefined;
}
export interface Mutation {
  users?: UsersMutation | undefined;
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
export interface AuthorizedUserMutation {
  registerAsSalon?: EntityUpdateResponse | undefined;
  registerAsClient?: EntityUpdateResponse | undefined;
  client?: ClientOps | undefined;
  salon?: SalonOps | undefined;
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
export interface AuthorizedUserQuery {
  salon?: SalonQuery | undefined;
  client?: ClientQuery | undefined;
}
