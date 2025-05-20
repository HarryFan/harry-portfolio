import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://harryfan.github.io',
  base: process.env.NODE_ENV === 'production' ? '/harry-portfolio' : '', // 只在生產環境使用 base
  integrations: [mdx(), sitemap(), tailwind()],
  server: {
    port: 3000, // 指定固定端口
  }
});
