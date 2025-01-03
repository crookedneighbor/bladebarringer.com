<script lang="ts">
	import { player } from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';

	interface Props {
		art: string;
	}

	let { art }: Props = $props();

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

	let imgWidth = $derived.by(() => {
		// display the art without hiding it when song hasn't started yet
		if (!player.position || !player.duration) {
			return '0%';
		}
		// slowly reveal the art as the song progresses
		return `${100 - progress}%`;
	});
</script>

<!-- TODO adjust the colors/style here -->
<button
	bind:this={progressElement}
	class="w-full bg-blue-200 block mb-1 relative"
	onclick={(e) => {
		const width = Number(getComputedStyle(progressElement).width.split('px')[0]);
		const percent = e.offsetX / width;
		const position = player.duration * percent;

		player.seek(position / 1000);
	}}
>
	<div class="h-full absolute top-0 right-0 bg-black bg-opacity-70" style:width={imgWidth}></div>
	<img src={art} class="w-full" alt="" />
	<span class="sr-only">Track {progress}% done</span>
</button>
