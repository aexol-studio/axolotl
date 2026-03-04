import { runE2ePrismaCleanup } from './helpers/e2e-cleanup';

const globalTeardown = async () => {
  await runE2ePrismaCleanup('GLOBAL TEARDOWN');
};

export default globalTeardown;
