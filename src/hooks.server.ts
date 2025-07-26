// Temporarily disabled for offline development
// import { createServerClient } from '@supabase/ssr';
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Temporarily disabled Supabase for offline development
  // event.locals.supabase = createServerClient(
  //   SUPABASE_URL,
  //   SUPABASE_ANON_KEY,
  //   {
  //     cookies: {
  //       get: (key) => event.cookies.get(key),
  //       set: (key, value, options) => event.cookies.set(key, value, options),
  //       remove: (key, options) => event.cookies.delete(key, options)
  //     }
  //   }
  // );

  // const { data: { session } } = await event.locals.supabase.auth.getSession();
  // event.locals.session = session;

  return resolve(event);
};
