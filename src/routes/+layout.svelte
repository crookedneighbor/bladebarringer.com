<script>
	import '../app.css';
</script>

<slot />

<style lang="postcss">
	:global(html) {
		@apply bg-yellow-400;
	}

	:global(body) {
		@apply w-9/12 min-w-96 max-w-full h-screen m-auto;
	}
</style>
