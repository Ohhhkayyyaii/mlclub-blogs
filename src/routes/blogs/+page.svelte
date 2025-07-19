<script lang="ts">
  export let data: { blogs: Blog[] };
  type Blog = {
    id: string;
    title: string;
    content: string;
    created_at: string;
    author_id: string;
    status: string;
  };
  function excerpt(content: string) {
    return content.length > 100 ? content.slice(0, 100) + '...' : content;
  }
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8 text-center">Published Blogs</h1>
  {#if data.blogs.length === 0}
    <div class="text-center text-gray-500">No published blogs found.</div>
  {:else}
    <div class="grid gap-6 md:grid-cols-2">
      {#each data.blogs as blog}
        <div class="bg-white rounded-lg shadow p-6 flex flex-col justify-between h-full">
          <div>
            <h2 class="text-xl font-semibold mb-2">{blog.title}</h2>
            <p class="text-gray-700 mb-3">{excerpt(blog.content)}</p>
          </div>
          <div class="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span>By {blog.author_id}</span>
            <span>{formatDate(blog.created_at)}</span>
          </div>
          <a class="mt-4 inline-block text-blue-600 hover:underline font-medium" href={`/blogs/${blog.id}`}>Read More →</a>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  /* Optional: add a subtle background */
  body { background: #f7fafc; }
</style> 