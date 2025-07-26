<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase, isSupabaseAvailable } from '$lib/supabaseClient';
  
  let email = '';
  let password = '';
  let errorMsg = '';
  let successMsg = '';
  let loading = false;
  let loginType = 'user'; // 'user' or 'admin'

  onMount(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.role === 'admin') {
        goto('/admin');
      } else {
        goto('/dashboard/blogs');
      }
    }
  });

  async function handleLogin() {
    errorMsg = '';
    successMsg = '';
    
    if (!email || !password) {
      errorMsg = 'Please enter both email and password.';
      return;
    }

    loading = true;

    try {
      if (!isSupabaseAvailable() || !supabase) {
        errorMsg = 'Supabase is not available. Please check your configuration.';
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        errorMsg = error.message;
      } else {
        // Get user profile from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error('Profile fetch error:', profileError);
        }
        
        // Store user data in localStorage for client-side access
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || data.user.email?.split('@')[0] || 'User',
          role: profile?.role || 'user'
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        successMsg = 'Login successful! Redirecting...';
        
        setTimeout(() => {
          if (userData.role === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/dashboard/blogs';
          }
        }, 1500);
      }
    } catch (err) {
      errorMsg = 'Login failed: ' + err.message;
    } finally {
      loading = false;
    }
  }

  function switchLoginType(type) {
    loginType = type;
    errorMsg = '';
    successMsg = '';
    email = '';
    password = '';
  }
</script>

<div style="max-width: 400px; margin: 0 auto; padding: 2em;">
  <h2 style="text-align: center; margin-bottom: 2em; color: #1f2937;">Login to ML Club Blogs</h2>

  <!-- Login Type Selector -->
  <div style="display: flex; margin-bottom: 2em; border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden;">
    <button 
      on:click={() => switchLoginType('user')}
      style="flex: 1; padding: 0.75em; background: {loginType === 'user' ? '#2563eb' : '#f3f4f6'}; color: {loginType === 'user' ? 'white' : '#374151'}; border: none; cursor: pointer; font-weight: 600;"
    >
      Regular User
    </button>
    <button 
      on:click={() => switchLoginType('admin')}
      style="flex: 1; padding: 0.75em; background: {loginType === 'admin' ? '#dc2626' : '#f3f4f6'}; color: {loginType === 'admin' ? 'white' : '#374151'}; border: none; cursor: pointer; font-weight: 600;"
    >
      Admin
    </button>
  </div>

  <!-- Login Form -->
  <form on:submit|preventDefault={handleLogin}>
    <div style="margin-bottom: 1.5em;">
      <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Email</label>
      <input
        type="email"
        bind:value={email}
        required
        placeholder="Enter your email"
        style="width: 100%; padding: 0.75em; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1em;"
      />
    </div>

    <div style="margin-bottom: 1.5em;">
      <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Password</label>
      <input
        type="password"
        bind:value={password}
        required
        placeholder="Enter your password"
        style="width: 100%; padding: 0.75em; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1em;"
      />
    </div>

    {#if errorMsg}
      <div class="message-error" style="margin-bottom: 1em;">{errorMsg}</div>
    {/if}
    {#if successMsg}
      <div class="message-success" style="margin-bottom: 1em;">{successMsg}</div>
    {/if}

    <button
      type="submit"
      disabled={loading}
      style="width: 100%; padding: 0.75em; background: {loginType === 'admin' ? '#dc2626' : '#2563eb'}; color: white; border: none; border-radius: 6px; font-size: 1em; cursor: pointer; font-weight: 600;"
    >
      {loading ? 'Logging in...' : `Login as ${loginType === 'admin' ? 'Admin' : 'User'}`}
    </button>
  </form>

  <!-- Supabase Notice -->
  <div style="margin-top: 2em; padding: 1em; background: #dbeafe; border-radius: 6px; font-size: 0.9em;">
    <h4 style="margin: 0 0 0.5em 0; color: #1e40af;">Supabase Authentication</h4>
    <p style="margin: 0; color: #1e40af;">
      This app uses Supabase for authentication. Register a new account or use existing credentials.
    </p>
  </div>

  <!-- Register Link -->
  <div style="text-align: center; margin-top: 2em;">
    <p style="margin: 0; color: #6b7280;">
      Don't have an account? 
      <a href="/register" style="color: #2563eb; text-decoration: none; font-weight: 600;">
        Register here
      </a>
    </p>
  </div>
</div> 