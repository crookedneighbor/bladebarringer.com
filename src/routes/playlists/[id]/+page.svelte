<script lang="ts">
	let { data } = $props();
	let playlist = $derived(data.playlist);

	let hovered = $state('');

	function createHoverProps(id: string) {
		function set() {
			hovered = id;
		}
		function reset() {
			// in case the hovered state has already changed
			// we don't want to accidentally overwrite the new
			// hovered state to nothing
			if (hovered === id) {
				hovered = '';
			}
		}
		return {
			onmouseenter: set,
			onfocus: set,
			onmouseleave: reset,
			onblur: reset
		};
	}
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
						onfocus={() => {
							hovered = card.id;
						}}
						onblur={() => {
							if (hovered === card.id) {
								hovered = '';
							}
						}}
						class:hovered={hovered === card.id}
						href={`/playlists/2024/${card.id}`}
						data-sveltekit-reload>{i + 1}. {card.name}</a
					>
				</li>
			{/each}
		</ul>
	</div>

	<div class="album-arts right">
		{#each playlist as card}
			<div class="card" style={'view-transition-name: ' + card.id}>
				<a
					data-sveltekit-reload
					href={`/playlists/2024/${card.id}`}
					{...createHoverProps(card.id)}
					class:hovered={hovered === card.id}
				>
					<img src={card.img} alt="" style={'view-transition-name: ' + card.id + '-img'} />
				</a>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.container {
		@apply flex;
	}
	.left {
		@apply h-screen w-1/3 overflow-scroll p-8;
	}
	.right {
		@apply h-screen w-2/3 overflow-scroll;
	}
	.card {
		@apply w-1/5 p-2;
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

	img {
		transition: all 0.1s ease-in;
	}
	.hovered img,
	a:hover img,
	a:focus img {
		scale: 1.15;
	}
</style>
