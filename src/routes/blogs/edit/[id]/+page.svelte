<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  export let data: { blog: any };

  let title = data.blog.title;
  let content = data.blog.content;
  let loading = false;
  let toast: string | null = null;
  let deleting = false;
  let showConfirm = false;

  async function updateBlog() {
    loading = true;
    const { error } = await supabase
      .from('blogs')
      .update({ title, content })
      .eq('id', data.blog.id);
    loading = false;
    if (error) {
      toast = 'Failed to update blog.';
    } else {
      toast = 'Blog updated!';
      setTimeout(() => goto(`/blogs/${data.blog.id}`), 1200);
    }
    setTimeout(() => (toast = null), 2000);
  }

  async function deleteBlog() {
    deleting = true;
    const form = new FormData();
    form.append('delete', '1');
    const res = await fetch('', {
      method: 'POST',
      body: form
    });
    deleting = false;
    if (res.redirected) {
      // Redirect will happen automatically, but for SPA navigation:
      goto(res.url);
    } else {
      toast = 'Failed to delete blog.';
      setTimeout(() => (toast = null), 2000);
    }
  }
</script>

<div class="max-w-xl mx-auto py-8">
  <h1 class="text-2xl font-bold mb-6">Edit Blog</h1>
  {#if toast}
    <div class="mb-4 bg-green-600 text-white px-4 py-2 rounded">{toast}</div>
  {/if}
  <form on:submit|preventDefault={updateBlog} class="space-y-4">
    <div>
      <label class="block mb-1 font-medium">Title</label>
      <input class="w-full border px-3 py-2 rounded" bind:value={title} required />
    </div>
    <div>
      <label class="block mb-1 font-medium">Content</label>
      <textarea class="w-full border px-3 py-2 rounded min-h-[150px]" bind:value={content} required></textarea>
    </div>
    <div class="flex gap-4 items-center">
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Blog'}
      </button>
      <button type="button" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" on:click={() => showConfirm = true} disabled={deleting}>
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  </form>
  {#if showConfirm}
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white p-6 rounded shadow max-w-sm w-full">
        <h2 class="text-lg font-bold mb-4">Confirm Delete</h2>
        <p class="mb-4">Are you sure you want to delete this blog? This action cannot be undone.</p>
        <div class="flex gap-4 justify-end">
          <button class="px-4 py-2 rounded bg-gray-200" on:click={() => showConfirm = false}>Cancel</button>
          <button class="px-4 py-2 rounded bg-red-600 text-white" on:click={deleteBlog} disabled={deleting}>Yes, Delete</button>
        </div>
      </div>
    </div>
  {/if}
</div> 