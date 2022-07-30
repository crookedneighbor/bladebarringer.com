---
title: "Making a Nuxt 3 Blog: Getting Started"
description: How to get started setting up a Nuxt 3 blog using the Nuxt Content module.
---

:wave: This site is built using [Nuxt 3](https://v3.nuxtjs.org/) with the [Nuxt Content module](https://content.nuxtjs.org/). I thought I'd write short articles articulating how I created it (as I create it), this is the first!

## Prerequisites

What do we need before we get started?

- [Node](https://nodejs.org/en/) v16 or higher
- npm & npx (comes installed with Node)
- A text editor such as [Visual Studio Code](https://code.visualstudio.com/) or [Vim](https://www.vim.org/)
- A terminal (should come pre-installed on your machine and is integrated with Visual Studio Code)

If you're not familiar with these tools, I recomend building familiarity before reading this guide.

## What's Nuxt and Nuxt Content?

Nuxt is a Vue framework that makes writing websites as [Jamstack applications](https://jamstack.org/) easy. At the time of this writing, Nuxt 3 is still in beta.

The Nuxt Content module allows Nuxt pages to be written in a mix of Markdown and user defined Vue components. The [getting started guide](https://content.nuxtjs.org/get-started) gives easy steps for creating a new Nuxt 3 project with Nuxt Content:

```bash
npx nuxi init content-app -t content
```

This will create a `content-app` directory with your newly created Nuxt app. Follow the instructions for entering the directory and installing the dependencies.

This should get everything set up for a basic Nuxt app with the Content module.

## Content

The markdown files for your website will be contained in the `content` directory. Inside you'll find an `index.md` file to be the home page of your site.

Note: at the time of writing, there's a [bug in the Nuxt Content module](https://github.com/nuxt/content/issues/1237) that pulls in the _first_ markdown file in the content directory instead of `index.md`. To account for that, use the `npm:@nuxt/content-edge/latest` as the version for `@nuxt/content` in your `package.json`. Be sure to keep track of updates and pin back to a stable version when the bug is fixed.

## Pages

In the `pages` directory, you'll find a `[...slug].vue` file. This will create the base for all your pages.

```html
<template>
  <ContentDoc></ContentDoc>
</template>
```

The `ContentDoc` element is where your markdown pages will be rendered into `HTML`. This will automatically create a page for each markdown file in your `content` directory.

If you go to a path in your website that has no corresponding markdown file in the `content`, the default "Not Found" message will render.

You can customize it by including a `#not-found` template:

```html
<ContentDoc>
  <template #not-found>
    <h1>Hmm... Something's not right</h1>
    <h2>I couldn't find the page you asked for</h2>
  </template>
</ContentDoc>
```

## Extras

If your blog will present code snippets, configure the content module to include syntax highlighting.

```js
export default defineNuxtConfig({
  // other configuration

  content: {
    highlight: {
      theme: "github-light",
    },
  },
});
```

## Next Steps

- Next: [Write a Nuxt 3 Blog - Your First Blog Post](/blog/write-a-nuxt-3-blog-part-2)
