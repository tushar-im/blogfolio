import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [mdx(), sitemap()],
	site: "https://tushar.im",
	vite: {
		plugins: [tailwindcss()],
	},
});
