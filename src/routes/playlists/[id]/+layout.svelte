<script lang="ts">
	import { goto, onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import HeadlessSpotifyController, {
		player
	} from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
	import SpotifyPlayer from '$lib/components/SpotifyPlayer/SpotifyPlayer.svelte';

	let { data, children } = $props();
	let { tracks, name, spotifyPlaylistLink, playlistArt } = $derived(data);

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
		player.load(track?.spotifyID ?? tracks[0].spotifyID);

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

		@apply lg:min-h-screen lg:w-1/3 lg:overflow-scroll py-2 lg:py-8 px-8;
	}
	.right {
		&::-webkit-scrollbar {
			display: none;
		}
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
		@apply lg:min-h-screen lg:w-2/3 lg:overflow-scroll max-w-3xl mx-auto;
	}
</style>
