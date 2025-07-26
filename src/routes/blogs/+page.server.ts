import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals }) => {
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Fetch paginated published blogs
  const { data: blogs, error } = await locals.supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .range(from, to)
    .order('published_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Get total count of published blogs
  const { count, error: countError } = await locals.supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  if (countError) {
    throw new Error(countError.message);
  }

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return {
    blogs,
    currentPage: page,
    totalPages,
    limit
  };
}; 