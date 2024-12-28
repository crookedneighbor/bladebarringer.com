<script lang="ts">
	import Lyrics from '$lib/components/Lyrics/Lyrics.svelte';

	let { data } = $props();
	let { id, lines, img, artist, number, name, bandcampPath } = $derived(data.track);
</script>

<div class="song-container" style={'view-transition-name: ' + id}>
	<div class="cover" style={`background-image: url(${img}); view-transition-name: ${id}-img`}></div>
	<div
		class="info prose prose-quoteless prose-blockquote:not-italic prose-blockquote:whitespace-pre-wrap prose-blockquote:text-2xl"
	>
		<h1>{number}. {name}</h1>
		<div class="artist">{artist}</div>
		{#if bandcampPath}
			<div class="buy-on-bandcamp"><a href={bandcampPath} target="_blank">Buy on Bandcamp</a></div>
		{/if}
		{@render data.pageBlurb()}

		{#if lines.length > 0}
			<Lyrics {lines} {id} />
		{:else}
			<blockquote>(No lyrics available for this song)</blockquote>
		{/if}
	</div>
</div>

<style lang="postcss">
	.song-container {
		@apply m-0 w-full p-0;
	}
	.cover {
		@apply hidden w-full h-96 bg-cover bg-center sm:block;
	}

	.info {
		@apply max-w-full bg-white w-full p-4;
	}

	.artist {
		@apply border-b -mt-6 pb-2 text-2xl;
	}

	.buy-on-bandcamp {
		@apply py-2 border-b;
	}
</style>
