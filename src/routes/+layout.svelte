<script lang="ts">
	import HeadlessSpotifyController from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}
