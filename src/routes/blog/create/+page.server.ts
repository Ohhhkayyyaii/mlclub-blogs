import { redirect, error as svelteError } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  // Use locals.session for session check
  const session = event.locals?.session;
  if (!session || !session.user) {
    throw redirect(303, '/login?message=Please%20log%20in%20to%20create%20a%20blog.');
  }

  // Optionally, you could fetch user details from Supabase here and handle errors
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error.message);
      throw svelteError(500, 'Failed to fetch user session.');
    }
  } catch (err) {
    console.error('Unexpected error fetching user:', err);
    throw svelteError(500, 'Unexpected error fetching user session.');
  }

  return {};
}; 