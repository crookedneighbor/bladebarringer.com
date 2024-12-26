<script lang="ts">
	let { data } = $props();
	let { playlists } = $derived(data);
</script>

<ul>
	{#each playlists as playlist}
		<li>
			<a href={`/playlists/${playlist.slug}`}><img src={playlist.image} alt={playlist.name} /></a>
		</li>
	{/each}
</ul>
