---
title: "Making a Nuxt 3 Blog: Writing the First Post"
description: How to write your very first blog post in a Nuxt 3 blog.
publishedAt: 2022-8-12
---

## Writing it

Next, create a `blog` directory within the `content` directory at the root of your project. Add in a new file named `my-first-blog-post.md` with this content:

```md
---
title: "The title for my first blog post."
description: A description for my first blog post.
publishedAt: 2022-07-30
---

My first blog post!
```

## Check it out

First thing we need to do is start up our Nuxt blog in development mode. In the root of the project, run:

```sh
npm run dev
```

By default, this should run your application on `localhost` over port `3000`. In your browser, visit [http://localhost:3000/blog/my-first-blog-post].

You should see the text `My first blog post!`.

## Explanation

Everything in between the two `---` is the metadata for the blog post. We're not using this information yet, but we'll be using it later when we configure the special layout for our blog posts.

Everything after that is the content of the page. All standard [markdown](https://www.markdownguide.org/) syntax is supported.

The file name of the markdown file becomes the [url slug](https://developer.mozilla.org/en-US/docs/Glossary/Slug) of the page. The `/blog` part of the url is because the file is located in the `blog` directory. If you had named your directory `posts` or `articles`, then the url would match the directory name. There's nothing special about the naming of the file.

Right now, these files are just treated as pages on the site. In the future, we'll show how to:

- Enable SEO metadata in the blog post page
- Enable comments
- Allow people to "like" the page
- Pull the title and description metadata and automatically include them on the page
- Include the publish date automatically
- Include author details automatically
- Include previous and next links for blogs that are part of a series

## Next Steps

- Prev: [Write a Nuxt 3 Blog - Getting Started](/blog/write-a-nuxt-3-blog-part-1)
- Next: [Write a Nuxt 3 Blog - Write a Nuxt 3 Blog - Creating a Custom Layout for your Blog Posts](/blog/write-a-nuxt-3-blog-part-3)
