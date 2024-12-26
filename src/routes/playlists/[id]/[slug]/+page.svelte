<script lang="ts">
	let { data } = $props();
	let { id, img, artist, number, name, bandcampPath } = $derived(data.track);
</script>

<div class="song-container" style={'view-transition-name: ' + id}>
	<div class="cover" style={`background-image: url(${img}); view-transition-name: ${id}-img`}></div>
	<div class="info">
		<h1>{number}. {name}</h1>
		<p class="artist">{artist}</p>
		{#if bandcampPath}
			<p><a href={bandcampPath} target="_blank">Buy on Bandcamp</a></p>
		{/if}
		<hr />
		<!-- pulled from playlist-data/page-blurbs -->
		{@render data.pageBlurb()}
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
	h1 {
		@apply scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl;
	}
	.artist {
		@apply mt-2 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0;
	}

	ul {
		@apply list-disc;
	}
</style>
