#!/usr/bin/env python3
# 批量抓取 231122.com 赞美诗简谱图片 URL

import requests
from bs4 import BeautifulSoup
import json
import time

base_url = "http://www.231122.com/xb400/"

# 赞美诗标题列表
hymn_titles = [
    "圣哉三一歌", "三一来临歌", "赞美三一歌", "荣耀归与真神", "感恩赞美",
    # ... 继续补充 400 首标题
]

def get_hymn_page(hymn_number):
    """获取赞美诗页面"""
    url = f"{base_url}{hymn_number}.html"
    try:
        response = requests.get(url, timeout=10)
        return response.text
    except:
        return None

def extract_image_url(html):
    """从页面提取简谱图片 URL"""
    if not html:
        return ""
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # 查找图片链接
    img_tags = soup.find_all('img')
    for img in img_tags:
        src = img.get('src', '')
        if 'gepu' in src or 'jianpu' in src:
            return src
    
    # 查找下载链接
    links = soup.find_all('a', href=True)
    for link in links:
        href = link['href']
        if '.png' in href or '.jpg' in href:
            return href
    
    return ""

# 主程序
results = []
for i in range(1, 401):
    print(f"Fetching hymn {i}...")
    html = get_hymn_page(i)
    img_url = extract_image_url(html)
    
    results.append({
        "number": i,
        "title": hymn_titles[i-1] if i <= len(hymn_titles) else f"第{i}首",
        "musicImage": img_url
    })
    
    time.sleep(0.5)  # 避免请求过快
    
    if i % 50 == 0:
        print(f"Progress: {i}/400")

# 保存结果
with open('hymn-image-urls.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("✅ 完成！结果保存到 hymn-image-urls.json")
