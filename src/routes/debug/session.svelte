<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { writable } from 'svelte/store';

  const session = writable<any>(null);
  const user = writable<any>(null);

  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    session.set(data.session);
    user.set(data.session?.user || null);
  });
</script>

<h1 class="text-2xl font-bold mb-4">Debug: Supabase Session</h1>

<h2 class="font-semibold mt-4">Session</h2>
<pre>{JSON.stringify($session, null, 2)}</pre>

<h2 class="font-semibold mt-4">User</h2>
<pre>{JSON.stringify($user, null, 2)}</pre> 