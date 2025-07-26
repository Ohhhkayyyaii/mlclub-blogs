import type { LayoutServerLoad } from '@sveltejs/kit';

export const load: LayoutServerLoad = async () => {
  // Simple load function - authentication handled client-side
  return {};
}; 