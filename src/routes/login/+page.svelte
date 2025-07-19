<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  let email = '';
  let password = '';
  let errorMsg = '';
  let loading = false;
  let infoMsg = '';

  onMount(() => {
    const url = new URL(window.location.href);
    const msg = url.searchParams.get('message');
    if (msg) {
      infoMsg = decodeURIComponent(msg);
      setTimeout(() => { infoMsg = ''; }, 4000);
    }
  });

  async function handleLogin() {
    errorMsg = '';
    loading = true;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    loading = false;
    if (error) {
      errorMsg = error.message;
    } else {
      goto('/');
    }
  }
</script>

<div class="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-6">Login</h1>
  {#if infoMsg}
    <div class="mb-4 p-3 bg-blue-100 text-blue-800 rounded">{infoMsg}</div>
  {/if}
  <form on:submit|preventDefault={handleLogin} class="space-y-4">
    <div>
      <label class="block mb-1 font-medium">Email</label>
      <input type="email" class="w-full border rounded px-3 py-2" bind:value={email} required />
    </div>
    <div>
      <label class="block mb-1 font-medium">Password</label>
      <input type="password" class="w-full border rounded px-3 py-2" bind:value={password} required />
    </div>
    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
      {loading ? 'Logging in...' : 'Login'}
    </button>
    {#if errorMsg}
      <div class="text-red-600 mt-2">{errorMsg}</div>
    {/if}
  </form>
</div> 