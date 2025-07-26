<script lang="ts">
  export let data: { blog: any };
  let { blog } = data;
</script>

<form method="POST" class="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md space-y-6">
  <h1 class="text-2xl font-bold mb-4">Edit Blog</h1>
  <div>
    <label class="block mb-1 font-medium">Title</label>
    <input name="title" required class="w-full border border-gray-300 rounded px-3 py-2" value={blog.title} />
  </div>
  <div>
    <label class="block mb-1 font-medium">Description</label>
    <input name="description" required class="w-full border border-gray-300 rounded px-3 py-2" value={blog.description} />
  </div>
  <div>
    <label class="block mb-1 font-medium">Content</label>
    <textarea name="content" required rows="6" class="w-full border border-gray-300 rounded px-3 py-2">{blog.content}</textarea>
  </div>
  <div>
    <label class="block mb-1 font-medium">Category</label>
    <input name="category" required class="w-full border border-gray-300 rounded px-3 py-2" value={blog.category} />
  </div>
  <div>
    <label class="block mb-1 font-medium">Author</label>
    <input name="author" required class="w-full border border-gray-300 rounded px-3 py-2" value={blog.author} />
  </div>
  <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Update</button>
</form> 