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

<div class="min-h-screen bg-[#021526] text-[#E2E2B6] px-4 py-12">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold mb-10 text-center text-[#6EACDA]">Published Blogs</h1>

    {#if data.blogs.length === 0}
      <div class="text-center text-gray-400">No published blogs found.</div>
    {:else}
      <div class="grid gap-6 md:grid-cols-2">
        {#each data.blogs as blog}
          <div class="bg-[#03346E] border border-[#6EACDA] rounded-xl p-6 flex flex-col justify-between h-full hover:shadow-xl transition-all duration-200">
            <div>
              <h2 class="text-2xl font-semibold mb-2 text-[#E2E2B6]">{blog.title}</h2>
              <p class="text-sm text-[#E2E2B6]/80 mb-4 leading-relaxed">{excerpt(blog.content)}</p>
            </div>

            <div class="flex items-center justify-between text-xs text-[#E2E2B6]/60 mt-auto">
              <span>By {blog.author_id}</span>
              <span>{formatDate(blog.created_at)}</span>
            </div>

            <a
              href={`/blogs/${blog.id}`}
              class="mt-4 inline-block text-[#6EACDA] font-medium hover:text-[#E2E2B6] transition"
            >
              Read More →
            </a>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
