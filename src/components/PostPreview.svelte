<script lang="ts">
  import Link from '~icons/bx/link'
  import GraduationCap from '~icons/fa-solid/graduation-cap'
  import Tags from '~icons/fa-solid/tags'
  import Email from '~icons/ic/email'
  import Calendar from '~icons/octicon/calendar'
  import type { Post } from '../types'
  import Img from './Img.svelte'
  import ToolTip from './ToolTip.svelte'

  export let post: Post

  const { title, slug, cover, date, author, tags, plainBody } = post

  const style = `padding-right: 4pt; vertical-align: -1pt; height: 12pt;`
  const authorImgStyle = `width: 4ex; height: 4ex; border-radius: 50%; vertical-align: -8pt; margin-right: 1ex;`
  const imgStyle = `border-radius: 1ex 1ex 0 0; height: 15em;`
</script>

<section>
  <a sveltekit:prefetch href={slug}>
    <Img sizes={[{ w: 400, h: 300 }]} {...cover} {imgStyle} /></a
  >
  <h3><a sveltekit:prefetch href={slug}>{title}</a></h3>
  <div>
    <ToolTip>
      <Img
        {...author.photo}
        alt={author.name}
        sizes={[{ w: 100, h: 100 }]}
        imgStyle={authorImgStyle}
      />
      {author.name}
      <address slot="tip">
        {#if author.url}
          <a href={author.url}><Link {style} />{author.url}</a>
          <br />
        {/if}
        {#if author.email}
          <a href="mailto:{author.email}"><Email {style} />{author.email}</a>
          <br />
        {/if}
        {#if author.fieldOfStudy}
          <GraduationCap {style} />{author.fieldOfStudy}
        {/if}
      </address>
    </ToolTip>
    <span><Calendar {style} />{new Date(date).toLocaleDateString(`de`)}</span>
    <span><Tags {style} />{tags.join(`, `)}</span>
  </div>
  <p>
    {plainBody.slice(0, 150) + `...`}
    [<a href={slug}>weiterlesen</a>]
  </p>
</section>

<style>
  section {
    background: var(--accentBg);
    border-radius: 1ex;
    display: grid;
    font-size: 0.9em;
  }
  section > *:not(:first-child) {
    margin: 1ex 2.5ex;
  }
  div {
    display: flex;
    flex-wrap: wrap;
    gap: 2ex;
    align-items: baseline;
  }
  address a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    width: 100%;
    vertical-align: bottom;
    font-style: normal;
  }
</style>
