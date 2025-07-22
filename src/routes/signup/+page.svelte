<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let errorMsg = '';
  let loading = false;

  async function handleSignup() {
    errorMsg = '';
    loading = true;

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    loading = false;

    if (error) {
      errorMsg = error.message;
    } else {
      goto('/login?message=Account created! Please login');
    }
  }
</script>

<div class="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-6">Sign Up</h1>

  <form on:submit|preventDefault={handleSignup} class="space-y-4">
    <div>
      <label class="block mb-1 font-medium">Email</label>
      <input type="email" bind:value={email} required class="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label class="block mb-1 font-medium">Password</label>
      <input type="password" bind:value={password} required class="w-full border rounded px-3 py-2" />
    </div>

    <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50" disabled={loading}>
      {loading ? 'Signing up...' : 'Sign Up'}
    </button>

    {#if errorMsg}
      <div class="text-red-600 mt-2">{errorMsg}</div>
    {/if}
  </form>
</div>
