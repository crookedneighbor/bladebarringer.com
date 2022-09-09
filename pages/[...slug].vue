<template>
  <div class="flex flex-col h-screen">
    <header-component />
    <div class="md:flex max-w-screen-lg w-full mx-auto flex-grow">
      <nav-component class="w-full md:w-96" />
      <div class="p-8 flex-shrink">
        <NuxtLayout :name="layout">
          <ContentDoc>
            <template #not-found>
              <h1>Hmm... Something's not right</h1>
              <h2>I couldn't find the page you asked for</h2>
            </template>
          </ContentDoc>
        </NuxtLayout>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "#app";
const layouts = {
  page: "page",
  blog: "blog",
};
const route = useRoute();
const section = route.params.slug[0] || "page";
const layout = layouts[section] || "page";
</script>

<style>
h1 {
  @apply my-4 text-4xl;
}

h2 {
  @apply my-4 text-3xl;
}

p {
  @apply my-4;
}

a {
  @apply text-purple-800;
}

code {
  @apply text-pink-800;
}

pre code {
  @apply block bg-gray-100 text-black p-2 my-4;
}

/* https://codepen.io/niklass/pen/MXzJBQ */
[data-emoji] {
  font-style: normal;
  font-weight: normal;
}

[data-emoji]::before {
  content: attr(data-emoji);
  margin-right: 0.125em;
}
</style>
