import { Environment } from '../enums';

export const getDimoLoginUrl = (environment: Environment): string => {
  const dimoLoginMap: Record<Environment, string> = {
    [Environment.LOCAL]: 'http://localhost:3000',
    [Environment.DEVELOPMENT]: 'https://login.dev.dimo.org',
    [Environment.PRODUCTION]: 'https://login.dimo.org',
  };

  if (!dimoLoginMap[environment]) {
    console.warn(
      `Warning: Unrecognized environment "${environment}". Defaulting to production URL.`
    );
  }
  return dimoLoginMap[environment] || dimoLoginMap[Environment.PRODUCTION];
};
