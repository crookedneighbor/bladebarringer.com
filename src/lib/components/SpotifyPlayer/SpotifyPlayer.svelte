<script lang="ts">
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	import { player } from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
	import SpotifyLink from './SpotifyLink.svelte';
	import type { Track } from './types';
	import TrackList from './TrackList.svelte';
	import TrackListToggleButton from './TrackListToggleButton.svelte';
	import SpotifyControls from './SpotifyControls.svelte';
	import SongProgress from './SongProgress.svelte';
	import CurrentTrack from './CurrentTrack.svelte';

	interface Props {
		tracks: Track[];
		currentTrack?: Track;
		spotifyPlaylistLink: string;
		playlistArt: string;
		onTrackChange: (newTrackID: string) => void;
	}
	let { tracks, spotifyPlaylistLink, playlistArt, currentTrack, onTrackChange }: Props = $props();

	let trackListOpen = $state(true);

	let tracksBeforeCurrentTrack = $derived.by(() => {
		let include = true;

		return tracks.filter((t) => {
			if (t.id === currentTrack?.id) {
				include = false;
			}
			return include;
		});
	});

	let tracksAfterCurrentTrack = $derived.by(() => {
		let include = false;

		return tracks.filter((t) => {
			if (t.id === currentTrack?.id) {
				include = true;
				return false;
			}
			return include;
		});
	});

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

	let previousTrackID = $derived(tracksBeforeCurrentTrack.at(-1)?.id ?? tracks[0].id);
	let nextTrackID = $derived(tracksAfterCurrentTrack.at(0)?.id ?? tracks[0].id);
</script>

<div class="bg-white rounded border overflow-hidden" style:view-transition-name="spotify-controls">
	<SongProgress art={playlistArt} />

	<CurrentTrack {currentTrack} />

	<div class="flex items-center justify-center pb-8">
		<SpotifyLink {spotifyPlaylistLink} />

		<SpotifyControls
			currentTrackID={currentTrack?.id}
			{previousTrackID}
			{nextTrackID}
			prevDisabled={!page.data.track}
			{onTrackChange}
		/>

		<TrackListToggleButton
			{trackListOpen}
			onclick={() => {
				trackListOpen = !trackListOpen;
			}}
		/>
	</div>
</div>

<!-- TODO handle mobile track listing -->
{#if trackListOpen}
	<div transition:slide data-testid="before-tracks">
		<TrackList {tracks} {currentTrack} onTrackChoice={loadSong} />
	</div>
{/if}
