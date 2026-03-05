import { PropsWithChildren, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { createQueryClient } from '../lib/query/createQueryClient';

export function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => createQueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
