<script lang="ts">
	import { createHoverProps, hovered } from '$lib/hovered-state.svelte.js';

	let { data } = $props();
	let { tracks } = $derived(data);
</script>

<div class="album-arts">
	{#each tracks as track}
		<div class="track" style={'view-transition-name: ' + track.id}>
			<a
				href={`/playlists/2024/${track.id}`}
				{...createHoverProps(track.id)}
				class:hovered={hovered.name === track.id}
			>
				<img src={track.img} alt="" style={'view-transition-name: ' + track.id + '-img'} />
			</a>
		</div>
	{/each}
</div>

<style lang="postcss">
	.album-arts {
		@apply flex flex-wrap justify-center;
	}
	.track {
		@apply w-1/2 lg:w-1/5 p-2;
	}

	img {
		transition: all 0.1s ease-in;
	}
	.hovered img,
	a:hover img,
	a:focus img {
		scale: 1.15;
	}
</style>
