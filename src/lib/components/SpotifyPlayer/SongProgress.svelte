<script lang="ts">
	import { player } from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';

	let progressElement: HTMLButtonElement;

	let progress = $derived.by(() => {
		if (!player.position || !player.duration) {
			return '0%';
		}
		const percentage = (player.position / player.duration) * 100;
		if (percentage < 1) {
			return '1%';
		}
		return `${percentage.toFixed(2)}%`;
	});
</script>

<!-- TODO adjust the colors/style here -->
<button
	bind:this={progressElement}
	class="w-full bg-blue-200 block mb-1"
	onclick={(e) => {
		const width = Number(getComputedStyle(progressElement).width.split('px')[0]);
		const percent = e.offsetX / width;
		console.log(e.x);
		const position = player.duration * percent;

		player.seek(position / 1000);
	}}
>
	<div class="h-2 bg-red-200" style:width={progress}>
		<span class="sr-only">Track {progress} done</span>
	</div>
</button>
