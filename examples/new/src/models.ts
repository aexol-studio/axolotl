export interface AIChatMessage {
  role: string;
  content: string;
}

export type Models = {
  ['User']: {
    id: {
      args: Record<string, never>;
    };
    name: {
      args: Record<string, never>;
    };
  };
  ['Query']: {
    hello: {
      args: Record<string, never>;
    };
  };
  ['Mutation']: {
    echo: {
      args: {
        message: string;
      };
    };
  };
  ['AIChatChunk']: {
    content: {
      args: Record<string, never>;
    };
    done: {
      args: Record<string, never>;
    };
  };
  ['Subscription']: {
    countdown: {
      args: {
        from?: number | undefined | null;
      };
    };
    aiChat: {
      args: {
        messages: Array<AIChatMessage>;
        system?: string | undefined | null;
      };
    };
  };
};

export type Directives = {
  resolver: {
    args: Record<string, never>;
  };
};

export type Scalars = unknown;

export interface User {
  id: unknown;
  name: string;
}
export interface Query {
  hello: string;
}
export interface Mutation {
  echo: string;
}
export interface AIChatChunk {
  content: string;
  done: boolean;
}
export interface Subscription {
  countdown?: number | undefined | null;
  aiChat: AIChatChunk;
}
