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

<div class="min-h-screen flex items-center justify-center bg-[#021526] text-[#E2E2B6] px-4">
  <div class="w-full max-w-md p-8 rounded-2xl shadow-lg bg-[#03346E]">
    <h1 class="text-3xl font-bold mb-6 text-center text-[#6EACDA]">Sign Up</h1>

    <form on:submit|preventDefault={handleSignup} class="space-y-5">
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
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>

      {#if errorMsg}
        <div class="text-red-400 text-sm mt-2">{errorMsg}</div>
      {/if}
    </form>
  </div>
</div>
