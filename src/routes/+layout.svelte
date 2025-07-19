<script lang="ts">
  import '../app.css';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let { children } = $props();
  const isAuthenticated = writable(false);

  onMount(async () => {
    const { data } = await supabase.auth.getUser();
    isAuthenticated.set(!!data.user);
    supabase.auth.onAuthStateChange((_event, session) => {
      isAuthenticated.set(!!session?.user);
    });
  });

  async function handleLogout() {
    await supabase.auth.signOut();
    goto('/login');
  }
</script>

<nav class="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
  <a href="/" class="text-lg font-bold">ML Club Blogs</a>
  <div>
    {#if $isAuthenticated}
      <button on:click={handleLogout} class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
    {:else}
      <a href="/login" class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Login</a>
    {/if}
  </div>
</nav>

<main class="max-w-4xl mx-auto mt-8 px-4">
  <slot />
</main>
