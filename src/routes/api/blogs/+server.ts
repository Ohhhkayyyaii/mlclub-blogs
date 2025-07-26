import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { title, content, tags, category, cover_url, status, author_id } = await request.json();
    
    // Validate required fields
    if (!title || !content || !category || !author_id) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if user is authenticated
    const session = locals.session;
    if (!session?.user || session.user.id !== author_id) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Insert blog using server-side Supabase client
    const { error } = await locals.supabase.from('blogs').insert([{
      title,
      content,
      tags: tags || [],
      category,
      cover_url: cover_url || null,
      status: status || 'draft',
      author_id
    }]);
    
    if (error) {
      return json({ error: error.message }, { status: 500 });
    }
    
    return json({ success: true, message: 'Blog created successfully' });
    
  } catch (error) {
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}; 