<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { createHoverProps, hovered } from './hovered-state.svelte.js';

	let { data, children } = $props();
	let playlist = $derived(data.playlist);

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div class="container">
	<div class="left">
		<h1>2024 Playlist</h1>
		<p>Premable</p>

		<div class="player">
			<iframe
				style="border-radius:12px"
				src="https://open.spotify.com/embed/playlist/0zRFBHvgpkp0OpCS22UwvS?utm_source=generator&theme=0"
				width="100%"
				height="152"
				frameBorder="0"
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
				loading="lazy"
				title="Embededed Playlist"
			></iframe>
		</div>
		<ul class="py-4">
			{#each playlist as card, i}
				<li>
					<a
						{...createHoverProps(card.id)}
						class:hovered={hovered.name === card.id}
						href={`/playlists/2024/${card.id}`}>{i + 1}. {card.name}</a
					>
				</li>
			{/each}
		</ul>
	</div>

	<div class="album-arts right">
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

	.album-arts {
		@apply flex flex-wrap justify-center;
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
