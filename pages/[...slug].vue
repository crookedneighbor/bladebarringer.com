<template>
  <div class="flex flex-col h-screen">
    <header-component />
    <div class="md:flex max-w-screen-lg w-full mx-auto flex-grow">
      <nav-component class="w-full md:w-96" />
      <div class="p-8 flex-shrink">
        <div class="relative">
          <blade-face></blade-face>
        </div>

        <ContentDoc>
          <template #not-found>
            <h1>Hmm... Something's not right</h1>
            <h2>I couldn't find the page you asked for</h2>
          </template>
        </ContentDoc>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params, error }) {
    const slug = params.slug || "index";
    const page = await $content(slug)
      .fetch()
      .catch(() => {
        error({ statusCode: 404, message: "Page not found" });
      });

    return {
      page,
    };
  },
};
</script>

<style>
h1 {
  @apply my-4 text-5xl;
}

h2 {
  @apply my-4 text-4xl;
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
