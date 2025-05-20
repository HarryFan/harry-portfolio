import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://harryfan.github.io/harry-portfolio', // 在 site URL 中包含子目錄
  base: '/harry-portfolio/', // 設定 base，讓所有路徑正確指向子目錄
  integrations: [mdx(), sitemap(), tailwind()],
  server: {
    port: 3000, // 指定固定端口
  },
  build: {
    assets: '_astro', // 使用相對路徑
    assetsPrefix: '' // 清空前綴
  }
});
