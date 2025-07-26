import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const title = formData.get('title');
    const author = formData.get('author');
    const category = formData.get('category');
    const description = formData.get('description');
    const content = formData.get('content');

    // Get author_id from session
    const author_id = locals.session?.user?.id;
    if (!author_id) {
      return fail(401, { error: 'You must be logged in to create a blog.' });
    }

    // Use Supabase client from locals
    const supabase = locals.supabase;
    const { error } = await supabase.from('blogs').insert([
      { title, author, category, description, content, author_id }
    ]);

    if (error) {
      return fail(400, { error: error.message });
    }

    throw redirect(303, '/blogs');
  }
}; 