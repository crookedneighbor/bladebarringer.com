<template>
  <div class="transform rounded-lg border-black border-4 bg-yellow-800 h-36 w-24 pt-4 relative">
    <div class="rounded-full bg-yellow-700 h-32 absolute top-1 left-2 right-2 z-0"></div>
    <div class="relative z-10 bg-blue-400 mx-auto w-16 h-6 rounded-sm mt-0"></div>

    <div class="relative z-10 mt-6">
      <div class="flex mx-auto justify-center">
        <div class="mana-symbol bg-yellow-400"></div>
      </div>
      <div class="flex mx-auto justify-center -mt-1">
        <div class="mana-symbol bg-green-400 left"></div>
        <div class="mana-symbol bg-blue-400 right"></div>
      </div>
      <div class="flex mx-auto justify-center">
        <div class="mana-symbol bg-red-400"></div>
        <div class="mana-symbol bg-purple-400"></div>
      </div>
    </div>

    <div class="h-1"></div>
    <div class="relative z-10 bg-blue-400 mx-auto w-14 h-2 mt-4 rounded-sm"></div>
  </div>
  </div>
</template>

<style scoped>
.mana-symbol {
  @apply rounded-full h-1 w-1 m-1;
}

.mana-symbol.right {
  @apply ml-2;
}

.mana-symbol.left {
  @apply mr-2;
}
</style>
