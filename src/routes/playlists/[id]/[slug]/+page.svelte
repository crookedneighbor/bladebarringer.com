<script lang="ts">
	let { data } = $props();
	let { id, img, artist, name } = $derived(data.track);
</script>

<div class="song-container" style={'view-transition-name: ' + id}>
	<div class="cover" style={`background-image: url(${img}); view-transition-name: ${id}-img`}></div>
	<div class="info">
		<h1>{name}</h1>
		<p class="artist">{artist}</p>
	</div>
</div>

<style lang="postcss">
	.song-container {
		@apply m-0 h-screen w-full p-0 md:flex;
	}
	.cover {
		@apply hidden w-1/2 max-w-full bg-cover bg-center sm:block;
	}
	.info {
		@apply max-w-full bg-white p-4 lg:w-1/2;
	}
	h1 {
		@apply scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl;
	}
	.artist {
		@apply mt-2 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0;
	}
</style>
