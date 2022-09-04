---
title: "Making a Nuxt 3 Blog: Hosting on GitHub Pages"
description: How to deploy your Nuxt 3 website to GitHub Pages
publishedAt: 2022-9-4
---

## Enable Pages on Your Github Repo

Navigate to the settings tab on your GitHub repository and choose the Pages option in the left menu bar.

Under "Source" choose "GitHub Actions". It should automatically detect that you're running a `Nuxt` website and generate a Github actions template that should work out of the box. If you want something a bit slimmer that uses `npm` as the package manager, copy and paste this into a a file named `deploy.yml` :

```yaml
name: Deploy Nuxt site to Github Pages

on:
  push:
    branches: ["main"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "16"
          cache: npm
      - name: Setup Pages
        uses: actions/configure-pages@v2
      - name: Restore cache
        uses: actions/cache@v3
        with:
          path: |
            dist
            .nuxt
          key: ${{ runner.os }}-nuxt-build-${{ hashFiles('dist') }}
          restore-keys: |
            ${{ runner.os }}-nuxt-build-
      - name: Install dependencies
        run: npm ci
      - name: Static HTML export with Nuxt
        run: npm run generate
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: ./dist

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
```

It should start building automatically when you next push to your `main` branch on Github and be available at `https://<your-github-username>.github.io/<name-of-your-repository>`.

There's only one problem, none of the links or assets will work.

This is because when working locally, the site is configured to assume everything is at the root of the domain, while GitHub pages deploys everything to a url that includes the name of the repository as the root of the application.

You can either [adjust your base url conditionally for GitHub Pages](#adjust-the-apps-base-url) or [configure your GitHub Pages site to use a custom domain name](#configure-a-custom-domain).

## Adjust the App's Base Url

Open your `nuxt.config.js` file. It should look something like:

```js
export default defineNuxtConfig({
  // other configuration

  content: {
    documentDriven: true,
  },
});
```

Pull the configuration into a variable:

```js
const config = {
  // other configuration

  content: {
    documentDriven: true,
  },
};

export default defineNuxtConfig(config);
```

Next conditionally add the following if the environmental variable `GITHUB_ACTIONS` is detected:

```js
const config = {
  // other configuration

  content: {
    documentDriven: true,
  },
};

if (process.env.GITHUB_ACTIONS) {
  config.router = {
    base: "/<repository-name-here>/",
  };
}

export default defineNuxtConfig(config);
```

This will make it so our app runs without a base url in development, and automatically applys the base url when deployed to GitHub Pages.

This works, but it would be better to skip all that hastle and just use a custom domain name instead.

## Configure a Custom Domain

It's outside the scope of this tutorial to explain _how_ to purchase a domain name, but if you're looking for a provider, I have used [Hover](https://hover.com) for years and have been happy with it.

[GitHub's documentation for configuring the domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) can be a little confusing, but in short, you need to [update your domain's DNS records](https://help.hover.com/hc/en-us/articles/217282457-Managing-DNS-records-) to point to GitHub's pages when your domain is accessed in the browser. To do that, add the following records:

```
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
```

Then, in the domain section of Settings > Pages, enter your domain.

It can take quite a while for the udpate to finish propagating, but once it does, not only will your custom domain point to your Nuxt 3 app, it'll come with a compliemntary SSL certificate as well!

## Next Steps

- Prev: [Write a Nuxt 3 Blog - Showing Blog Posts on the Home Page](/blog/write-a-nuxt-3-blog-part-4)
- Next: Conclusion (Link Coming Soon)
