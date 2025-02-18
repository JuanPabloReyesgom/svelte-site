<script lang="ts">
  import { beforeNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import { slide } from 'svelte/transition'
  import ChevronExpand from '~icons/bi/chevron-expand'
  import HandsHelping from '~icons/fa-solid/hands-helping'
  import Rss from '~icons/fa-solid/rss-square'
  import Menu from '~icons/heroicons-solid/menu'
  import Place from '~icons/ic/place'
  import AlternateEmail from '~icons/ic/round-alternate-email'
  import QuestionAnswer from '~icons/ic/round-question-answer'
  import PeopleCircle from '~icons/ion/people-circle'
  import Plant from '~icons/ri/plant-fill'
  import type { NavLink } from '../types'

  export let nav: NavLink[]
  export let mobile: boolean

  const icons = {
    'Über Uns': Plant,
    Standorte: Place,
    FAQ: QuestionAnswer,
    Mitmachen: PeopleCircle,
    Blog: Rss,
    Kontakt: AlternateEmail,
    Internes: HandsHelping,
  }

  let isOpen = false
  let activeSubNav = -1
  let node: HTMLElement
  const close = () => {
    isOpen = false
    activeSubNav = -1
  }

  const setActiveSubNav = (idx: number) => () => {
    // if activeSubNav already is idx, we want to close the subnav to get toggle behavior on mobile
    if (activeSubNav === idx) activeSubNav = -1
    else activeSubNav = idx
  }

  // isCurrent needs to be reactive to respond to changes in $page.url.pathname
  $: isCurrent = (url: string) => {
    if (url === $page.url.pathname) return `page`
    if (url !== `/` && $page.url.pathname.includes(url)) return `page`
    return undefined
  }
  beforeNavigate(close)

  const crawl_links = nav.flatMap((itm) => itm?.subNav ?? [])
</script>

<svelte:window
  on:click={(event) => {
    if (!node.contains(event.target)) close()
  }}
/>

{#each crawl_links as { title, url }}
  <a
    href={url}
    style="position: absolute; visibility: hidden;"
    aria-hidden="true"
    tabindex="-1">{title}</a
  >
{/each}

{#if mobile}
  <button
    on:click|preventDefault|stopPropagation={() => (isOpen = true)}
    aria-label="Navigationsmenü öffnen"
    style="grid-area: nav;"
  >
    <Menu />
  </button>
{/if}

<a
  on:click={close}
  class="logo"
  href="/"
  sveltekit:prefetch
  aria-current={isCurrent(`/`)}
>
  <img src="/favicon.svg" alt="SbS Logo" height="50" width="50" />
</a>

<nav class:isOpen class={mobile ? `mobile` : `desktop`} bind:this={node}>
  <ul>
    {#each nav as { title, url, subNav }, idx}
      <li
        on:mouseenter={mobile ? null : setActiveSubNav(idx)}
        on:mouseleave={mobile ? null : setActiveSubNav(-1)}
      >
        <span>
          <a
            on:click={close}
            sveltekit:prefetch
            aria-current={isCurrent(url)}
            href={url}
            style="display: flex; align-items: center;"
          >
            <svelte:component this={icons[title]} style="margin: 0 10pt 0 0;" />
            {title}
          </a>
          {#if subNav}
            <button
              on:click={setActiveSubNav(idx, false)}
              aria-label="Untermenü {title} öffnen"
            >
              <ChevronExpand height="20pt" />
            </button>
          {/if}
        </span>
        {#if subNav && activeSubNav === idx}
          <!-- TODO: use media query to check if user prefers reduced motion and toggle (not slide) if so -->
          <ul
            transition:slide
            style="grid-template-columns: repeat({Math.min(
              Math.ceil(subNav.length / 10),
              4
            )}, 1fr);"
          >
            {#each subNav as { title, url, spanCols, lightFont }}
              <li class:spanCols class:lightFont>
                <a
                  on:click={close}
                  sveltekit:prefetch
                  aria-current={isCurrent(url)}
                  href={url}
                  >{title}
                </a>
              </li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ul>
</nav>

<style>
  button {
    display: flex;
  }
  a,
  button {
    color: var(--headerColor);
    border-radius: 5pt;
    padding: 0 3pt;
  }
  a:hover {
    color: var(--hoverColor);
  }
  a[aria-current] {
    color: var(--orange);
  }
  a.logo {
    grid-area: logo;
    border-radius: 50%;
    margin: 2pt;
    display: flex;
  }
  ul {
    list-style: none;
  }
  li::marker {
    color: var(--headerColor);
  }
  nav {
    overflow: auto;
  }
  nav > ul > li > span {
    display: flex;
    place-items: center;
  }
  nav > ul > li > span > a {
    display: contents;
  }
  nav > ul > li > span > button {
    margin-left: 3pt;
    padding: 1pt;
    color: var(--green);
  }
  nav > ul > li > span > button:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  nav > ul > li > ul > li.lightFont {
    font-weight: lighter;
    opacity: 0.6;
  }
  /* mobile styles */
  nav.mobile {
    position: fixed;
    top: 1em;
    left: 1em;
    padding: 1em;
    transition: 0.4s;
    max-height: calc(100vh - 2em);
    background: var(--headerBg);
    transform: translate(-120%);
    box-sizing: border-box;
    overscroll-behavior: none;
  }
  nav.mobile.isOpen {
    box-shadow: 0 0 1em black;
    transform: translate(0);
  }
  nav.mobile > ul {
    display: grid;
    grid-gap: 1em;
    padding: 0;
    margin: 0;
  }
  nav.mobile > ul > li > ul {
    margin-top: 1ex;
    list-style: disc;
    padding-left: 2ex;
  }
  /* desktop styles */
  nav.desktop,
  nav.desktop > ul {
    display: contents;
  }
  nav.desktop > ul > li {
    position: relative;
  }
  nav.desktop > ul > li > ul {
    position: absolute;
    background: var(--headerBg);
    padding: 1ex 1em;
    border-radius: 1ex;
    box-shadow: 0 0 1em black;
    top: 3ex;
    display: grid;
    gap: 5pt 1em;
    max-height: 80vh;
    overflow-y: auto;
    overscroll-behavior: none;
  }
  nav.desktop > ul > li > ul > li.spanCols {
    grid-column: 1/-1;
    border-top: 1px solid var(--headerColor);
    padding-top: 6pt;
    margin-top: 6pt;
  }
  nav.desktop button:first-child {
    display: none;
  }
</style>
