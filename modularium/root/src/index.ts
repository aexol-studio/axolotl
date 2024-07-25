import { adapter } from '@/src/axolotl.js';
import resolvers from '@/src/resolvers.js';

// This is yoga specific

adapter({ resolvers }).server.listen(parseInt(process.env.PORT || '4000'), () => {
  console.log('LISTENING to ' + process.env.PORT || '4000');
});
