import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const expressiveCodeOptions = {
  styleOverrides: {
    frames: {
      tooltipSuccessBackground: "#60ddcd",
      tooltipSuccessForeground: "black",
    },
  },
  // theme: 'dracula',
};

// https://astro.build/config
export default defineConfig({
  site: "https://scrollmirror.netlify.app",
  server: { port: 8274, host: false },
  integrations: [expressiveCode(expressiveCodeOptions), mdx()],
});
