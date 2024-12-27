<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import SpotifyPlayer from '$lib/components/SpotifyPlayer/SpotifyPlayer.svelte';
	import { createHoverProps, hovered } from './hovered-state.svelte.js';

	let { data, children } = $props();
	let { spotifyPlayerID, tracks } = $derived(data);
	let slotContainer: HTMLDivElement;

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
				slotContainer.scrollIntoView();
			});
		});
	});
</script>

<div class="container">
	<div class="left">
		<h1>2024 Playlist</h1>
		<p>Premable</p>

		<SpotifyPlayer id={spotifyPlayerID} />
		<ul class="py-4">
			{#each tracks as card}
				<li>
					<a
						{...createHoverProps(card.id)}
						class:hovered={hovered.name === card.id}
						href={`/playlists/2024/${card.id}`}>{card.number}. {card.name}</a
					>
				</li>
			{/each}
		</ul>
	</div>

	<div bind:this={slotContainer} class="right">
		{@render children()}
	</div>
</div>

<style lang="postcss">
	.container {
		@apply lg:flex m-auto;
	}
	.left {
		&::-webkit-scrollbar {
			display: none;
		}
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */

		@apply lg:h-screen lg:w-1/3 lg:overflow-scroll p-8;
	}
	.right {
		&::-webkit-scrollbar {
			display: none;
		}
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
		@apply lg:h-screen lg:w-2/3 lg:overflow-scroll;
	}
	.card {
		@apply w-1/2 lg:w-1/5 p-2;
	}

	h1 {
		@apply scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl;
	}
	a.hovered,
	a:focus,
	a:hover {
		@apply text-amber-700;
	}
</style>
