<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase, isSupabaseAvailable } from '$lib/supabaseClient';
  
  let title = '';
  let content = '';
  let category = '';
  let tags = '';
  let cover_url = '';
  let errorMsg = '';
  let successMsg = '';
  let loading = false;
  let currentUser = null;

  onMount(async () => {
    if (isSupabaseAvailable() && supabase) {
      // Use Supabase authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        goto('/login');
        return;
      }
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      currentUser = {
        id: session.user.id,
        email: session.user.email,
        name: profile?.name || session.user.email?.split('@')[0] || 'User',
        role: profile?.role || 'user'
      };
    } else {
      // Use local authentication
      const userData = localStorage.getItem('currentUser');
      if (!userData) {
        goto('/login');
        return;
      }
      currentUser = JSON.parse(userData);
    }
  });

  async function handleSubmit() {
    errorMsg = '';
    successMsg = '';
    
    if (!title || !content || !category) {
      errorMsg = 'Please fill in all required fields.';
      return;
    }
    
    loading = true;
    
    try {
      if (isSupabaseAvailable() && supabase) {
        // Create blog in Supabase
        const { data, error } = await supabase
          .from('blogs')
          .insert([
            {
              title,
              content,
              category,
              tags: tags.split(',').map(t => t.trim()).filter(Boolean),
              cover_url: cover_url || null,
              status: 'published',
              author: currentUser.name,
              author_id: currentUser.id
            }
          ])
          .select()
          .single();
        
        if (error) {
          errorMsg = error.message;
          return;
        }
      } else {
        // Fallback to localStorage
        const newBlog = {
          id: Date.now().toString(),
          title,
          content,
          category,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          cover_url: cover_url || null,
          status: 'published',
          author: currentUser.name,
          created_at: new Date().toISOString()
        };
        
        const existingBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
        existingBlogs.unshift(newBlog);
        localStorage.setItem('blogs', JSON.stringify(existingBlogs));
      }
      
      successMsg = 'Blog created successfully! Redirecting to home...';
      title = '';
      content = '';
      category = '';
      tags = '';
      cover_url = '';
      setTimeout(() => goto('/'), 2000);
      
    } catch (error) {
      errorMsg = error.message || 'Failed to create blog';
    } finally {
      loading = false;
    }
  }
</script>

<h2>Create a New Blog</h2>

{#if errorMsg}
  <div class="message-error">{errorMsg}</div>
{/if}
{#if successMsg}
  <div class="message-success">{successMsg}</div>
{/if}

<form on:submit|preventDefault={handleSubmit} style="max-width: 600px; margin: 0 auto;">
  <div style="margin-bottom: 1.5em;">
    <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Title *</label>
    <input 
      type="text" 
      bind:value={title} 
      required 
      placeholder="Enter your blog title"
      style="width: 100%; padding: 0.75em; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1em;"
    />
  </div>

  <div style="margin-bottom: 1.5em;">
    <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Content *</label>
    <textarea 
      bind:value={content} 
      required 
      placeholder="Write your blog content here..."
      rows="8"
      style="width: 100%; padding: 0.75em; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1em; resize: vertical;"
    ></textarea>
  </div>

    <div style="margin-bottom: 1.5em;">
    <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Category *</label>
    <input
      type="text"
      bind:value={category}
      required
      placeholder="e.g., Machine Learning, Deep Learning, NLP, Computer Vision"
      style="width: 100%; padding: 0.75em; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1em;"
    />
  </div>

  <div style="margin-bottom: 1.5em;">
    <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Tags (comma separated)</label>
    <input
      type="text"
      bind:value={tags}
      placeholder="e.g., python, machine-learning, tutorial, neural-networks"
      style="width: 100%; padding: 0.75em; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1em;"
    />
  </div>

  <div style="margin-bottom: 2em;">
    <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Cover Image URL (optional)</label>
    <input 
      type="url" 
      bind:value={cover_url} 
      placeholder="https://example.com/image.jpg"
      style="width: 100%; padding: 0.75em; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1em;"
    />
  </div>

  <button 
    type="submit" 
    disabled={loading}
    style="width: 100%; padding: 0.75em; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 1em; cursor: pointer; font-weight: 600;"
  >
    {loading ? 'Creating Blog...' : 'Create Blog'}
  </button>
</form> 