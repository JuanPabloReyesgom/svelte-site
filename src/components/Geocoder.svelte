<script lang="ts">
  // This component uses the Mapbox JS API to turn user text input into a
  // formatted address and lat/lng coordinates.
  import MapboxGeocoder, { Result } from '@mapbox/mapbox-gl-geocoder'
  import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import { onMount } from 'svelte'

  // required yarn add -D events @types/events
  // https://github.com/mapbox/mapbox-gl-geocoder/issues/441

  export let selectHandler: (result: Result) => void
  export let placeholder = ``
  export let required = false
  export let id: string | null = null
  export let div: HTMLDivElement

  const mapboxKey = import.meta.env.VITE_MAPBOX_PUBLIC_KEY as string

  function ignoreUpDownArrows(event: KeyboardEvent) {
    // don't move text cursor when user presses up/down arrows to choose from auto-completions
    if ([`ArrowDown`, `ArrowUp`].includes(event.key)) {
      event.preventDefault()
    }
  }

  onMount(() => {
    mapboxgl.accessToken = mapboxKey

    let geocoder = new MapboxGeocoder({
      accessToken: mapboxKey,
      countries: `de`,
      language: `de-DE`,
      types: `address,locality,neighborhood,poi`,
    })

    geocoder.addTo(div)

    geocoder.on(`result`, (event: { result: Result }) => {
      geocoder.clear()
      selectHandler(event.result)
    })
  })
</script>

<!-- has to be <div/>, <input/> won't work -->
<div {id} {placeholder} {required} bind:this={div} on:keydown={ignoreUpDownArrows} />

<style>
  :global(.mapboxgl-ctrl-geocoder.mapboxgl-ctrl) {
    width: 100%;
    max-width: none;
    background: var(--accentBg);
    margin: 1em 0;
  }
  :global(.mapboxgl-ctrl-geocoder.mapboxgl-ctrl input) {
    color: var(--textColor) !important;
  }
</style>
