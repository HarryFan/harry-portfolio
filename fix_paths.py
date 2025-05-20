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
