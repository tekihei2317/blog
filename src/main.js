// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from "~/layouts/Default.vue";
import "~/assets/reset.css";

export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  head.link.push({
    rel: "stylesheet",
    href:
      "https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/light.min.css",
  });
  Vue.component("Layout", DefaultLayout);
}
