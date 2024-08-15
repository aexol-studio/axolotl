import { adapter } from '@/src/axolotl.js';
import resolvers from '@/src/resolvers.js';

// This is yoga specific

adapter({ resolvers }).server.listen(4002, () => {
  console.log('LISTENING to ' + 4002);
});
