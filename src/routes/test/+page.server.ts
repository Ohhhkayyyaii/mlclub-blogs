import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  return {
    blogs: data
  };
}; 