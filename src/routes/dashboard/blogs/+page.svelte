<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let blogs = [];
  let loading = true;
  let errorMsg = '';
  let deletingId = null;
  let currentUser = null;
  let isAdmin = false;

  onMount(() => {
    try {
      // Check if user is logged in
      const userData = localStorage.getItem('currentUser');
      if (!userData) {
        // Redirect to login if not authenticated
        goto('/login');
        return;
      }

      currentUser = JSON.parse(userData);
      isAdmin = currentUser.role === 'admin';
      
      // Both regular users and admins see only their own blogs in "My Blogs"
      const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
      
      // Filter blogs to show only those created by the current user
      const userBlogs = savedBlogs.filter(blog => blog.author === currentUser.name);
      blogs = userBlogs;
      
    } catch (err) {
      errorMsg = 'Failed to load blogs: ' + err.message;
    } finally {
      loading = false;
    }
  });

  function deleteBlog(id) {
    const blogToDelete = blogs.find(blog => blog.id === id);
    
    const confirmMessage = `Are you sure you want to delete "${blogToDelete.title}"? This action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      deletingId = id;
      
      try {
        // Remove from localStorage (only user-created blogs are stored there)
        const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
        const updatedBlogs = savedBlogs.filter(blog => blog.id !== id);
        localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
        
        // Update the UI (remove from current view)
        blogs = blogs.filter(blog => blog.id !== id);
        
        // Show success message
        setTimeout(() => {
          alert('Blog deleted successfully!');
        }, 100);
      } catch (err) {
        errorMsg = 'Failed to delete blog: ' + err.message;
      } finally {
        deletingId = null;
      }
    }
  }

  function editBlog(id) {
    // Find the blog to edit
    const blogToEdit = blogs.find(blog => blog.id === id);
    if (blogToEdit) {
      // Store the blog data in localStorage for the edit form to access
      localStorage.setItem('editingBlog', JSON.stringify(blogToEdit));
      // Navigate to edit page
      goto(`/dashboard/blogs/edit/${id}`);
    } else {
      errorMsg = 'Blog not found for editing';
    }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
</script>

<h2>My Blogs</h2>

{#if loading}
  <p>Loading your blogs...</p>
{:else if errorMsg}
  <div class="message-error">{errorMsg}</div>
{:else if blogs.length === 0}
  <div style="text-align: center; padding: 2em;">
    <p>You haven't created any blogs yet.</p>
    <a href="/blog/create" style="color: #3b82f6; font-weight: 600; text-decoration: none;">
      Create your first blog →
    </a>
  </div>
{:else}
  <div class="blog-list">
    {#each blogs as blog}
      <div class="blog-card">
        <!-- Blog Info -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1em;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5em 0; color: #1f2937; font-size: 1.3em;">{blog.title}</h3>
            <div style="font-size: 0.9em; color: #6b7280; margin-bottom: 0.5em;">
              <span>Created: {formatDate(blog.created_at)}</span>
              {#if blog.category}
                <span style="margin-left: 1em;">• Category: {blog.category}</span>
              {/if}

            </div>
            <div style="margin-bottom: 0.5em;">
              <span style="padding: 0.2em 0.6em; background: {blog.status === 'published' ? '#22c55e' : '#fbbf24'}; color: white; border-radius: 4px; font-size: 0.8em; font-weight: 500;">
                {blog.status}
              </span>
            </div>
            <p style="margin: 0; line-height: 1.5; color: #374151; font-size: 0.95em;">
              {blog.content.length > 100 ? blog.content.substring(0, 100) + '...' : blog.content}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 0.5em; margin-top: 1em;">
          <button 
            on:click={() => editBlog(blog.id)}
            style="padding: 0.5em 1em; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 0.9em; cursor: pointer;"
          >
            Edit
          </button>
          <button 
            on:click={() => deleteBlog(blog.id)}
            disabled={deletingId === blog.id}
            style="padding: 0.5em 1em; background: #ef4444; color: white; border: none; border-radius: 4px; font-size: 0.9em; cursor: pointer;"
          >
            {deletingId === blog.id ? 'Deleting...' : 'Delete'}
          </button>
          <a 
            href={`/blogs/${blog.id}`}
            style="padding: 0.5em 1em; background: #10b981; color: white; border: none; border-radius: 4px; font-size: 0.9em; text-decoration: none; display: inline-block;"
          >
            View
          </a>
        </div>
      </div>
    {/each}
  </div>

  <!-- Create New Blog Button -->
  <div style="text-align: center; margin-top: 2em;">
    <a 
      href="/blog/create"
      style="padding: 0.75em 1.5em; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 1em; text-decoration: none; display: inline-block; font-weight: 600;"
    >
      Create New Blog
    </a>
  </div>
{/if} 