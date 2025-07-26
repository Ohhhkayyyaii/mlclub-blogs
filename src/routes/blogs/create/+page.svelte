<script lang="ts">
  import { enhance } from '$app/forms';
  let formEl: HTMLFormElement | null = null;
  let success = false;

  $: if (success) {
    // Optionally, you can redirect or reset the form here
    setTimeout(() => {
      window.location.href = '/blogs';
    }, 1200);
  }
</script>

<form method="POST" bind:this={formEl} use:enhance={{
  onSuccess: () => {
    success = true;
  }
}} class="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md space-y-6">
  <h1 class="text-2xl font-bold mb-4">Create a New Blog</h1>
  <div>
    <label class="block mb-1 font-medium">Title</label>
    <input name="title" required class="w-full border border-gray-300 rounded px-3 py-2" />
  </div>
  <div>
    <label class="block mb-1 font-medium">Author</label>
    <input name="author" required class="w-full border border-gray-300 rounded px-3 py-2" />
  </div>
  <div>
    <label class="block mb-1 font-medium">Category</label>
    <input name="category" required class="w-full border border-gray-300 rounded px-3 py-2" />
  </div>
  <div>
    <label class="block mb-1 font-medium">Description</label>
    <input name="description" required class="w-full border border-gray-300 rounded px-3 py-2" />
  </div>
  <div>
    <label class="block mb-1 font-medium">Content</label>
    <textarea name="content" required rows="6" class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
  </div>
  <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Submit</button>
  {#if success}
    <div class="mt-4 text-green-600 font-semibold text-center">Blog created! Redirecting...</div>
  {/if}
</form> 