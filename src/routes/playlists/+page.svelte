<script lang="ts">
	let { data } = $props();
	let { playlists } = $derived(data);
</script>

<div class="container m-auto py-4">
	<h1 class="text-8xl">Playlists</h1>
	<h2>Year Playlists</h2>
	<ul class="flex w-full">
		{#each playlists as playlist}
			<li class="w-full sm:w-1/3 p-4">
				<a href={playlist.permalink}
					><img
						class="w-full"
						src={playlist.image}
						alt={playlist.name}
						style:view-transition-name="Art-{playlist.slug}"
					/></a
				>
			</li>
		{/each}
	</ul>
</div>

<style lang="postcss">
	h1,
	h2 {
		@apply px-4;
	}

	h2 {
		@apply text-4xl my-2;
	}
</style>
