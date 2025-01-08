<script lang="ts">
	let { data } = $props();
	let { playlists } = $derived(data);
</script>

<div class="container m-auto py-4">
	<div class="px-4">
		<h1 class="text-8xl">Playlists</h1>
		<hr />
		<h2 class="text-4xl my-2">Year Playlists</h2>
	</div>
	<ul class="flex w-full">
		{#each playlists as playlist}
			<li class="w-1/3 p-4">
				<a href={`/playlists/${playlist.slug}`}
					><img
						class="w-full"
						src={playlist.image}
						alt={playlist.name}
						style:view-transition-name="Art"
					/></a
				>
			</li>
		{/each}
	</ul>
</div>
