<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';

  let blogId = '';
  let title = '';
  let content = '';
  let loading = true;
  let errorMsg = '';
  let successMsg = '';

  onMount(async () => {
    blogId = $page.params.id;
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, content')
      .eq('id', blogId)
      .single();
    loading = false;
    if (error || !data) {
      errorMsg = 'Blog not found or you do not have permission to edit.';
      return;
    }
    title = data.title;
    content = data.content;
  });

  async function handleUpdate() {
    errorMsg = '';
    successMsg = '';
    if (!title || !content) {
      errorMsg = 'Title and content are required.';
      return;
    }
    const { error } = await supabase
      .from('blogs')
      .update({ title, content })
      .eq('id', blogId);
    if (error) {
      errorMsg = error.message;
    } else {
      successMsg = 'Blog updated! Redirecting...';
      setTimeout(() => goto('/dashboard/blogs'), 1200);
    }
  }
</script>

<div class="max-w-xl mx-auto mt-10 p-8 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-6">Edit Blog</h1>
  {#if loading}
    <div>Loading...</div>
  {:else}
    {#if errorMsg}
      <div class="bg-red-100 text-red-700 p-2 rounded mb-4">{errorMsg}</div>
    {/if}
    <form on:submit|preventDefault={handleUpdate} class="space-y-4">
      <div>
        <label class="block mb-1 font-medium">Title</label>
        <input class="w-full border rounded px-3 py-2" bind:value={title} required />
      </div>
      <div>
        <label class="block mb-1 font-medium">Content</label>
        <textarea class="w-full border rounded px-3 py-2 min-h-[120px]" bind:value={content} required></textarea>
      </div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Blog</button>
      {#if successMsg}
        <div class="text-green-600 mt-2">{successMsg}</div>
      {/if}
    </form>
  {/if}
</div> 