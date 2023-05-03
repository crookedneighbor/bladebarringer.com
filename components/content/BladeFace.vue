<template>
  <div class="w-full">
    <div aria-hidden="true">
      <div
        ref="face"
        class="border-8 border-gray-800 rounded-full w-64 h-64 mb-16 mx-auto overflow-hidden"
      >
        <div
          class="flex relative transition-all delay-100 duration-200 ease-in-out"
          :style="{ marginTop: yposition + 'px', marginLeft: xposition + 'px' }"
        >
          <div class="eye"></div>
          <div class="w-12"></div>
          <div class="eye"></div>
        </div>

        <div
          class="bg-gray-800 w-20 h-2 ml-4 mt-16 rounded relative transition-all delay-100 duration-200 ease-in-out"
          :style="{ marginLeft: xposition * 1.5 + 'px' }"
        ></div>
      </div>

      <div class="hidden lg:block">
        <kids-faces
          class="fade-in"
          :class="{
            'opacity-0': section !== 'dad',
            'opacity-100': section === 'dad',
          }"
        />

        <terminal-screen
          class="fade-in"
          :class="{
            'opacity-0': section !== 'software-engineer',
            'opacity-100': section === 'software-engineer',
          }"
          :active="section === 'software-engineer'"
        />

        <magic-cards
          class="fade-in"
          :class="{
            'opacity-0': section !== 'wizard',
            'opacity-100': section === 'wizard',
          }"
        />
      </div>
    </div>

    <slot />
  </div>
</template>

<script>
let onMousemove;

function findSection(el) {
  if (!el || !el.getAttribute) {
    return "";
  }

  const section = el.getAttribute("data-section");

  if (section) {
    return section;
  }

  return findSection(el.parentNode);
}

export default {
  data() {
    return {
      section: "",
      xposition: 76,
      yposition: 9,
    };
  },
  mounted() {
    onMousemove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const bounds = this.$refs.face.getBoundingClientRect();

      this.section = findSection(e.target);

      if (mouseX < bounds.x + 10) {
        this.xposition = 10;
      } else if (mouseX > bounds.x + bounds.width - 20) {
        this.xposition = bounds.width / 2;
      } else {
        this.xposition = Math.floor((mouseX - bounds.x) / 2);
      }

      if (mouseY < bounds.y + 9) {
        this.yposition = 9;
      } else if (mouseY > (bounds.y + bounds.height) / 1.5) {
        this.yposition = bounds.height / 3;
      } else {
        this.yposition = Math.floor(mouseY - bounds.y);
      }
    };
    document.body.addEventListener("mousemove", onMousemove);
  },
  unmounted() {
    document.body.removeEventListener("mousemove", onMousemove);
  },
};
</script>

<style scoped>
.eye {
  @apply rounded-full bg-gray-800 h-12 w-12;
}

.fade-in {
  @apply transition-opacity duration-500 ease-in-out;
}
</style>
