<script lang="ts">
  export let data: { blogs: Array<any> };
</script>

<div class="container mx-auto px-4 py-8">
  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each data.blogs as blog}
      <div class="bg-white rounded-lg shadow-md p-6 flex flex-col">
        <h2 class="text-xl font-bold mb-2">{blog.title}</h2>
        <p class="text-gray-600 mb-1">By <span class="font-medium">{blog.author}</span></p>
        <p class="text-sm text-blue-500 mb-1">{blog.category}</p>
        <p class="text-xs text-gray-400 mb-2">{blog.published_at ? blog.published_at.slice(0, 10) : ''}</p>
        <p class="text-gray-700 flex-1">{blog.description}</p>
      </div>
    {/each}
  </div>
</div> 