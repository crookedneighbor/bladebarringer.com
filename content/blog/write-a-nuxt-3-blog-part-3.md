---
title: "Making a Nuxt 3 Blog: Adding links to blog on home page"
description: How to use layouts to present blog posts.
publishedAt: 2022-8-13
---

## Creating Layouts

We need to create special layouts for our pages and for our blog posts. This is so we can have special handling for presenting our pages, vs presenting our blog posts.

The first thing we want to do is create a `layouts` directory at the root of the project. Next, add a `page.vue` file to the `layouts` directory that looks like this:

```vue
<template>
  <div>
    <slot />
  </div>
</template>
```

There's not much going on here. It just creates a layout that injects whatever you put into the markdown files in the `content` directory.

Next, in the same `layouts` directory, add a `blog.vue` file that looks like this:

```vue
<template>
  <div>
    <h1>{{ page.title }}</h1>
    <p>{{ page.description }}</p>
    <p>
      Published
      <span v-if="page.publishedAt">on {{ publishDate }}</span> by
      {{ author }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
const { page } = useContent();

if (!page?.value) {
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
  }
);
</script>
```

Here we use the [Vue composition API](https://vuejs.org/api/composition-api-setup.html) along with the [Nuxt Content useContent hook](https://content.nuxtjs.org/api/composables/use-document-driven/) to get access to the `page` variable. This gives us all the data we put in the `---` section as properties on the object.

We need to check and make sure that there is page data available to us, and throw a 404 `createError` in the case that a blog post does not actually exist.

By default, we'll assume that all blog posts are written by you (fill in your own name/handle in place of `Your Name`) unless an explicit author property is set in the blog post's metadata.

Since the `publishedAt` property is a string representing a date, we create a `publishDate` variable that converts it to a date that's easier to read instead (including the day of the week it was published!).

Last, we use these variables in the template. I've made the template not rely on the presence of a `publishedAt` property, so it only prints the date it was published if that is contained in the metadata.

## Updating the Template

Finally, we need to update our `pages/[...slug].vue` file to choose the correct template for the situation.

```vue
<template>
  <div>
    <NuxtLayout :name="layout">
      <ContentDoc>
        <template #not-found>
          <h1>Hmm... Something's not right</h1>
          <h2>I couldn't find the page you asked for</h2>
        </template>
      </ContentDoc>
    </NuxtLayout>
  </div>
</template>

<script setup>
const layouts = {
  page: "page",
  blog: "blog",
};
const route = useRoute();
const section = route.params.slug[0] || "page";
const layout = layouts[section] || "page";
</script>
```

The `<template>` is basically the same, we're just wrapping everything in a `<NuxtLayout>` component and setting the `name` attribute to the layout we're deriving from the `<script>` tag.

Once again in the `<script>`, we're using the Vue Composition API. We have a map of our available layouts, for now just `page` and `blog`. We use the [`useRoute` hook](https://v3.nuxtjs.org/api/composables/use-route/) to get the url `slug` of the current page. Then we pull off the first piece of the `slug`. If we're on the home page (and thus, there's no value in the slug param), it'll default to the `page` layout.

From there, we check if the `section` is available in the `layouts` map. So if the the content is found in the `blog` directory, it'll have a `/blog/` in the url `slug` and then use the `blog` layout. Anything else will default back to the `page` layout.

And that's it! Now blog posts will render with a specific template just for the blog and all other pages will render with the `page` template. We can go further and create specialized templates for new sections. For instance, if you wanted to have a special template for `tutorials`, you could create a new folder in your `content` directory called `tutorials` a new template called `tutorial.vue` in your `layouts` directory, and add that to the `layouts` map.

Alternatively, you could use the `useContent` hook again and manually add whatever layout you want to the page's metadata, but I prefer this more automatic approach.

## Note

If you're using TypeScript and Eslint, you may get the `@typescript-eslint/no-unused-vars` error because it cannot recognize that the variables defined in the `<script setup>` are being used in the `<template>`. To fix this, add the `vue/script-setup-uses-vars` rule to your Eslint config. Doing this will trigger the `@typescript-eslint/no-unused-vars` rule only when the variables are actually not used.

```js
rules: {
  "vue/script-setup-uses-vars": "error",
},
```

## Next Steps

- Prev: [Write a Nuxt 3 Blog - Writing the First Post](/blog/write-a-nuxt-3-blog-part-2)
- Next: Write a Nuxt 3 Blog - Showing Blog Posts on the Home Page (Link Coming Soon)
