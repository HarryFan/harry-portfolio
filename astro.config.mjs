import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import { defineConfig } from 'astro/config';

// https://astro.build/config
// GitHub Pages 部署路徑設定
// 為確保在開發和產品環境中的正確路徑

// 本地開發環境，使用相對路徑 '/'
// GitHub Pages 部署環境，強制使用 '/harry-portfolio/'
const deploymentPath = '/harry-portfolio/';

export default defineConfig({
  site: 'https://harryfan.github.io/harry-portfolio', // 在 site URL 中包含子目錄
  base: deploymentPath, // 使用三巴目錄路徑
  integrations: [mdx(), sitemap(), tailwind()],
  server: {
    port: 3000, // 指定固定端口
  },
  build: {
    assets: '_astro', // 使用相對路徑
    assetsPrefix: deploymentPath // 確保資源路徑正確
  }
});
