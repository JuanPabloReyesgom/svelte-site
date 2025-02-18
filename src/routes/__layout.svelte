<script lang="ts" context="module">
  import { afterNavigate } from '$app/navigation'
  import type { Load } from '@sveltejs/kit'
  import Footer from '../components/Footer.svelte'
  import Header from '../components/Header.svelte'
  import type { Chapter, Link, NavLink } from '../types'
  import { fetchChapters, fetchYaml } from '../fetch'
  import '../app.css'

  export const load: Load = async () => {
    const nav = await fetchYaml(`Nav`)
    const footer = await fetchYaml(`Footer`)
    const social = await fetchYaml(`Social`)
    const chapters = await fetchChapters()

    // ensure the non-chapter link spans all chapter subnav columns
    nav.find((el: NavLink) => el.url === `/standorte`).subNav[0].spanCols = true

    // create { title, url } array containing all chapters
    const chapterLinks = chapters.map((chapter: Chapter) => {
      const { title, slug, acceptsSignups } = chapter
      return { title, url: slug, lightFont: !acceptsSignups }
    })

    // prepend chapter links into chapter subnav
    nav.find((el: NavLink) => el.url === `/standorte`).subNav.unshift(...chapterLinks)

    return { props: { nav, footer, social } }
  }
</script>

<script lang="ts">
  export let nav: NavLink[]
  export let footer: { links: Link[] }
  export let social: Record<string, string>

  afterNavigate(() => {
    // Track user navigation across the site. This data is transferred to Airtable
    // by the signup form or destroyed when they leave the site.
    if (!window.visitedPages) window.visitedPages = [document.referrer]
    window.visitedPages.push(location.pathname + location.search)
  })
</script>

<Header {nav} />
<main>
  <slot />
</main>
<Footer links={footer.links} {social} />
