// 批量抓取赞美诗 400 首脚本
// 运行方式：node collect-all-hymns.js

const fs = require('fs');
const path = require('path');

// 赞美诗目录列表（根据网站结构）
const hymnPages = [];

// 生成 49 页的列表（每页 50 首）
for (let page = 1; page <= 49; page++) {
    const url = page === 1 
        ? 'http://www.231122.com/xb400/index.html'
        : `http://www.231122.com/xb400/index_${page}.html`;
    hymnPages.push(url);
}

console.log('📋 赞美诗列表页：', hymnPages.length, '页');
console.log('🎵 预计歌曲数量：400 首');
console.log('');
console.log('抓取策略：');
console.log('1. 访问每个列表页，提取歌曲链接');
console.log('2. 访问每首歌曲页面，提取标题、歌词、简谱图片');
console.log('3. 保存为 psalm-data-complete.js');
console.log('');
console.log('开始时间：', new Date().toLocaleString('zh-CN'));

// 输出到文件
const outputFile = path.join(__dirname, 'hymn-urls.txt');
fs.writeFileSync(outputFile, hymnPages.join('\n'));
console.log('');
console.log('✅ 列表页 URL 已保存到：', outputFile);
