<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

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

<div class="min-h-screen flex items-center justify-center bg-[#021526] text-[#E2E2B6] px-4">
  <div class="w-full max-w-md p-8 rounded-2xl shadow-lg bg-[#03346E]">
    <h1 class="text-3xl font-bold mb-6 text-center text-[#6EACDA]">Login</h1>

    {#if infoMsg}
      <div class="mb-4 p-3 rounded bg-[#6EACDA] text-[#021526] text-sm font-medium shadow">
        {infoMsg}
      </div>
    {/if}

    <form on:submit|preventDefault={handleLogin} class="space-y-5">
      <div>
        <label class="block mb-1 font-medium text-sm">Email</label>
        <input
          type="email"
          bind:value={email}
          required
          class="w-full bg-[#021526] border border-[#6EACDA] text-[#E2E2B6] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6EACDA]"
        />
      </div>

      <div>
        <label class="block mb-1 font-medium text-sm">Password</label>
        <input
          type="password"
          bind:value={password}
          required
          class="w-full bg-[#021526] border border-[#6EACDA] text-[#E2E2B6] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6EACDA]"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-[#6EACDA] text-[#021526] font-semibold py-2 rounded hover:bg-[#E2E2B6] hover:text-[#03346E] transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {#if errorMsg}
        <div class="text-red-400 text-sm mt-2">{errorMsg}</div>
      {/if}
    </form>

    <p class="mt-6 text-sm text-center">
      Don’t have an account?
      <a href="/signup" class="text-[#E2E2B6] underline hover:text-[#6EACDA] transition">Sign up</a>
    </p>
  </div>
</div>
