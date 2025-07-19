import type { PageLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageLoad = async () => {
  // Fetch all blogs and only columns that exist
  const { data, error } = await supabase
    .from('blogs')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  return {
    blogs: data ?? []
  };
}; 