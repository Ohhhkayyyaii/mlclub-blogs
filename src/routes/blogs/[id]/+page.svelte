<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  let blog = null;
  let loading = true;
  let errorMsg = '';

  // Sample blogs data (same as home page)
  const sampleBlogs = [
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      author: 'ML Club Member',
      description: 'A comprehensive guide to getting started with machine learning concepts and algorithms.',
      content: `Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions without being explicitly programmed. It focuses on the development of computer programs that can access data and use it to learn for themselves.

The process of learning begins with observations or data, such as examples, direct experience, or instruction, in order to look for patterns in data and make better decisions in the future based on the examples that we provide. The primary aim is to allow the computers learn automatically without human intervention or assistance and adjust actions accordingly.

Machine learning algorithms are typically classified into three broad categories, depending on the nature of the learning "signal" or "feedback" available to a learning system:

1. **Supervised Learning**: The algorithm is trained on labeled data, meaning the input data is paired with the correct output.

2. **Unsupervised Learning**: The algorithm is given unlabeled data and must find patterns and relationships on its own.

3. **Reinforcement Learning**: The algorithm learns by interacting with an environment and receiving rewards or penalties for actions.

Machine learning is used in a wide variety of applications, from recommendation systems and image recognition to natural language processing and autonomous vehicles.`,
      category: 'ML',
      created_at: '2025-01-15T10:00:00Z',
      status: 'published'
    },
    {
      id: '2',
      title: 'Deep Learning Fundamentals',
      author: 'AI Researcher',
      description: 'Understanding neural networks, backpropagation, and deep learning architectures.',
      content: `Deep learning is a subset of machine learning that uses neural networks with multiple layers to model and understand complex patterns. These neural networks are inspired by the human brain and are designed to recognize patterns in data.

Neural networks consist of layers of interconnected nodes (neurons), each processing and passing information to the next layer. The "deep" in deep learning refers to the number of layers through which the data is transformed.

Key concepts in deep learning include:

**Neural Networks**: The basic building blocks of deep learning, consisting of input, hidden, and output layers.

**Backpropagation**: An algorithm for calculating gradients in neural networks, essential for training.

**Activation Functions**: Functions that introduce non-linearity into the network, such as ReLU, Sigmoid, and Tanh.

**Convolutional Neural Networks (CNNs)**: Specialized for processing grid-like data such as images.

**Recurrent Neural Networks (RNNs)**: Designed for sequential data like text or time series.

Deep learning has revolutionized fields like computer vision, natural language processing, and speech recognition, achieving state-of-the-art results in many applications.`,
      category: 'DL',
      created_at: '2025-01-14T14:30:00Z',
      status: 'published'
    },
    {
      id: '3',
      title: 'Natural Language Processing Basics',
      author: 'NLP Expert',
      description: 'Learn about text processing, sentiment analysis, and language models.',
      content: `Natural Language Processing (NLP) is a field of artificial intelligence that focuses on the interaction between computers and human language. It enables computers to understand, interpret, and generate human language in a way that is both meaningful and useful.

NLP combines computational linguistics with statistical, machine learning, and deep learning models. These technologies enable computers to process human language in the form of text or voice data and understand its full meaning, complete with the speaker or writer's intent and sentiment.

Key areas of NLP include:

**Text Processing**: Tokenization, stemming, lemmatization, and part-of-speech tagging.

**Sentiment Analysis**: Determining the emotional tone behind a series of words.

**Machine Translation**: Automatically translating text from one language to another.

**Named Entity Recognition**: Identifying and classifying named entities in text.

**Text Generation**: Creating human-like text using language models.

Modern NLP heavily relies on deep learning models, particularly transformer architectures like BERT and GPT, which have achieved remarkable results in understanding and generating human language.`,
      category: 'NLP',
      created_at: '2025-01-13T09:15:00Z',
      status: 'draft'
    }
  ];

  onMount(() => {
    try {
      const blogId = $page.params.id;
      
      // First check localStorage for user-created blogs
      const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
      const allBlogs = [...savedBlogs, ...sampleBlogs];
      
      // Find the blog by ID
      blog = allBlogs.find(b => b.id === blogId);
      
      if (!blog) {
        errorMsg = 'Blog not found';
      }
      
    } catch (err) {
      errorMsg = 'Failed to load blog: ' + err.message;
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div style="text-align: center; padding: 2em;">
    <p>Loading blog...</p>
  </div>
{:else if errorMsg}
  <div class="message-error">{errorMsg}</div>
{:else if blog}
  <div style="max-width: 800px; margin: 0 auto;">
    <!-- Blog Header -->
    <div style="margin-bottom: 2em;">
      <h1 style="font-size: 2.5em; color: #1f2937; margin-bottom: 0.5em;">{blog.title}</h1>
      
      <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 1em; color: #6b7280; font-size: 0.95em;">
        <span style="font-weight: 500;">By {blog.author}</span>
        <span>•</span>
        <span>{new Date(blog.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</span>
        <span>•</span>
        <span style="padding: 0.25em 0.75em; background: #3b82f6; color: white; border-radius: 4px; font-size: 0.8em; font-weight: 500;">
          {blog.category}
        </span>
        <span>•</span>
        <span style="padding: 0.25em 0.75em; background: {blog.status === 'published' ? '#22c55e' : '#fbbf24'}; color: white; border-radius: 4px; font-size: 0.8em; font-weight: 500;">
          {blog.status}
        </span>
      </div>
      
      {#if blog.description}
        <p style="font-size: 1.2em; color: #4b5563; font-style: italic; margin-bottom: 2em;">
          {blog.description}
        </p>
      {/if}
    </div>

    <!-- Blog Content -->
    <div style="line-height: 1.8; color: #374151; font-size: 1.1em;">
      {#each blog.content.split('\n\n').filter(paragraph => paragraph.trim()) as paragraph}
        <p style="margin-bottom: 1.5em;">{paragraph}</p>
      {/each}
    </div>

    <!-- Back to Blogs Link -->
    <div style="margin-top: 3em; padding-top: 2em; border-top: 1px solid #e5e7eb;">
      <a href="/" style="color: #3b82f6; font-weight: 600; text-decoration: none; font-size: 1em;">
        ← Back to All Blogs
      </a>
    </div>
  </div>
{/if}

<style>
  body { background: #f7fafc; }
</style> 