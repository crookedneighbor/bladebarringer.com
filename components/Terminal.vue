<template>
    <div
      class="absolute left-0 right-0 top-0 mt-36 w-full"
    >
    <div class="rounded-lg border-gray-500 border-4 h-32 w-48 bg-gray-900 mx-auto text-white pl-2 pt-1"><span class="animate-pulse">&gt;</span>{{text}}</div>
    </div>
  </div>
</template>

<script>
const texts = [" npm start   ", " vim src/index.ts   ", " npm test   ", " bundle install   "]

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      text: "_",
      iteration: 0,
    }
  },
  mounted() {
    setInterval(() => {
      if (!this.active) {
        this.text = "_";
        this.iteration = -1;
      }
      if (texts[this.iteration] === this.text) {
          this.text = "_";
      } else if (this.text.indexOf("_") === 0) {
        if (this.text.length > 6) {
          this.iteration++;
          this.text = "";
        } else {
          this.text = this.text + " "
        }
      } else if (this.iteration >= texts.length) {
        this.text = "_";
        this.iteration = -1;
      } else {
        const nextLetter = texts[this.iteration].replace(this.text, "").charAt(0);
        this.text = this.text + nextLetter;
      }
    }, 150);
  }
}
</script>
