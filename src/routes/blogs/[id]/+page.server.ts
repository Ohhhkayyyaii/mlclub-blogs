import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  // Simple load function - let client handle data loading
  return {
    blogId: params.id
  };
}; 