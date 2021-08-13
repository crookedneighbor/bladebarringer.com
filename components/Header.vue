<template>
  <div class="bg-yellow-200 pb-4">
    <h1
      class="
        text-gray-800 text-center
        font-sans
        text-4xl
        md:text-7xl
        lg:text-9xl
        py-4
      "
    >
      Blade Barringer
    </h1>
    <div class="lg:flex items-center max-w-screen-lg mx-auto">
      <div class="divider flex-grow"></div>
      <div
        class="
          font-mono
          mx-4
          text-purple-800 text-center
          flex-grow
          lg:flex-grow-0
          h-6
          overflow-hidden
        "
      >
        <div
          class="transition-transform transform"
          :class="{
            'translate-y-0': iteration === 0,
            '-translate-y-6': iteration === 1,
            '-translate-y-12': iteration === 2,
          }"
        >
          <div>Software Engineer</div>
          <div>Dad</div>
          <div>Wizard</div>
        </div>
      </div>
      <div class="divider"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iteration: 0,
    }
  },
  mounted() {
    setInterval(() => {
      if (this.iteration >= 2) {
        this.iteration = 0
      } else {
        this.iteration++
      }
    }, 3000)
  },
}
</script>

<style>
.divider {
  @apply bg-gray-800 h-2 w-1/6 rounded-md hidden lg:block;
}
</style>
