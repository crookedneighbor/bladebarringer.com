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

// this is a safeguard to redirect to a 404 page if the particular
// blog post page cannot be found
if (!page?.value) {
  throw createError({ statusCode: 404, statusMessage: "Post Not Found" });
}

// this prevents drafts from being displayed on our site, unless
// we're running the site in development using `npm run dev`
if (page.value.draft && process.env.NODE_ENV !== "development") {
  throw createError({ statusCode: 404, statusMessage: "Post Not Found" });
}

const author = page.value.author || "Blade";
const publishDate = new Date(page.value.publishedAt).toLocaleDateString(
  "en-us",
  {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  },
);
</script>
