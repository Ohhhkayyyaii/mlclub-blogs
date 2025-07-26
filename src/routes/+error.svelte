<script lang="ts">
  import { page } from '$app/stores';
  $: status = $page.status;
  $: message = $page.error?.message || 'An unknown error occurred.';
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 text-white">
  <div class="text-center">
    <div class="text-7xl font-extrabold mb-4 drop-shadow-lg animate-pulse">{status}</div>
    <div class="text-4xl font-bold mb-2 tracking-widest">DEFEAT</div>
    <div class="text-xl mb-8 italic opacity-80">{message}</div>
    <a href="/blogs" class="inline-block bg-blue-600 hover:bg-blue-800 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-200 border-4 border-blue-400 animate-bounce">
      Return to Nexus
    </a>
    <div class="mt-8 text-sm opacity-60">You've Been Ganked. Try again, Summoner.</div>
  </div>
</div> 