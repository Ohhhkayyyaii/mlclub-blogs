import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  // Simple load function - let client handle auth
  return {};
}; 