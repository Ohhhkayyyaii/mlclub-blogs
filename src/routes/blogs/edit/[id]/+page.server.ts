import { supabase } from '$lib/supabase';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
  const { id } = params;
  const access_token = cookies.get('sb-access-token');
  if (!access_token) throw redirect(303, '/login');

  const { data: { user } } = await supabase.auth.getUser(access_token);
  if (!user) throw redirect(303, '/login');

  const { data: blog, error: err } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();
  if (err || !blog) throw error(404, 'Blog not found');

  if (blog.author_id !== user.id && blog.author !== user.email) {
    throw error(403, 'Forbidden: You are not the author of this blog');
  }

  return { blog };
};

export const actions: Actions = {
  delete: async ({ params, cookies }) => {
    const { id } = params;
    const access_token = cookies.get('sb-access-token');
    if (!access_token) throw redirect(303, '/login');

    const { data: { user } } = await supabase.auth.getUser(access_token);
    if (!user) throw redirect(303, '/login');

    const { data: blog, error: err } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
    if (err || !blog) throw error(404, 'Blog not found');

    if (blog.author_id !== user.id && blog.author !== user.email) {
      throw error(403, 'Forbidden: You are not the author of this blog');
    }

    const { error: deleteError } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);
    if (deleteError) throw error(500, 'Failed to delete blog');

    // Set a cookie or flash message for toast (SvelteKit doesn't have built-in flash, so use query param)
    throw redirect(303, '/blogs?deleted=1');
  }
}; 