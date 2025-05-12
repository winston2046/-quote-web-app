const fs = require('fs');
const path = require('path');

// 读取原始价格文件
const pricePath = path.join(__dirname, 'public', 'price_table.json');
const pricesData = JSON.parse(fs.readFileSync(pricePath, 'utf8'));

// 计算调整系数
// 原来是 basePrice * 1.25，现在要变成 basePrice * 1.20
// 所以新价格 = 旧价格 * (1.20/1.25) = 旧价格 * 0.96
const adjustmentFactor = 1.20 / 1.25; // 0.96

// 调整价格
const adjustedPrices = pricesData.map(item => {
  // 计算新价格并保留两位小数
  const newPrice = Math.round(item.price * adjustmentFactor * 100) / 100;
  return {
    ...item,
    price: newPrice
  };
});

// 写入调整后的价格文件
fs.writeFileSync(pricePath, JSON.stringify(adjustedPrices, null, 2), 'utf8');

// 同时更新price_data.json (因为它们是相同的)
const priceDataPath = path.join(__dirname, 'public', 'price_data.json');
fs.writeFileSync(priceDataPath, JSON.stringify(adjustedPrices, null, 2), 'utf8');

console.log('价格调整完成，已将增加率从25%降低到20%'); 