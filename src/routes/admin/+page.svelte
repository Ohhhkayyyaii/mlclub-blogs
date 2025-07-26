<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let blogs = [];
  let loading = true;
  let errorMsg = '';
  let deletingId = null;
  let filterStatus = 'all';
  let searchTerm = '';

  onMount(() => {
    try {
      // Check if user is logged in and is admin
      const userData = localStorage.getItem('currentUser');
      if (!userData) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }

      const currentUser = JSON.parse(userData);
      if (currentUser.role !== 'admin') {
        // Redirect to regular user dashboard if not admin
        window.location.href = '/dashboard/blogs';
        return;
      }

      // Load all blogs for admin
      const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
      const sampleBlogs = [
        {
          id: '1',
          title: 'Introduction to Machine Learning',
          author: 'ML Club Member',
          description: 'A comprehensive guide to getting started with machine learning concepts and algorithms.',
          content: 'Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions without being explicitly programmed...',
          category: 'ML',
          created_at: '2025-01-15T10:00:00Z',
          status: 'published'
        },
        {
          id: '2',
          title: 'Deep Learning Fundamentals',
          author: 'AI Researcher',
          description: 'Understanding neural networks, backpropagation, and deep learning architectures.',
          content: 'Deep learning is a subset of machine learning that uses neural networks with multiple layers to model and understand complex patterns...',
          category: 'DL',
          created_at: '2025-01-14T14:30:00Z',
          status: 'published'
        },
        {
          id: '3',
          title: 'Natural Language Processing Basics',
          author: 'NLP Expert',
          description: 'Learn about text processing, sentiment analysis, and language models.',
          content: 'Natural Language Processing (NLP) is a field of artificial intelligence that focuses on the interaction between computers and human language...',
          category: 'NLP',
          created_at: '2025-01-13T09:15:00Z',
          status: 'published'
        }
      ];
      
      // Combine all blogs and sort by creation date (newest first)
      const allBlogs = [...savedBlogs, ...sampleBlogs];
      allBlogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      blogs = allBlogs;
    } catch (err) {
      errorMsg = 'Failed to load blogs: ' + err.message;
      console.error('Admin page error:', err);
    } finally {
      loading = false;
    }
  });

  // Filter blogs based on status and search term
  $: filteredBlogs = blogs.filter(blog => {
    const matchesStatus = filterStatus === 'all' || blog.status === filterStatus;
    const matchesSearch = !searchTerm || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  function deleteBlog(id) {
    const blogToDelete = blogs.find(blog => blog.id === id);
    
    const confirmMessage = `Are you sure you want to delete "${blogToDelete.title}" by ${blogToDelete.author}? This action cannot be undone.`;
    
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
    const blogToEdit = blogs.find(blog => blog.id === id);
    if (blogToEdit) {
      localStorage.setItem('editingBlog', JSON.stringify(blogToEdit));
      goto(`/dashboard/blogs/edit/${id}`);
    } else {
      errorMsg = 'Blog not found for editing';
    }
  }

  function toggleBlogStatus(id) {
    const blogToToggle = blogs.find(blog => blog.id === id);
    if (blogToToggle) {
      const newStatus = blogToToggle.status === 'published' ? 'draft' : 'published';
      
      try {
        // Update in localStorage (only user-created blogs are stored there)
        const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
        const updatedBlogs = savedBlogs.map(blog => {
          if (blog.id === id) {
            return { ...blog, status: newStatus };
          }
          return blog;
        });
        localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
        
        // Update the UI
        blogs = blogs.map(blog => {
          if (blog.id === id) {
            return { ...blog, status: newStatus };
          }
          return blog;
        });
        
        alert(`Blog status changed to ${newStatus}!`);
      } catch (err) {
        errorMsg = 'Failed to update blog status: ' + err.message;
      }
    }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  // Get statistics
  $: totalBlogs = blogs.length;
  $: publishedBlogs = blogs.filter(blog => blog.status === 'published').length;
  $: draftBlogs = blogs.filter(blog => blog.status === 'draft').length;
</script>

<h2>Admin Dashboard - Manage All Blogs</h2>

<p style="color: #6b7280; margin-bottom: 2em; font-style: italic;">
  This dashboard allows you to manage all blogs in the system. To view only your own blogs, go to "My Blogs".
</p>

<!-- Statistics -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1em; margin-bottom: 2em;">
  <div style="background: #3b82f6; color: white; padding: 1.5em; border-radius: 8px; text-align: center;">
    <h3 style="margin: 0 0 0.5em 0; font-size: 2em;">{totalBlogs}</h3>
    <p style="margin: 0; font-size: 0.9em;">Total Blogs</p>
  </div>
  <div style="background: #22c55e; color: white; padding: 1.5em; border-radius: 8px; text-align: center;">
    <h3 style="margin: 0 0 0.5em 0; font-size: 2em;">{publishedBlogs}</h3>
    <p style="margin: 0; font-size: 0.9em;">Published</p>
  </div>
  <div style="background: #fbbf24; color: white; padding: 1.5em; border-radius: 8px; text-align: center;">
    <h3 style="margin: 0 0 0.5em 0; font-size: 2em;">{draftBlogs}</h3>
    <p style="margin: 0; font-size: 0.9em;">Drafts</p>
  </div>
</div>

<!-- Filters -->
<div style="display: flex; gap: 1em; margin-bottom: 2em; align-items: center; flex-wrap: wrap;">
  <div>
    <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Filter by Status:</label>
    <select 
      bind:value={filterStatus}
      style="padding: 0.5em; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.9em;"
    >
      <option value="all">All Blogs</option>
      <option value="published">Published Only</option>
      <option value="draft">Drafts Only</option>
    </select>
  </div>
  
  <div>
    <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Search:</label>
    <input 
      type="text" 
      bind:value={searchTerm}
      placeholder="Search by title, author, or category..."
      style="padding: 0.5em; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.9em; min-width: 250px;"
    />
  </div>
</div>

{#if loading}
  <p>Loading blogs...</p>
{:else if errorMsg}
  <div class="message-error">{errorMsg}</div>
  <div style="text-align: center; margin-top: 1em;">
    <a href="/dashboard/blogs" style="color: #2563eb; text-decoration: none; font-weight: 600;">
      Go to My Blogs
    </a>
  </div>
{:else if filteredBlogs.length === 0}
  <div style="text-align: center; padding: 2em;">
    <p>No blogs found matching your criteria.</p>
  </div>
{:else}
  <div class="blog-list">
    {#each filteredBlogs as blog}
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
              {#if blog.author}
                <span style="margin-left: 1em;">• Author: {blog.author}</span>
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
        <div style="display: flex; gap: 0.5em; margin-top: 1em; flex-wrap: wrap;">
          <button 
            on:click={() => editBlog(blog.id)}
            style="padding: 0.5em 1em; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 0.9em; cursor: pointer;"
          >
            Edit
          </button>
          <button 
            on:click={() => toggleBlogStatus(blog.id)}
            style="padding: 0.5em 1em; background: {blog.status === 'published' ? '#fbbf24' : '#22c55e'}; color: white; border: none; border-radius: 4px; font-size: 0.9em; cursor: pointer;"
          >
            {blog.status === 'published' ? 'Unpublish' : 'Publish'}
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