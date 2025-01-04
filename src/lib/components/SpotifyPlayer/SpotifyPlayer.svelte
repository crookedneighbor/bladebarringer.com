<script lang="ts">
	import { slide } from 'svelte/transition';
	import { player } from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
	import SpotifyLink from './SpotifyLink.svelte';
	import type { Playlist, Track } from './types';
	import TrackList from './TrackList.svelte';
	import TrackListToggleButton from './TrackListToggleButton.svelte';
	import SpotifyControls from './SpotifyControls.svelte';
	import SongProgress from './SongProgress.svelte';
	import CurrentTrack from './CurrentTrack.svelte';
	import Art from './Art.svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import SpotifySettings from './SpotifySettings.svelte';

	interface Props {
		tracks: Track[];
		currentTrack?: Track;
		playlist: Playlist;
		onTrackChange: (newTrackID: string) => void;
	}
	let { tracks, playlist, currentTrack, onTrackChange }: Props = $props();
	const isDesktop = new MediaQuery('min-width: 1024px');

	let trackListOpen = $state(isDesktop.current);

	if (currentTrack) {
		player.load(currentTrack.id);
	}

	player.onSongCompleted(() => {
		if (player.autoplay) {
			loadSong(nextTrackID);
		}
	});

	function loadSong(id: string) {
		player.load(id);
		onTrackChange(id);

		if (player.autoplay) {
			player.play();
		}
	}

	let previousTrackID = $derived.by(() => {
		if (!currentTrack) {
			return '';
		}
		// -1 to get the correct index in array for current track
		// and another -1 to get the previous track
		const prevTrack = tracks[currentTrack.number - 2];
		return prevTrack?.id ?? '';
	});
	let nextTrackID = $derived.by(() => {
		if (!currentTrack) {
			return '';
		}
		// -1 to get the correct index in array for current track
		// and then +1 to get the next track, resulting in using
		// the number to get the index
		const nextTrack = tracks[currentTrack.number];
		return nextTrack?.id ?? '';
	});
</script>

<div class="bg-white rounded border overflow-hidden" style:view-transition-name="spotify-controls">
	<Art {playlist} />
	<SongProgress />
	<CurrentTrack {currentTrack} {playlist} />

	<div class="flex items-center justify-center pb-8">
		<SpotifyLink link={playlist.permalink} />

		<SpotifyControls
			currentTrackID={currentTrack?.id}
			firstTrackID={tracks[0].id}
			{previousTrackID}
			{nextTrackID}
			{onTrackChange}
		/>

		<TrackListToggleButton
			{trackListOpen}
			onclick={() => {
				trackListOpen = !trackListOpen;
			}}
		/>
	</div>

	<SpotifySettings />
</div>

{#if trackListOpen}
	<div transition:slide data-testid="before-tracks">
		<TrackList {tracks} {currentTrack} onTrackChoice={loadSong} />
	</div>
{/if}
