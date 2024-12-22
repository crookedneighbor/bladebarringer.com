<script lang="ts">
	import { Spring } from 'svelte/motion';
	import { getNewCoordinates } from './onmousemove';
	import type { Snippet } from 'svelte';

	interface Props {
		startingCoordinates: { x: number; y: number };
		children: Snippet;
	}

	let { startingCoordinates = { x: 0, y: 0 }, children }: Props = $props();
	let coordinates = new Spring(startingCoordinates, {
		stiffness: 0.1,
		damping: 0.25
	});

	let top = $derived(coordinates.current.y + 'px');
	let left = $derived(coordinates.current.x + 'px');

	let onMouseMouseMove = (event: MouseEvent) => {
		coordinates.target = getNewCoordinates(event, startingCoordinates);
	};
</script>

<div
	class="container"
	onmousemove={onMouseMouseMove}
	style:left
	style:top
	data-testid="avoid-mouse-container"
	aria-hidden="true"
>
	<!-- TODO figure out aria needs here -->
	{@render children()}
</div>

<style lang="postcss">
	.container {
		@apply absolute w-fit h-fit;
	}
</style>
