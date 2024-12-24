<script>
	import AvoidMouse from '$lib/components/AvoidMouse/AvoidMouse.svelte';
	let startingCoordinates = { x: 50, y: 50 };
</script>

<AvoidMouse {startingCoordinates}>
	<img
		src="/snake-the-cat.png"
		alt="A cat name snake"
		id="snake-the-cat"
		data-testid="snake-the-cat"
	/>
</AvoidMouse>

<style lang="postcss">
	#snake-the-cat {
		@apply w-72 max-w-full;
	}
</style>
