<script lang="ts">
  import { spring } from "svelte/motion";

  let coords = spring(
    { x: 150, y: 150 },
    {
      stiffness: 0.1,
      damping: 0.25,
    }
  );

  let onMouseMouseMove = (event: MouseEvent) => {
    const pageWidth = document.body.scrollWidth;
    const pageHeight = document.body.scrollHeight;
    const img = event.target as HTMLImageElement;
    const imgWidth = img.offsetWidth;
    const imgHeight = img.offsetHeight;
    let { clientX, clientY } = event;

    if (imgWidth + clientX > pageWidth) {
      clientX = 150;
    }
    if (imgHeight + clientY > pageHeight) {
      clientY = 150;
    }

    coords.set({ x: clientX, y: clientY });
  };
</script>

<img
  src="/snake-the-cat.png"
  alt="A cat name snake"
  id="snake-the-cat"
  data-testid="snake-the-cat"
  on:mousemove={onMouseMouseMove}
  style="left: {$coords.x}px; top: {$coords.y}px;"
/>

<style lang="postcss">
  #snake-the-cat {
    @apply w-72 max-w-full absolute;
  }
</style>
