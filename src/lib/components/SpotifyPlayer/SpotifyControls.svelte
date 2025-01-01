<script lang="ts" module>
	export interface Props {
		previousTrackID: string;
		nextTrackID: string;
		prevDisabled: boolean;
		onTrackChange: (newID: string) => void;
	}
</script>

<script lang="ts">
	import { player } from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';

	let { previousTrackID, nextTrackID, prevDisabled, onTrackChange }: Props = $props();
	let playButtonText = $derived(player.playing ? 'Pause' : 'Play');
	function loadTrack(trackID: string) {
		player.load(trackID);
		onTrackChange(trackID);

		if (player.autoplay) {
			player.play();
		}
	}
</script>

<button
	disabled={prevDisabled}
	class="-mb-4"
	class:text-gray-400={prevDisabled}
	onclick={() => {
		if (player.position > 3000) {
			player.restart();
			return;
		}

		loadTrack(previousTrackID);
	}}
>
	<span class="sr-only">Previous track</span>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="size-8"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
		/>
	</svg>
</button>

<button
	class="-mb-6 bg-white rounded-full z-10"
	onclick={() => {
		player.autoplay = !player.playing;
		player.toggle();
	}}
>
	<span class="sr-only">{playButtonText}</span>
	{#if player.playing}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-16"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>
		</svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-16"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
			/>
		</svg>
	{/if}
</button>

<button
	class="-mb-4"
	onclick={() => {
		loadTrack(nextTrackID);
	}}
>
	<span class="sr-only">Next track</span>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="size-8"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
		/>
	</svg>
</button>
