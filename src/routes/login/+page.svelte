<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
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
      // Simple authentication for demo purposes
      // In a real app, this would validate against a database
      
      if (loginType === 'admin') {
        // Admin login credentials
        if (email === 'admin@mlclub.com' && password === 'admin123') {
          const adminUser = {
            id: 'admin-1',
            email: email,
            name: 'Admin User',
            role: 'admin',
            loggedInAt: new Date().toISOString()
          };
          
          localStorage.setItem('currentUser', JSON.stringify(adminUser));
          successMsg = 'Admin login successful! Redirecting to admin dashboard...';
          
          setTimeout(() => {
            window.location.href = '/admin';
          }, 1000);
        } else {
          errorMsg = 'Invalid admin credentials. Use admin@mlclub.com / admin123';
        }
      } else {
        // Regular user login
        if (email === 'user@mlclub.com' && password === 'user123') {
          const regularUser = {
            id: 'user-1',
            email: email,
            name: 'Regular User',
            role: 'user',
            loggedInAt: new Date().toISOString()
          };
          
          localStorage.setItem('currentUser', JSON.stringify(regularUser));
          successMsg = 'Login successful! Redirecting to your blogs...';
          
          setTimeout(() => {
            window.location.href = '/dashboard/blogs';
          }, 1500);
        } else {
          errorMsg = 'Invalid user credentials. Use user@mlclub.com / user123';
        }
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
        placeholder={loginType === 'admin' ? 'admin@mlclub.com' : 'user@mlclub.com'}
        style="width: 100%; padding: 0.75em; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1em;"
      />
    </div>

    <div style="margin-bottom: 1.5em;">
      <label style="display: block; margin-bottom: 0.5em; font-weight: 600;">Password</label>
      <input
        type="password"
        bind:value={password}
        required
        placeholder={loginType === 'admin' ? 'admin123' : 'user123'}
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

  <!-- Demo Credentials -->
  <div style="margin-top: 2em; padding: 1em; background: #f3f4f6; border-radius: 6px; font-size: 0.9em;">
    <h4 style="margin: 0 0 0.5em 0; color: #374151;">Demo Credentials:</h4>
    <div style="margin-bottom: 0.5em;">
      <strong>Regular User:</strong> user@mlclub.com / user123
    </div>
    <div>
      <strong>Admin:</strong> admin@mlclub.com / admin123
    </div>
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