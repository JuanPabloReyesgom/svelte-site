<script lang="ts" context="module">
  import { dev } from '$app/env'
  import type { ErrorLoad } from '@sveltejs/kit'

  export const load: ErrorLoad = ({ error, status }) => ({
    props: { error, status },
  })
</script>

<script lang="ts">
  export let status: number
  export let error: Error
</script>

<svelte:head>
  <title>Fehler {status} - Studenten bilden Schüler e.V.</title>
</svelte:head>

<div>
  <h1>Fehler {status}</h1>

  {#if status === 404}
    <p>
      😅 Ooops! Diese Seite konnte nicht gefunden. Hier geht's zurück zur
      <a sveltekit:prefetch href="/">Startseite</a>. 🤦
    </p>
  {/if}

  {#if dev && error?.stack}
    <h2>Stack Trace</h2>
    <pre>{error.stack}</pre>
  {/if}
</div>

<style>
  div {
    max-width: 45em;
    padding: 1em 3em;
    margin: auto;
  }
  p {
    text-align: center;
  }
  pre {
    overflow: scroll;
    font-size: 0.9em;
    white-space: pre-wrap;
    background: var(--accentBg);
    padding: 5pt 1em;
    border-radius: 3pt;
  }
</style>
