// Temporarily disabled for offline development
// import { createServerClient } from '@supabase/ssr';
// import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  // Temporarily disabled Supabase for offline development
  // const supabase = createServerClient(
  //   env.VITE_SUPABASE_URL,
  //   env.VITE_SUPABASE_ANON_KEY,
  //   {
  //     cookies: {
  //       get(name) { return cookies.get(name); },
  //       set(name, value, options) { cookies.set(name, value, options); },
  //       remove(name, options) { cookies.delete(name, options); }
  //     }
  //   }
  // );

  // const { data, error } = await supabase
  //   .from('blogs')
  //   .select('*');

  // if (error) {
  //   throw new Error(error.message);
  // }

  return {
    blogs: [] // Empty array for now - client will load data
  };
}; 