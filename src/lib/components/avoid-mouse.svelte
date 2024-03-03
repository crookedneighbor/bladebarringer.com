<script lang="ts">
	import { spring } from 'svelte/motion';

	export let startingCoordinates = { x: 0, y: 0 };
	export let coordinatesStore = spring(startingCoordinates, {
		stiffness: 0.1,
		damping: 0.25
	});

	$: top = $coordinatesStore.y + 'px';
	$: left = $coordinatesStore.x + 'px';

	let onMouseMouseMove = (event: MouseEvent) => {
		const pageWidth = document.body.scrollWidth;
		const pageHeight = document.body.scrollHeight;
		const container = event.target as HTMLElement;
		let { clientX, clientY } = event;

		if (container.offsetWidth + clientX > pageWidth) {
			clientX = startingCoordinates.x;
		}
		if (container.offsetHeight + clientY > pageHeight) {
			clientY = startingCoordinates.y;
		}

		$coordinatesStore = { x: clientX, y: clientY };
	};
</script>

<div
	class="container"
	on:mousemove={onMouseMouseMove}
	style:left
	style:top
	data-testid="avoid-mouse-container"
	aria-hidden="true"
>
	<!-- TODO figure out aria needs here -->
	<slot />
</div>

<style lang="postcss">
	.container {
		@apply absolute w-fit h-fit;
	}
</style>
