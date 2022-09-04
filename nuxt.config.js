import { defineNuxtConfig } from "nuxt";

export default defineNuxtConfig({
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "bladebarringer.com",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  ignore: ["**/*.test.*"],

  modules: [
    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    // https://go.nuxtjs.dev/stylelint
    "@nuxtjs/stylelint-module",
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss",
    // Modules: https://go.nuxtjs.dev/config-modules
    // https://go.nuxtjs.dev/content
    "@nuxt/content",
  ],

  content: {
    documentDriven: true,
    highlight: {
      theme: "github-light",
    },
  },
});
