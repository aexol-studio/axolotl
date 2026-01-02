/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Scalars = {
  ['ID']: unknown;
};

export interface AIChatMessage<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  role: string;
  content: string;
}

export type Models<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {
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

export type Directives<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {
  resolver: {
    args: Record<string, never>;
  };
};

export interface Query<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  hello: string;
}
export interface Mutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  echo: string;
}
export interface AIChatChunk<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  content: string;
  done: boolean;
}
export interface Subscription<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  countdown?: number | undefined | null;
  aiChat: AIChatChunk;
}
