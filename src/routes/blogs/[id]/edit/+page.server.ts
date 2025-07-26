import { supabase } from '$lib/supabaseClient';
import { fail, redirect, error as svelteError } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { id } = params;
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Fetch user from locals
  const user = locals.session?.user || null;
  const role = locals.session?.user?.role || null;

  // Only allow if author or admin
  if (!user || (data.author_id !== user.id && role !== 'admin')) {
    throw svelteError(403, 'Unauthorized');
  }

  return {
    blog: data,
    user,
    role
  };
};

export const actions: Actions = {
  default: async ({ request, params, locals }) => {
    const { id } = params;
    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
    if (fetchError) {
      return fail(404, { error: fetchError.message });
    }
    const user = locals.session?.user;
    const role = locals.session?.user?.role;
    if (!user || (blog.author_id !== user.id && role !== 'admin')) {
      throw svelteError(403, 'Unauthorized');
    }
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const content = formData.get('content');
    const category = formData.get('category');
    const author = formData.get('author');

    const { error } = await supabase.from('blogs').update({
      title,
      description,
      content,
      category,
      author
    }).eq('id', id);

    if (error) {
      return fail(400, { error: error.message });
    }

    throw redirect(303, `/blogs/${id}`);
  }
}; 