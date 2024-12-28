<script lang="ts">
	import { goto, onNavigate } from '$app/navigation';
	import SpotifyPlayer, { currentPlayer } from '$lib/components/SpotifyPlayer/SpotifyPlayer.svelte';
	import { createHoverProps, hovered } from './hovered-state.svelte.js';

	let { data, children } = $props();
	let { spotifyPlayerID, tracks } = $derived(data);
	let slotContainer: HTMLDivElement;

	function onPlayevent(duration: number) {
		const foundTrack = tracks.find((t) => t.duration === duration);
		if (foundTrack) {
			currentPlayer.songId = foundTrack.id;

			// TODO have option to opt out of this behavior
			goto(`/playlists/2024/${foundTrack.id}`);
		}
	}

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
	<div class="left prose">
		<SpotifyPlayer id={spotifyPlayerID} kind="playlist" {onPlayevent} />
		<ol class="marker:text-black">
			{#each tracks as card}
				<li>
					<a
						{...createHoverProps(card.id)}
						class:hovered={hovered.name === card.id}
						href={`/playlists/2024/${card.id}`}>{card.name}</a
					>
				</li>
			{/each}
		</ol>
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

	a.hovered,
	a:focus,
	a:hover {
		@apply text-amber-700;
	}
</style>
