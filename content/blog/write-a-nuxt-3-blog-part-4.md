---
title: "Making a Nuxt 3 Blog: Showing Blog Posts on the Home Page"
description: How to link your most recent blog posts on your home page.
publishedAt: 2022-8-18
---

## Create the Recent Blog Posts Component

Let's put together a simple component to dynamically load links to the 5 most recent blog posts.

```js
// this grabs all the content files in the blog directory
const query = await queryContent("blog")
  // only grabs the information we need
  .only(["title", "publishedAt", "_path"])
  // sorts it by the publish date in descending order
  .sort({ publishedAt: -1 })
  // only the last 5 published articles
  .limit(5)
  .find();

// convert the data to a usable format in the template
const posts = query.map((post) => {
  return {
    title: post.title,
    path: post._path,
    // convert the date string to an easier to read format
    publishedAt: new Date(post.publishedAt).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
});
```

Once we've created the `posts` array, we can create our HTML using a [Vue v-for directinve](https://vuejs.org/guide/essentials/list.html) and the built in [NuxtLink component](https://v3.nuxtjs.org/api/components/nuxt-link/):

```html
<ul>
  <li v-for="post in posts" :key="post.path">
    <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
    - {{ post.publishedAt }}
  </li>
</ul>
```

All together, it looks like:

```html
<template>
  <ul>
    <li v-for="post in posts" :key="post.path">
      <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
      - {{ post.publishedAt }}
    </li>
  </ul>
</template>

<script setup>
  const query = await queryContent("blog")
    .only(["title", "publishedAt", "_path"])
    .sort({ publishedAt: -1 })
    .limit(5)
    .find();

  const posts = query.map((post) => {
    return {
      title: post.title,
      path: post._path,
      publishedAt: new Date(post.publishedAt).toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
  });
</script>
```

## How does it look?

This will render on your page as something like this:

```html
<ul>
  <li><a href="/blog/path-to-post-5">Post 5</a> - Aug 14, 2022</li>
  <li><a href="/blog/path-to-post-4">Post 4</a> - Aug 13, 2022</li>
  <li><a href="/blog/path-to-post-3">Post 3</a> - Aug 12, 2022</li>
  <li><a href="/blog/path-to-post-2">Post 2</a> - Aug 11, 2022</li>
  <li><a href="/blog/path-to-post-1">Post 1</a> - Aug 10, 2022</li>
</ul>
```

## Using the Component

Add it to your home page content document (or wherever you want to add it):

```markdown
## Recent Blog Posts

<recent-blog-posts></recent-blog-posts>
```

## Next Steps

- Prev: [Write a Nuxt 3 Blog - Writing the First Post](/blog/write-a-nuxt-3-blog-part-3)
- Next: Write a Nuxt 3 Blog - Hosting on Github Pages (Link soon)
