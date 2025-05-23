import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import { defineConfig } from 'astro/config';

// https://astro.build/config
// 根據官方文件的 GitHub Pages 部署指南設定

export default defineConfig({
  site: 'https://harryfan.github.io', // 使用你的 GitHub 使用者網址
  base: '/harry-portfolio/', // 必須以斜線開頭和結尾
  build: {
    assets: 'assets', // 指定資源目錄名稱，協助 Astro 正確處理靜態資源
    assetsPrefix: ''
  },
  vite: {
    build: {
      // 停用資源檔案名稱的雜湊碼，避免每次構建產生不同的檔案名稱
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]'
        }
      }
    }
  },
  integrations: [mdx(), sitemap(), tailwind()],
  server: {
    port: 3000, // 指定固定端口
  }
});
