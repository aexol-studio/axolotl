import type { IncomingMessage, ServerResponse } from 'node:http';
import type { YogaInitialContext } from 'graphql-yoga';

export interface AppContext extends YogaInitialContext {
  req: IncomingMessage;
  res: ServerResponse;
}
