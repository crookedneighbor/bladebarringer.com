<script lang="ts">
	import { player } from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';

	let progressElement: HTMLButtonElement;

	let progress = $derived.by(() => {
		if (!player.position || !player.duration) {
			return 0;
		}
		const percentage = (player.position / player.duration) * 100;
		if (percentage < 1) {
			return 1;
		}
		return Number(percentage.toFixed(2));
	});
</script>

<button
	bind:this={progressElement}
	class="w-full h-2 bg-gray-200 block mb-1 relative"
	onclick={(e) => {
		const width = Number(getComputedStyle(progressElement).width.split('px')[0]);
		const percent = e.offsetX / width;
		const position = player.duration * percent;

		player.seek(position / 1000);
	}}
>
	<div
		class="h-full absolute top-0 left-0 bg-red-400 bg-opacity-70"
		style:width="{progress}%"
	></div>
	<span class="sr-only">Track {progress}% done</span>
</button>
