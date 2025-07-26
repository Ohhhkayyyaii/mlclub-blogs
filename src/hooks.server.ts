import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Only create Supabase client if environment variables are available
  if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
    event.locals.supabase = createServerClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (key) => event.cookies.get(key),
          set: (key, value, options) => event.cookies.set(key, value, { ...options, path: '/' }),
          remove: (key, options) => event.cookies.delete(key, { ...options, path: '/' })
        }
      }
    );

    const { data: { session } } = await event.locals.supabase.auth.getSession();
    event.locals.session = session;
  } else {
    // Set null values if Supabase is not available
    event.locals.supabase = null;
    event.locals.session = null;
  }

  return resolve(event);
};
