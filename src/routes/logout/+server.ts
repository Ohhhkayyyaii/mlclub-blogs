import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
  // Sign out from Supabase
  await locals.supabase.auth.signOut();
  
  // Clear any session cookies
  cookies.delete('sb-access-token', { path: '/' });
  cookies.delete('sb-refresh-token', { path: '/' });
  
  throw redirect(303, '/');
}; 