<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  
  // Sample data for testing - replace with Supabase later
  let sampleBlogs = [
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      author: 'ML Club Member',
      description: 'A comprehensive guide to getting started with machine learning concepts and algorithms.',
      content: 'Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions without being explicitly programmed...',
      category: 'ML',
      tags: ['machine-learning', 'ai', 'python', 'tutorial'],
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
      tags: ['deep-learning', 'neural-networks', 'tensorflow', 'pytorch'],
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
      tags: ['nlp', 'text-processing', 'bert', 'gpt', 'sentiment-analysis'],
      created_at: '2025-01-13T09:15:00Z',
      status: 'published'
    }
  ];
  
  let blogs = [];
  let loading = true;
  let errorMsg = '';

  onMount(async () => {
    try {
      // Load blogs from Supabase
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) {
        errorMsg = 'Failed to load blogs: ' + error.message;
      } else {
        // Combine with sample blogs for demo
        let allBlogs = [...(data || []), ...sampleBlogs];
        
        // Sort by creation date (newest first)
        allBlogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        blogs = allBlogs;
      }
      
    } catch (err) {
      errorMsg = 'Failed to load blogs: ' + err.message;
    } finally {
      loading = false;
    }
  });

  // Function to create short excerpt from content
  function createExcerpt(content, maxLength = 150) {
    if (!content) return 'No content available';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  }
</script>

<h2>Published Blogs</h2>
{#if loading}
  <p>Loading blogs...</p>
{:else if errorMsg}
  <div class="message-error">{errorMsg}</div>
{:else if blogs.length === 0}
  <p>No published blogs found.</p>
{:else}
  <div class="blog-list">
    {#each blogs as blog}
      <div class="blog-card">
        <!-- Title -->
        <h2 style="margin: 0 0 0.5em 0; color: #1f2937; font-size: 1.5em;">{blog.title}</h2>
        
        <!-- Author and Published Date -->
        <div style="margin-bottom: 0.75em; font-size: 0.9em; color: #6b7280;">
          <span style="font-weight: 500;">By {blog.author || 'Unknown'}</span>
          <span style="margin: 0 0.5em;">•</span>
          <span>{new Date(blog.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        
        <!-- Category -->
        {#if blog.category}
          <div style="margin-bottom: 0.75em;">
            <span style="padding: 0.25em 0.75em; background: #3b82f6; color: white; border-radius: 4px; font-size: 0.8em; font-weight: 500;">
              {blog.category}
            </span>
          </div>
        {/if}
        
        <!-- Short Excerpt -->
        <p style="margin-bottom: 1em; line-height: 1.6; color: #374151;">
          {createExcerpt(blog.description || blog.content)}
        </p>
        
        <!-- Read More Link -->
        <a href={`/blogs/${blog.id}`} style="color: #3b82f6; font-weight: 600; text-decoration: none; font-size: 0.9em;">
          Read More →
        </a>
      </div>
    {/each}
  </div>
{/if}
