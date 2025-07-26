<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  
  let name = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let errorMsg = '';
  let successMsg = '';
  let loading = false;

  onMount(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      goto('/dashboard/blogs');
    }
  });

  async function handleRegister() {
    errorMsg = '';
    successMsg = '';
    
    if (!name || !email || !password || !confirmPassword) {
      errorMsg = 'Please fill in all fields.';
      return;
    }

    if (password !== confirmPassword) {
      errorMsg = 'Passwords do not match.';
      return;
    }

    if (password.length < 6) {
      errorMsg = 'Password must be at least 6 characters long.';
      return;
    }

    loading = true;

    try {
      if (!isSupabaseAvailable() || !supabase) {
        errorMsg = 'Supabase is not available. Please check your configuration.';
        return;
      }

      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (error) {
        errorMsg = error.message;
      } else {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user?.id,
              name: name,
              email: email,
              role: 'user'
            }
          ]);
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        successMsg = 'Registration successful! Please check your email to verify your account.';
        
        // Clear form
        name = '';
        email = '';
        password = '';
        confirmPassword = '';
        
        setTimeout(() => {
          goto('/login');
        }, 2000);
      }
    } catch (err) {
      errorMsg = 'Registration failed: ' + err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div style="max-width: 400px; margin: 0 auto; padding: 2em;">
  <h2 style="text-align: center; margin-bottom: 2em; color: #1f2937;">Register for ML Club Blogs</h2>

  <form on:submit|preventDefault={handleRegister}>
    <div style="margin-bottom: 1.5em;">
      <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Full Name</label>
      <input
        type="text"
        bind:value={name}
        required
        placeholder="Enter your full name"
        style="width: 100%; padding: 0.75em; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1em;"
      />
    </div>

    <div style="margin-bottom: 1.5em;">
      <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Email</label>
      <input
        type="email"
        bind:value={email}
        required
        placeholder="Enter your email address"
        style="width: 100%; padding: 0.75em; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1em;"
      />
    </div>

    <div style="margin-bottom: 1.5em;">
      <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Password</label>
      <input
        type="password"
        bind:value={password}
        required
        placeholder="Enter your password (min 6 characters)"
        style="width: 100%; padding: 0.75em; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1em;"
      />
    </div>

    <div style="margin-bottom: 1.5em;">
      <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Confirm Password</label>
      <input
        type="password"
        bind:value={confirmPassword}
        required
        placeholder="Confirm your password"
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
      style="width: 100%; padding: 0.75em; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 1em; cursor: pointer; font-weight: 600;"
    >
      {loading ? 'Creating Account...' : 'Create Account'}
    </button>
  </form>

  <!-- Login Link -->
  <div style="text-align: center; margin-top: 2em;">
    <p style="margin: 0; color: #6b7280;">
      Already have an account? 
      <a href="/login" style="color: #2563eb; text-decoration: none; font-weight: 600;">
        Login here
      </a>
    </p>
  </div>
</div> 