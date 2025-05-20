import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://harryfan.github.io',
  base: '/harry-portfolio/', // GitHub Pages 子目錄
  integrations: [mdx(), sitemap(), tailwind()],
  server: {
    port: 3000, // 指定固定端口
  }
});
