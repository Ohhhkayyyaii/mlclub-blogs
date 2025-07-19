<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  let title = '';
  let content = '';
  let tags = '';
  let category = '';
  let cover_url = '';
  let errorMsg = '';
  let successMsg = '';
  let loading = false;
  let userId: string | null = null;

  // Get the current user on mount
  supabase.auth.getUser().then(({ data, error }) => {
    if (data?.user) {
      userId = data.user.id;
    } else {
      userId = null;
    }
  });

  async function handleSubmit() {
    errorMsg = '';
    successMsg = '';
    if (!userId) {
      errorMsg = 'You must be logged in to create a blog.';
      return;
    }
    loading = true;
    const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean);
    const { error } = await supabase.from('blogs').insert([{
      title,
      content,
      tags: tagArr,
      category,
      cover_url: cover_url || null,
      status: 'draft',
      author_id: userId
    }]);
    loading = false;
    if (error) {
      errorMsg = error.message;
    } else {
      successMsg = 'Blog created successfully!';
      title = '';
      content = '';
      tags = '';
      category = '';
      cover_url = '';
      setTimeout(() => goto('/'), 1200);
    }
  }
</script>

<div class="max-w-xl mx-auto mt-10 p-8 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-6">Create a New Blog</h1>
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label class="block mb-1 font-medium">Title</label>
      <input class="w-full border rounded px-3 py-2" bind:value={title} required />
    </div>
    <div>
      <label class="block mb-1 font-medium">Content</label>
      <textarea class="w-full border rounded px-3 py-2 min-h-[120px]" bind:value={content} required></textarea>
    </div>
    <div>
      <label class="block mb-1 font-medium">Tags (comma separated)</label>
      <input class="w-full border rounded px-3 py-2" bind:value={tags} />
    </div>
    <div>
      <label class="block mb-1 font-medium">Category</label>
      <input class="w-full border rounded px-3 py-2" bind:value={category} required />
    </div>
    <div>
      <label class="block mb-1 font-medium">Cover URL (optional)</label>
      <input class="w-full border rounded px-3 py-2" bind:value={cover_url} />
    </div>
    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
      {loading ? 'Creating...' : 'Create Blog'}
    </button>
    {#if errorMsg}
      <div class="text-red-600 mt-2">{errorMsg}</div>
    {/if}
    {#if successMsg}
      <div class="text-green-600 mt-2">{successMsg}</div>
    {/if}
  </form>
</div> 