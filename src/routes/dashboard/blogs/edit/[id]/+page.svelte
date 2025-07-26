<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  
  let title = '';
  let content = '';
  let category = '';
  let cover_url = '';
  let status = 'published';
  let errorMsg = '';
  let successMsg = '';
  let loading = false;
  let blogId = '';

  onMount(() => {
    try {
      blogId = $page.params.id;
      
      // Get the blog data from localStorage
      const editingBlog = localStorage.getItem('editingBlog');
      if (editingBlog) {
        const blog = JSON.parse(editingBlog);
        
        // Populate the form with existing data
        title = blog.title || '';
        content = blog.content || '';
        category = blog.category || '';
        cover_url = blog.cover_url || '';
        status = blog.status || 'published';
        
        // Clear the editing data from localStorage
        localStorage.removeItem('editingBlog');
      } else {
        errorMsg = 'No blog data found for editing';
      }
    } catch (err) {
      errorMsg = 'Failed to load blog data: ' + err.message;
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
      // Get existing blogs from localStorage
      const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
      
      // Find and update the specific blog
      const updatedBlogs = savedBlogs.map(blog => {
        if (blog.id === blogId) {
          return {
            ...blog,
            title,
            content,
            category,
            cover_url: cover_url || null,
            status,
            updated_at: new Date().toISOString()
          };
        }
        return blog;
      });

      // Save back to localStorage
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs));

      successMsg = 'Blog updated successfully! Redirecting to My Blogs...';
      
      setTimeout(() => {
        goto('/dashboard/blogs');
      }, 2000);

    } catch (error) {
      errorMsg = error.message || 'Failed to update blog';
    } finally {
      loading = false;
    }
  }

  function cancelEdit() {
    if (confirm('Are you sure you want to cancel? Your changes will be lost.')) {
      goto('/dashboard/blogs');
    }
  }
</script>

<h2>Edit Blog</h2>

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
    <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Status</label>
    <select
      bind:value={status}
      style="width: 100%; padding: 0.75em; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1em;"
    >
      <option value="published">Published</option>
      <option value="draft">Draft</option>
    </select>
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

  <div style="display: flex; gap: 1em;">
    <button
      type="submit"
      disabled={loading}
      style="flex: 1; padding: 0.75em; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 1em; cursor: pointer; font-weight: 600;"
    >
      {loading ? 'Updating Blog...' : 'Update Blog'}
    </button>
    
    <button
      type="button"
      on:click={cancelEdit}
      style="flex: 1; padding: 0.75em; background: #6b7280; color: white; border: none; border-radius: 6px; font-size: 1em; cursor: pointer; font-weight: 600;"
    >
      Cancel
    </button>
  </div>
</form> 