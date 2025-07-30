<script lang="ts">
  import { onMount } from 'svelte';
  // import { supabase } from '$lib/supabaseClient';
  
  let currentUser = null;
  let isLoggedIn = false;
  let isAdmin = false;

  function checkAuthStatus() {
    try {
      // Check if user is logged in
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        currentUser = JSON.parse(userData);
        isLoggedIn = true;
        isAdmin = currentUser.role === 'admin';
      } else {
        currentUser = null;
        isLoggedIn = false;
        isAdmin = false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      currentUser = null;
      isLoggedIn = false;
      isAdmin = false;
    }
  }

  onMount(() => {
    checkAuthStatus();
  });

              function handleLogout() {
                try {
                  localStorage.removeItem('currentUser');
                  window.location.href = '/';
                } catch (error) {
                  console.error('Logout error:', error);
                  window.location.href = '/';
                }
              }
</script>

<header style="background: #000000; color: #fff; padding: 1.5em 2em; border-bottom: 3px solid #ff6b35;">
  <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;">
    <!-- Logo and Branding -->
    <div style="display: flex; align-items: center; gap: 1.5rem;">
      <img src="/ml club logo.png" alt="ML Club Logo" style="height: 60px; width: auto;" />
      <div style="display: flex; flex-direction: column; gap: 0.2rem;">
        <h1 style="margin: 0; font-size: 1.8em; font-weight: 800; color: #ff6b35; line-height: 1.2;">Machine Learning Club Blogs</h1>
        <p style="margin: 0; font-size: 1.1em; font-weight: 600; color: #ffffff; line-height: 1.2;">NIT Silchar</p>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav style="display: flex; align-items: center; gap: 1rem;">
      <a href="/" style="color: #fff; padding: 0.6em 1.2em; border-radius: 8px; transition: all 0.3s ease; font-weight: 500; text-decoration: none; border: 1px solid transparent;">Home</a>
      {#if isLoggedIn}
        <a href="/blog/create" style="color: #fff; padding: 0.6em 1.2em; border-radius: 8px; transition: all 0.3s ease; font-weight: 500; text-decoration: none; border: 1px solid transparent;">Create</a>
        <a href="/dashboard/blogs" style="color: #fff; padding: 0.6em 1.2em; border-radius: 8px; transition: all 0.3s ease; font-weight: 500; text-decoration: none; border: 1px solid transparent;">My Blogs</a>
        {#if isAdmin}
          <a href="/admin" style="color: #fff; padding: 0.6em 1.2em; border-radius: 8px; transition: all 0.3s ease; font-weight: 500; text-decoration: none; border: 1px solid transparent;">Admin</a>
        {/if}
        <button 
          on:click={handleLogout}
          style="background: linear-gradient(135deg, #dc2626, #b91c1c); border: none; color: #fff; cursor: pointer; padding: 0.6em 1.2em; border-radius: 8px; font-weight: 500; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);"
        >
          Logout
        </button>
      {:else}
        <a href="/login" style="color: #fff; padding: 0.6em 1.2em; border-radius: 8px; transition: all 0.3s ease; font-weight: 500; text-decoration: none; border: 1px solid transparent;">Login</a>
        <a href="/register" style="color: #fff; padding: 0.6em 1.2em; border-radius: 8px; transition: all 0.3s ease; font-weight: 500; text-decoration: none; border: 1px solid transparent;">Register</a>
      {/if}
    </nav>
  </div>
  
  <!-- User Welcome Message -->
  {#if isLoggedIn && currentUser}
    <div style="text-align: center; margin-top: 1em; font-size: 1em; color: #e5e5e5; font-weight: 500;">
      Welcome, <span style="color: #ff6b35; font-weight: 600;">{currentUser.name}</span> 
      <span style="background: #404040; padding: 0.2em 0.6em; border-radius: 4px; margin-left: 0.5em; font-size: 0.85em;">{currentUser.role}</span>
    </div>
  {/if}
</header>

<div class="container">
  <slot />
</div>

<style>
  nav a:hover {
    background: rgba(255, 107, 53, 0.15);
    border-color: #ff6b35;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
  }
  
  @media (max-width: 768px) {
    header {
      padding: 1em;
    }
    
    .logo-container {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }
    
    .logo {
      height: 40px;
    }
    
    .logo-title {
      font-size: 1.4em;
    }
    
    .logo-subtitle {
      font-size: 1em;
    }
    
    nav {
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }
  }
</style>
