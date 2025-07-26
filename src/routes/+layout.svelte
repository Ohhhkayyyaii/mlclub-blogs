<script lang="ts">
  import { onMount } from 'svelte';
  
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

<header style="background:#2563eb; color:#fff; padding:1em 0; text-align:center;">
  <h1 style="margin:0;">ML Club Blogs</h1>
  
  {#if isLoggedIn && currentUser}
    <div style="margin-bottom: 0.5em; font-size: 0.9em;">
      Welcome, {currentUser.name} ({currentUser.role})
    </div>
  {/if}
  
  <nav>
    <a href="/" style="color:#fff; margin:0 1em;">Home</a>
    {#if isLoggedIn}
      <a href="/blog/create" style="color:#fff; margin:0 1em;">Create</a>
      <a href="/dashboard/blogs" style="color:#fff; margin:0 1em;">My Blogs</a>
      {#if isAdmin}
        <a href="/admin" style="color:#fff; margin:0 1em;">Admin</a>
      {/if}
      <button 
        on:click={handleLogout}
        style="background: none; border: none; color: #fff; margin: 0 1em; cursor: pointer; text-decoration: underline; font-size: inherit;"
      >
        Logout
      </button>
    {:else}
      <a href="/login" style="color:#fff; margin:0 1em;">Login</a>
      <a href="/register" style="color:#fff; margin:0 1em;">Register</a>
    {/if}
  </nav>
</header>

<div class="container">
  <slot />
</div>
