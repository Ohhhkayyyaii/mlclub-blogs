import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const load: PageLoad = async ({ parent }) => {
  // Get session from parent layout (recommended SvelteKit way)
  const { session } = await parent();
  if (!session?.user) {
    throw redirect(303, '/login?message=Please%20log%20in%20to%20view%20your%20blogs');
  }
  const userId = session.user.id;
  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, status, created_at')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  type Blog = {
    id: string;
    title: string;
    status: string;
    created_at: string;
  };
  return {
    blogs: data as Blog[]
  };
}; 