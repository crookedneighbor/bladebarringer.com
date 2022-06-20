<template>
  <nav class="border-b-4 md:border-r-4 md:border-b-0 border-yellow-200 p-8">
    <div v-for="group in linkGroups" :key="group.title" class="mb-4">
      <p class="mb-2">
        <strong>{{ group.title }}</strong>
      </p>

      <a
        v-for="link in group.links"
        :key="link.id"
        :href="link.href"
        rel="nofollow"
        target="_blank"
      >
        <div :class="link.id" class="icon mr-2"></div>
        {{ link.text }}</a
      >
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      linkGroups: [
        {
          title: "Links",
          links: [
            {
              id: "twitter",
              text: "Twitter",
              href: "https://twitter.com/bladebarringer",
            },
            {
              id: "github",
              text: "Github",
              href: "https://github.com/crookedneighbor",
            },
            {
              id: "spotify",
              text: "Spotify",
              href: "https://open.spotify.com/user/bladebarringer",
            },
            {
              id: "bandcamp",
              text: "Bandcamp",
              href: "https://bandcamp.com/crookedneighbor",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped>
.divider {
  @apply bg-gray-800 h-2 w-1/6 rounded-md hidden lg:block;
}

a {
  @apply block text-xl flex items-center mb-1;
}

.icon {
  height: 2rem;
  width: 2rem;
  mask-repeat: no-repeat;
  mask-position: center;
}

.icon.twitter {
  mask-image: url("/icons/twitter-brands.svg");

  @apply bg-blue-500;
}

.icon.github {
  mask-image: url("/icons/github-alt-brands.svg");

  @apply bg-gray-600;
}

.icon.spotify {
  mask-image: url("/icons/spotify-brands.svg");

  @apply bg-green-500;
}

.icon.bandcamp {
  mask-image: url("/icons/bandcamp-brands.svg");

  @apply bg-blue-400;
}
</style>
