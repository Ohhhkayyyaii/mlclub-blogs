import type { PageLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageLoad = async ({ params }) => {
  const { id } = params;
  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, content, status, created_at, author_id')
    .eq('id', id)
    .single();

  if (error || !data) {
    return { notFound: true };
  }

  type Blog = {
    id: string;
    title: string;
    content: string;
    status: string;
    created_at: string;
    author_id: string;
  };

  return {
    blog: data as Blog,
    notFound: false
  };
}; 