<template>
  <div>
    <h1>{{ page.title }}</h1>
    <p class="text-gray-500">{{ page.description }}</p>
    <p class="text-gray-500">
      Published
      <span v-if="page.publishedAt">on {{ publishDate }}</span> by
      {{ author }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
const { page } = useContent();
const author = page.value.author || "Blade";
const publishDate = new Date(page.value.publishedAt).toLocaleDateString(
  "en-us",
  {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  }
);
</script>
