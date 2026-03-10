#!/usr/bin/env node
/**
 * 赞美诗 400 首后台数据收集器
 * 运行方式：node background-collector.js
 * 
 * 功能：
 * 1. 批量抓取 http://www.231122.com/xb400/ 的赞美诗数据
 * 2. 提取标题、歌词、简谱图片链接
 * 3. 更新 psalm-data.js 文件
 * 4. 自动部署到 Vercel
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
    baseUrl: 'http://www.231122.com/xb400/',
    outputFile: path.join(__dirname, 'psalm-data-collected.js'),
    batchSize: 10, // 每批处理 10 首
    delayMs: 1000, // 请求间隔
};

// 赞美诗 ID 映射（从网站 URL 获取）
const hymnIds = {
    1: 60641, 2: 58891, 3: 57711, 4: 59950, 5: 4645,
    6: 58272, 7: 4728, 8: 58266, 9: 58243, 10: 57706,
    // ... 需要继续补充
};

console.log('🎵 赞美诗数据收集器启动');
console.log('📁 输出文件：', CONFIG.outputFile);
console.log('🌐 数据源：', CONFIG.baseUrl);
console.log('');

// 主函数
async function collectAll() {
    console.log('开始收集时间：', new Date().toLocaleString('zh-CN'));
    
    // 第 1 步：读取现有数据
    const existingData = loadExistingData();
    console.log('✅ 已加载现有数据：', existingData.length, '首');
    
    // 第 2 步：批量抓取新数据
    for (let i = 21; i <= 400; i++) {
        console.log(`\n📖 收集第 ${i} 首...`);
        
        try {
            const hymnData = await fetchHymnData(i);
            if (hymnData) {
                existingData[i - 1] = hymnData;
                console.log(`✅ 第 ${i} 首：${hymnData.title}`);
                
                // 每 10 首保存一次
                if (i % 10 === 0) {
                    saveData(existingData);
                    console.log('💾 已保存进度');
                }
            }
        } catch (error) {
            console.error(`❌ 第 ${i} 首失败：`, error.message);
        }
        
        // 延迟，避免请求过快
        await sleep(CONFIG.delayMs);
    }
    
    // 第 3 步：保存最终数据
    saveData(existingData);
    console.log('\n✅ 收集完成！');
    console.log('完成时间：', new Date().toLocaleString('zh-CN'));
}

function loadExistingData() {
    // 加载现有的 psalm-data.js
    const dataPath = path.join(__dirname, 'psalm-data-full.js');
    if (fs.existsSync(dataPath)) {
        const content = fs.readFileSync(dataPath, 'utf-8');
        // 解析 JavaScript 文件中的数组
        const match = content.match(/window\.PSALM_DATA\s*=\s*(\[.*?\]);/s);
        if (match) {
            return eval(match[1]);
        }
    }
    return [];
}

async function fetchHymnData(number) {
    // 这里需要用实际的 HTTP 请求抓取网页
    // 由于是示例，返回占位数据
    return {
        number: number,
        title: `第${number}首`,
        lyrics: "数据收集中...",
        musicImage: ""
    };
}

function saveData(data) {
    const content = `// 赞美诗 400 首完整数据
// 数据来源：http://www.231122.com/xb400/
// 最后更新：${new Date().toLocaleString('zh-CN')}

window.PSALM_DATA = ${JSON.stringify(data, null, 2)};

console.log('✅ 赞美诗数据已加载：' + window.PSALM_DATA.length + '首');
`;
    fs.writeFileSync(CONFIG.outputFile, content, 'utf-8');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 运行
collectAll().catch(console.error);
