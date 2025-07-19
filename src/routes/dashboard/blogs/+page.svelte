<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  export let data: { blogs: Blog[] };
  type Blog = {
    id: string;
    title: string;
    status: string;
    created_at: string;
  };
  let deletingId: string | null = null;
  let errorMsg = '';
  let loading = false;
  let toastMsg = '';
  let toastType: 'success' | 'error' | '' = '';

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  function confirmDelete(id: string) {
    deletingId = id;
  }

  async function deleteBlog(id: string) {
    loading = true;
    errorMsg = '';
    toastMsg = '';
    toastType = '';
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    loading = false;
    if (error) {
      toastMsg = 'Failed to delete blog: ' + error.message;
      toastType = 'error';
    } else {
      toastMsg = 'Blog deleted successfully!';
      toastType = 'success';
      // Remove deleted blog from UI
      data.blogs = data.blogs.filter(b => b.id !== id);
      deletingId = null;
      setTimeout(() => {
        toastMsg = '';
        goto('/dashboard/blogs');
      }, 1200);
    }
  }
</script>

<div class="max-w-3xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">Your Blogs</h1>
  {#if toastMsg}
    <div class="mb-4 p-3 rounded {toastType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}">{toastMsg}</div>
  {/if}
  {#if errorMsg}
    <div class="bg-red-100 text-red-700 p-2 rounded mb-4">{errorMsg}</div>
  {/if}
  {#if data.blogs.length === 0}
    <div class="text-gray-500">You have not created any blogs yet.</div>
  {:else}
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded shadow">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="py-2 px-4">Title</th>
            <th class="py-2 px-4">Status</th>
            <th class="py-2 px-4">Created</th>
            <th class="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each data.blogs as blog}
            <tr class="border-b">
              <td class="py-2 px-4 font-medium">{blog.title}</td>
              <td class="py-2 px-4">
                <span class={blog.status === 'published' ? 'text-green-600' : 'text-yellow-600'}>{blog.status}</span>
              </td>
              <td class="py-2 px-4">{formatDate(blog.created_at)}</td>
              <td class="py-2 px-4 flex gap-2 items-center">
                <a href={`/dashboard/blogs/edit/${blog.id}`} class="text-blue-600 hover:underline">Edit</a>
                <button class="text-red-600 hover:underline" on:click={() => confirmDelete(blog.id)} disabled={loading}>
                  Delete
                </button>
                {#if deletingId === blog.id}
                  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div class="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                      <h2 class="text-lg font-bold mb-2">Confirm Delete</h2>
                      <p class="mb-4">Are you sure you want to delete <span class="font-semibold">{blog.title}</span>?</p>
                      <div class="flex gap-4 justify-end">
                        <button class="px-4 py-2 bg-gray-200 rounded" on:click={() => deletingId = null} disabled={loading}>Cancel</button>
                        <button class="px-4 py-2 bg-red-600 text-white rounded" on:click={() => deleteBlog(blog.id)} disabled={loading}>
                          {loading ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  body { background: #f7fafc; }
</style> 