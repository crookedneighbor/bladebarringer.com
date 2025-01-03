<script lang="ts">
	import { goto, onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import HeadlessSpotifyController from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
	import SpotifyPlayer from '$lib/components/SpotifyPlayer/SpotifyPlayer.svelte';

	let { data, children } = $props();
	let { tracks, name, description, spotifyPlaylistLink, playlistArt } = $derived(data);

	let playerTracks = $derived(
		tracks.map((t) => ({
			id: t.spotifyID,
			slug: t.id,
			name: t.name,
			number: t.number,
			artist: t.artist,
			art: t.img,
			permalink: t.permalink
		}))
	);

	let currentTrack = $derived(playerTracks.find((t) => t.id === page.data.spotifyPlayerID));

	function onTrackChange(newTrackID: string) {
		const track = tracks.find((t) => t.spotifyID === newTrackID);
		const path = track?.permalink || `/playlists/${page.data.playlistSlug}`;
		goto(path, {
			keepFocus: true
		});
	}

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
		<!-- TODO add blurb about logging into Spotify -->
		<SpotifyPlayer
			{onTrackChange}
			playlist={{
				name,
				permalink: spotifyPlaylistLink,
				art: playlistArt
			}}
			tracks={playerTracks}
			{currentTrack}
		/>
	</div>

	<div class="right">
		{@render children()}
	</div>
</div>

<div class="absolute -left-96 -bottom-96">
	<HeadlessSpotifyController />
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
		@apply lg:h-full lg:w-2/3 lg:overflow-scroll;
	}

	/* 
	TODO add hovered props
	a.hovered,
	a:focus,
	a:hover {
		@apply text-amber-700;
	} */
</style>
