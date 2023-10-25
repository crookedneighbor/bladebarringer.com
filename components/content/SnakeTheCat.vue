<template>
  <div id="name-container">
    <img id="snake-the-cat" src="/snake-the-cat.png" class="motion-safe:animate-bounce">
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped>
#name-container {
  @apply w-full m-auto h-full overflow-hidden flex justify-center; 
}

#snake-the-cat {
  @apply m-10 mt-48;
}
</style>
