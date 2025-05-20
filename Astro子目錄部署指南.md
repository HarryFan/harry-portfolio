# 🚀 Astro 子目錄部署指南

## 📝 問題背景

在 GitHub Pages 上部署 Astro 網站到子目錄（如 `/harry-portfolio/`）時，常見以下問題：

1. **CSS 和 JavaScript 檔案載入失敗**（404 錯誤）
2. **圖片路徑錯誤**，無法正確顯示
3. **導航連結失效**，點擊後找不到頁面

這些問題來源於 Astro 構建的靜態網站在子目錄部署時的路徑處理機制。

## ⚙️ 關鍵設定

### 1. 正確設定 `astro.config.mjs`

```javascript
export default defineConfig({
  // 設定站點 URL（無需子目錄路徑）
  site: 'https://harryfan.github.io',
  
  // 設定基礎路徑，必須前後都有斜線
  base: '/harry-portfolio/',
  
  // 停用資源檔案名稱的雜湊處理（解決 CSS 載入問題）
  build: {
    assets: 'assets'
  },
  
  // 確保固定的檔案名稱（不使用雜湊）
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]'
        }
      }
    }
  },
  
  // 其他設定...
  integrations: [mdx(), sitemap(), tailwind()]
});
```

### 2. 動態路徑處理：使用 `import.meta.env.BASE_URL`

在組件中引用資源時，必須使用 `import.meta.env.BASE_URL` 作為路徑前綴：

```astro
<!-- ❌ 錯誤方式 -->
<img src="/images/logo.png" alt="Logo">
<a href="/about">關於我們</a>

<!-- ✅ 正確方式 -->
<img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo">
<a href={`${import.meta.env.BASE_URL}about`}>關於我們</a>
```

### 3. Markdown 內容中的圖片路徑

在 Markdown/MDX 內容的前置資料（frontmatter）中，需手動添加子目錄前綴：

```markdown
---
title: "我的文章"
# ❌ 錯誤方式
heroImage: "/post_img.webp"

# ✅ 正確方式
heroImage: "/harry-portfolio/post_img.webp"
---
```

## 🧰 自動化修復

### Python 路徑修復腳本

使用此 Python 腳本自動修正所有組件中的絕對路徑引用：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import sys
from pathlib import Path

# 定義需要搜索的檔案類型
FILE_EXTENSIONS = ['.astro', '.jsx', '.tsx', '.js', '.ts']

# 定義需要處理的路徑模式
PATH_PATTERNS = [
    # 絕對路徑模式 - href="/"
    (r'href="/"', r'href={`${import.meta.env.BASE_URL}`}'),
    # 絕對路徑模式 - href="/路徑"
    (r'href="(/[^"]*)"', r'href={`${import.meta.env.BASE_URL}\1`}'),
    # src 絕對路徑 - src="/路徑"
    (r'src="(/[^"]*)"', r'src={`${import.meta.env.BASE_URL}\1`}'),
    # 特定形式的路徑，但排除已經使用 BASE_URL 的路徑
    (r'href={`/([^${}]*)`}', r'href={`${import.meta.env.BASE_URL}\1`}'),
    (r'src={`/([^${}]*)`}', r'src={`${import.meta.env.BASE_URL}\1`}'),
    # 特別處理 a 標籤中的 href="/"
    (r'<a([^>]*)href="/"([^>]*)>', r'<a\1href={`${import.meta.env.BASE_URL}`}\2>'),
]

def process_file(file_path):
    """處理單個檔案的路徑問題"""
    print(f"處理檔案: {file_path}")
    
    # 讀取檔案內容
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 記錄原始內容，用於比較是否有變更
    original_content = content
    
    # 套用所有路徑模式替換
    for pattern, replacement in PATH_PATTERNS:
        content = re.sub(pattern, replacement, content)
    
    # 如果內容有變更，寫回檔案
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"已更新: {file_path}")
        return True
    return False

def main(root_dir):
    """主函數：遍歷專案目錄，處理所有符合條件的檔案"""
    root_path = Path(root_dir)
    total_files = 0
    modified_files = 0
    
    print(f"開始處理專案目錄: {root_path}")
    
    # 遍歷所有檔案
    for ext in FILE_EXTENSIONS:
        for file_path in root_path.rglob(f"*{ext}"):
            # 忽略 node_modules 和 dist 目錄
            if "node_modules" in str(file_path) or "dist" in str(file_path):
                continue
            
            # 確保是檔案而不是目錄
            if not file_path.is_file():
                continue
            
            total_files += 1
            if process_file(file_path):
                modified_files += 1
    
    print(f"\n處理完成! 共掃描 {total_files} 個檔案，修改了 {modified_files} 個檔案。")

if __name__ == "__main__":
    # 取得專案根目錄
    if len(sys.argv) > 1:
        project_dir = sys.argv[1]
    else:
        project_dir = os.getcwd()  # 預設使用當前目錄
    
    main(project_dir)
```

## 🔍 常見問題排除

1. **CSS 未載入問題**：
   - 檢查 HTML 中的 CSS 路徑是否正確
   - 確認 `vite` 配置中已停用檔案名稱雜湊
   - 使用瀏覽器開發者工具查看實際請求路徑

2. **圖片未顯示**：
   - 確認所有圖片都使用 `${import.meta.env.BASE_URL}` 前綴
   - Markdown 內容中手動添加子目錄前綴
   - 檢查圖片檔案是否實際存在於正確位置

3. **導航失效**：
   - 所有 `<a href="/">` 修改為 `<a href={`${import.meta.env.BASE_URL}`}>`
   - 任何以斜線開頭的路徑都需要添加 BASE_URL 前綴

## 📋 部署流程

1. **修改配置**：
   ```bash
   # 1. 更新 astro.config.mjs 中的設定
   # 2. 執行路徑修復腳本
   python3 fix_paths.py
   ```

2. **構建專案**：
   ```bash
   npm run build
   ```

3. **部署到 GitHub Pages**：
   ```bash
   npm run deploy
   # 或直接使用 gh-pages 工具
   npx gh-pages -d dist
   ```

## ⚠️ 注意事項

- 每次添加新組件或頁面時，請確保使用 `import.meta.env.BASE_URL` 處理路徑
- 添加新的 Markdown 內容時，記得在 frontmatter 中手動設定圖片路徑
- 使用 `.nojekyll` 檔案避免 GitHub Pages 的 Jekyll 處理干擾

---

這份指南整理了 Astro 專案在 GitHub Pages 子目錄部署中的常見問題與解決方案，希望能幫助您輕鬆解決部署問題。
