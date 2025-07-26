<script lang="ts">
  export let message: string;
  export let type: 'success' | 'error' = 'success';
  let visible = true;
</script>

{#if visible}
  <div
    class="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 min-w-[250px] max-w-xs flex items-center px-4 py-3 rounded shadow-lg transition-all duration-300"
    class:bg-green-500={type === 'success'}
    class:bg-red-600={type === 'error'}
    class:text-white
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 200 }}
    role="alert"
  >
    <span class="font-bold mr-2">
      {type === 'success' ? 'Victory!' : 'Enemy Missing!'}
    </span>
    <span class="flex-1">{message}</span>
    <button
      class="ml-4 text-white text-lg font-bold focus:outline-none hover:opacity-70"
      on:click={() => (visible = false)}
      aria-label="Dismiss"
      tabindex="0"
    >
      &times;
    </button>
  </div>
{/if}

<style>
  :global(.fade-enter-active), :global(.fade-leave-active) {
    transition: opacity 0.2s;
  }
  :global(.fade-enter), :global(.fade-leave-to) {
    opacity: 0;
  }
</style> 