<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  let blogs = [];
  let loading = true;
  let errorMsg = '';

  onMount(async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, author, description, content, created_at, status')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) {
      errorMsg = error.message;
    } else {
      blogs = data;
    }
    loading = false;
  });
</script>

<h2>Published Blogs</h2>
{#if loading}
  <p>Loading blogs...</p>
{:else if errorMsg}
  <div class="message-error">{errorMsg}</div>
{:else if blogs.length === 0}
  <p>No published blogs yet.</p>
{:else}
  <div class="blog-list">
    {#each blogs as blog}
      <div class="blog-card">
        <h2>{blog.title}</h2>
        <span style="font-size:0.9em; color:#666;">By {blog.author} • {new Date(blog.created_at).toLocaleDateString()}</span>
        <span class="status-badge published">Published</span>
        <p>{blog.description || blog.content.slice(0, 120) + '...'}</p>
        <a href={`/blogs/${blog.id}`} style="font-weight:bold;">Read More →</a>
      </div>
    {/each}
  </div>
{/if} 