import { Environment } from '../enums';

/**
 * Utility function to get the Dimo login URL based on the environment.
 * @param environment - The current environment (e.g., production, staging).
 * @returns The Dimo login URL.
 */
export function getDimoLoginUrl(environment: Environment): string {
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
}
