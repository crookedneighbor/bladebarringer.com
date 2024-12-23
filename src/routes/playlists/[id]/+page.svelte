<script lang="ts">
	import { createHoverProps, hovered } from './hovered-state.svelte.js';

	let { data } = $props();
	let playlist = $derived(data.playlist);
</script>

{#each playlist as track}
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

<style lang="postcss">
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
