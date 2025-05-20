# 📋 Astro 專案手動部署指南

## 🚀 部署流程概述

此指南記錄如何手動部署 Astro 專案到 GitHub Pages，無需使用 GitHub Actions（適用於免費方案限制情況）。

## 🔧 前置條件

- Git 已安裝且設定完成
- Node.js 和 npm 已安裝
- 專案已設定 `astro.config.mjs` 檔案，配置如下：

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: 'https://harryfan.github.io/harry-portfolio', // 包含子路徑
  base: '', // 設為空字串
  integrations: [mdx(), sitemap(), tailwind()],
  server: {
    port: 3000,
  },
  build: {
    assets: '_astro', // 使用相對路徑
    assetsPrefix: '' // 清空前綴
  }
});
```

## 📝 手動部署步驟

### 1. 切換到主分支並確保代碼已更新

```bash
git checkout main
git pull origin main
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 構建網站

```bash
npx astro build
```

### 4. 切換到 gh-pages 分支

```bash
git checkout gh-pages
```

### 5. 清除舊檔案

清除 gh-pages 分支上的舊檔案（保留 .git 目錄、dist 和 node_modules）：

```bash
find . -mindepth 1 -maxdepth 1 -not -path "./.git" -not -path "./dist" -not -path "./node_modules" -exec rm -rf {} \;
```

### 6. 複製構建結果到根目錄

```bash
cp -a dist/. .
```

### 7. 提交變更

```bash
git add .
git commit -m "deploy: 更新作品集網站"
```

### 8. 推送到遠端 gh-pages 分支

```bash
git push origin gh-pages
```

## 🔍 驗證部署

完成後，訪問 `https://harryfan.github.io/harry-portfolio/` 查看部署結果。

## 📢 注意事項

- GitHub Pages 部署可能需要幾分鐘時間才會更新
- 確保 GitHub 儲存庫設定中已將 GitHub Pages 來源設為 gh-pages 分支
- `.nojekyll` 檔案應保留在 gh-pages 分支中，以防止 GitHub Pages 使用 Jekyll 處理網站
- 如果遇到資源載入問題，請檢查以下幾點：
  - 確認 `astro.config.mjs` 中的 `site` 和 `base` 設定正確
  - 確保所有靜態資源（圖片、CSS、JS）使用根路徑（如 `/image.png`）
  - 清除瀏覽器快取後重新載入頁面
