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
        <font-awesome-icon
          v-if="link.icon"
          :icon="link.icon"
          class="text-3xl mr-2"
          :class="link.iconClass"
        />
        {{ link.text }}</a
      >
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      linkGroups: [
        {
          title: 'Socials',
          links: [
            {
              id: 'twitter',
              text: 'Twitter',
              href: 'https://twitter.com/bladebarringer',
              icon: ['fab', 'twitter'],
              iconClass: 'text-blue-500',
            },
            {
              id: 'github',
              text: 'Github',
              href: 'https://github.com/crookedneighbor',
              icon: ['fab', 'github-alt'],
              iconClass: 'text-gray-600',
            },
            {
              id: 'spotify',
              text: 'Spotify',
              href: 'https://open.spotify.com/user/bladebarringer',
              icon: ['fab', 'spotify'],
              iconClass: 'text-green-500',
            },
          ],
        },
      ],
    }
  },
})
</script>

<style scoped>
.divider {
  @apply bg-gray-800 h-2 w-1/6 rounded-md hidden lg:block;
}

a {
  @apply block text-xl flex items-center;
}
</style>
