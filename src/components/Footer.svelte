<script lang="ts">
  import Cookie from '~icons/bxs/cookie'
  import Euro from '~icons/ic/round-euro'
  import PrivacyTip from '~icons/ic/round-privacy-tip'
  import DocumentText from '~icons/ion/document-text'
  import Law from '~icons/octicon/law'
  import OpenSource from '~icons/ri/open-source-fill'
  import type { Link } from '../types'
  import Social from './Social.svelte'

  const icons = {
    Impressum: Law,
    Datenschutz: PrivacyTip,
    Spenden: Euro,
    Satzung: DocumentText,
  }

  export let links: Link[]
  export let social: Record<keyof typeof icons, string>
</script>

<footer>
  <img src="/favicon.svg" alt="SbS Logo" height="60" />
  <span>© {new Date().getFullYear()} Studenten bilden Schüler e.V.</span>
  <div>
    {#each links as { title, url }}
      <a sveltekit:prefetch href={url}>
        <svelte:component
          this={icons[title]}
          style="vertical-align: middle; padding-right: 3pt;"
        />
        {title}
      </a>
    {/each}
  </div>
  <span>
    Diese Seite ist
    <a href="https://github.com/sbsev/svelte-site">
      <OpenSource style="vertical-align: bottom; padding-right: 3pt;" />open source
    </a>
    und verwendet
    <a href="https://de.wikipedia.org/wiki/HTTP-Cookie">
      keine
      <Cookie style="vertical-align: middle;" />
      Cookies.
    </a>
  </span>
  <Social {social} style="margin-top: 1ex;" />
</footer>

<style>
  footer {
    padding: 3em calc(1em + 3vw);
    text-align: center;
    display: grid;
    gap: 3em;
    place-items: center;
    background: var(--footerBg);
    color: white;
  }
  footer :global(a) {
    color: var(--lightBlue);
  }
  footer :global(a:hover) {
    color: var(--green);
  }
  footer div {
    margin: auto;
    display: flex;
    gap: 2em;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
