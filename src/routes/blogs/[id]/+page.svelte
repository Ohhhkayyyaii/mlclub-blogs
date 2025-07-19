<script lang="ts">
  export let data: { blog?: Blog; notFound: boolean };
  type Blog = {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    created_at: string;
    author: { id: string; email: string };
    cover_url?: string | null;
    status: string;
  };
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
</script>

<div class="max-w-2xl mx-auto px-4 py-8">
  {#if data.notFound}
    <div class="text-center py-20">
      <h1 class="text-3xl font-bold mb-4">404 - Blog Not Found</h1>
      <p class="text-gray-600 mb-8">The blog you are looking for does not exist or is not published.</p>
      <a href="/blogs" class="text-blue-600 hover:underline">← Back to Blogs</a>
    </div>
  {:else}
    <article class="bg-white rounded-lg shadow p-6">
      <h1 class="text-3xl font-bold mb-4">{data.blog.title}</h1>
      {#if data.blog.cover_url}
        <img src={data.blog.cover_url} alt="Cover image" class="w-full h-64 object-cover rounded mb-6" />
      {/if}
      <div class="flex flex-wrap gap-2 mb-4">
        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{data.blog.category}</span>
        {#each data.blog.tags as tag}
          <span class="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">{tag}</span>
        {/each}
      </div>
      <div class="text-sm text-gray-500 mb-6 flex flex-wrap gap-4">
        <span>By {data.blog.author?.email ?? 'Unknown'}</span>
        <span>{formatDate(data.blog.created_at)}</span>
      </div>
      <div class="prose max-w-none mb-8">{@html data.blog.content}</div>
      <a href="/blogs" class="inline-block text-blue-600 hover:underline font-medium">← Back to Blogs</a>
    </article>
  {/if}
</div>

<style>
  body { background: #f7fafc; }
</style> 