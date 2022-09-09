<template>
  <div>
    <ul v-if="posts.length">
      <li v-for="post in posts" :key="post.path">
        <NuxtLink :to="post.path">{{ post.title }}</NuxtLink> -
        {{ post.publishedAt }}
      </li>
    </ul>
    <p v-else>No recent blog posts.</p>
  </div>
</template>

<script setup>
import { queryContent } from "#imports";

const content = await queryContent("blog")
  .only(["title", "publishedAt", "_path"])
  .where({ draft: { $ne: true } })
  .sort({ publishedAt: -1 })
  .limit(5)
  .find();

const posts = content.map((post) => {
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
