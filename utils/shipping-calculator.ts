// 韵达快递价格计算函数
export function calculateYundaPrice(product: string, destination: string, quantity: number) {
  // 枕头体积和重量映射
  const productMap: Record<string, { volume: number, dimensions: number[] }> = {
    '80×60.5×48': { volume: 0.232, dimensions: [80, 60.5, 48] },
    '86*65*38': { volume: 0.212, dimensions: [86, 65, 38] },
  };

  // 默认值，以防没有匹配
  const { volume = 0.212, dimensions = [86, 65, 38] } = productMap[product] || {};

  // 从韵达价格表中获取价格
  const yundaPricing = getYundaPricing();

  // 获取目的地的价格，如果没有则使用默认值
  const pricing = yundaPricing.find(item => item.省份 === destination) ||
                 yundaPricing.find(item => item.省份 === '广东省'); // 默认使用广东省的价格

  if (!pricing) {
    return {
      totalYundaPrice: 0,
      yundaPricePerItem: 0
    };
  }

  // 韵达快递计费规则：
  // 1. 抛比为8000，计算体积重 = 长(cm) * 宽(cm) * 高(cm) / 8000
  // 2. 首重为10kg，超过部分按续重计算

  // 计算单个产品的体积重量（抛比8000）
  const volumeWeight = (dimensions[0] * dimensions[1] * dimensions[2]) / 8000;

  // 向上取整到整数公斤
  const chargeWeight = Math.ceil(volumeWeight);

  // 计算单个产品的快递费
  const singleItemPrice = pricing.首重 + Math.max(0, chargeWeight - 10) * pricing.续重;

  // 计算总价
  const yundaPrice = singleItemPrice * quantity;

  // 计算单件商品的价格
  const yundaPricePerItem = singleItemPrice;

  return {
    totalYundaPrice: yundaPrice,
    yundaPricePerItem: yundaPricePerItem
  };
}

// 顺丰快递价格计算函数
export function calculateSFPrice(product: string, destination: string, quantity: number) {
  // 床垫体积和重量映射
  const productMap: Record<string, { volume: number, weight: number }> = {
    '120*200*28': { volume: 0.672, weight: 20 },
    '135*200*28': { volume: 0.756, weight: 24 },
    '150*200*28': { volume: 0.84, weight: 28 },
    '180*200*28': { volume: 1.008, weight: 35 },
    '200*200*28': { volume: 1.12, weight: 40 },
  };

  // 默认值，以防没有匹配
  const { volume = 0.672, weight = 20 } = productMap[product] || {};

  // 计算体积重量
  const volumeWeight = Math.ceil(volume * 12000 / 1000) * 1000; // 轻抛系数12000

  // 不同地区首重和续重价格
  const regionPricing: Record<string, { firstWeight: number, additionalWeight: number }> = {
    '广东省': { firstWeight: 37, additionalWeight: 1.5 },
    '北京': { firstWeight: 50, additionalWeight: 2.2 },
    '上海': { firstWeight: 50, additionalWeight: 2.2 },
    '浙江省': { firstWeight: 50, additionalWeight: 2.2 },
    '江苏省': { firstWeight: 50, additionalWeight: 2.2 },
    '福建省': { firstWeight: 50, additionalWeight: 2.2 },
    '广西壮族自治区': { firstWeight: 50, additionalWeight: 2.2 },
    '海南省': { firstWeight: 50, additionalWeight: 2.2 },
    '湖南省': { firstWeight: 50, additionalWeight: 2.2 },
    '安徽省': { firstWeight: 50, additionalWeight: 2.2 },
    '贵州省': { firstWeight: 50, additionalWeight: 2.2 },
    '湖北省': { firstWeight: 50, additionalWeight: 2.2 },
    '四川省': { firstWeight: 50, additionalWeight: 2.2 },
    '重庆': { firstWeight: 50, additionalWeight: 2.2 },
    '甘肃省': { firstWeight: 75, additionalWeight: 3.5 },
    '黑龙江省': { firstWeight: 75, additionalWeight: 3.5 },
    '吉林省': { firstWeight: 75, additionalWeight: 3.5 },
    '内蒙古自治区': { firstWeight: 75, additionalWeight: 3.5 },
    '宁夏回族自治区': { firstWeight: 75, additionalWeight: 3.5 },
    '青海省': { firstWeight: 75, additionalWeight: 3.5 },
    '新疆维吾尔自治区': { firstWeight: 164, additionalWeight: 8 },
    // 默认价格，如果省份未列出
    'default': { firstWeight: 50, additionalWeight: 2.2 }
  };

  // 获取目的地的价格，如果没有则使用默认值
  const { firstWeight, additionalWeight } = regionPricing[destination] || regionPricing['default'];

  // 计算实际计费重量（取体积重量和实际重量的较大值）
  const chargingWeight = Math.max(weight, Math.ceil(volumeWeight / 1000));

  // 计算快递费
  const sfPrice = firstWeight + Math.max(0, chargingWeight - 20) * additionalWeight;

  // 计算单件商品的平均价格
  const sfPricePerItem = sfPrice / quantity;

  return {
    totalSfPrice: sfPrice,
    sfPricePerItem: sfPricePerItem
  };
}

// 获取韵达价格表
function getYundaPricing() {
  // 这里应该从服务器获取价格表，但为了简化，我们直接返回一个硬编码的价格表
  return [
    { "省份": "广东省", "首重": 13.2, "续重": 1.2 },
    { "省份": "上海", "首重": 13.2, "续重": 1.2 },
    { "省份": "浙江省", "首重": 13.2, "续重": 1.2 },
    { "省份": "江苏省", "首重": 13.2, "续重": 1.2 },
    { "省份": "安徽省", "首重": 13.2, "续重": 1.2 },
    { "省份": "江西省", "首重": 13.2, "续重": 1.2 },
    { "省份": "福建省", "首重": 13.2, "续重": 1.2 },
    { "省份": "北京", "首重": 13.2, "续重": 1.2 },
    { "省份": "天津", "首重": 13.2, "续重": 1.2 },
    { "省份": "河北省", "首重": 13.2, "续重": 1.2 },
    { "省份": "山西省", "首重": 13.2, "续重": 1.2 },
    { "省份": "广西壮族自治区", "首重": 13.2, "续重": 1.2 },
    { "省份": "海南省", "首重": 13.2, "续重": 1.2 },
    { "省份": "湖北省", "首重": 13.2, "续重": 1.2 },
    { "省份": "湖南省", "首重": 13.2, "续重": 1.2 },
    { "省份": "河南省", "首重": 13.2, "续重": 1.2 },
    { "省份": "山东省", "首重": 13.2, "续重": 1.2 },
    { "省份": "四川省", "首重": 13.2, "续重": 1.2 },
    { "省份": "云南省", "首重": 13.2, "续重": 1.2 },
    { "省份": "贵州省", "首重": 13.2, "续重": 1.2 },
    { "省份": "陕西省", "首重": 13.2, "续重": 1.2 },
    { "省份": "重庆", "首重": 13.2, "续重": 1.2 },
    { "省份": "黑龙江省", "首重": 15.6, "续重": 1.8 },
    { "省份": "吉林省", "首重": 15.6, "续重": 1.8 },
    { "省份": "辽宁省", "首重": 15.6, "续重": 1.8 },
    { "省份": "青海省", "首重": 18.0, "续重": 3.6 },
    { "省份": "甘肃省", "首重": 18.0, "续重": 3.6 },
    { "省份": "宁夏回族自治区", "首重": 18.0, "续重": 3.6 },
    { "省份": "内蒙古自治区", "首重": 18.0, "续重": 3.6 },
    { "省份": "新疆维吾尔自治区", "首重": 33.6, "续重": 6.0 },
    { "省份": "西藏自治区", "首重": 33.6, "续重": 9.6 }
  ];
}

// 判断产品是否是枕头
export function isPillow(product: string): boolean {
  // 检查产品编号是否是枕头产品
  return product === '80×60.5×48' || product === '86*65*38';
}

// 定义统一的运输价格返回类型
export interface ShippingPrice {
  totalPrice: number;
  pricePerItem: number;
  courier: 'yunda' | 'sf';
}

// 计算运输价格（根据产品类型选择不同的快递方式）
export function calculateShippingPrice(product: string, destination: string, quantity: number): ShippingPrice {
  if (isPillow(product)) {
    const { totalYundaPrice, yundaPricePerItem } = calculateYundaPrice(product, destination, quantity);
    return {
      totalPrice: totalYundaPrice,
      pricePerItem: yundaPricePerItem,
      courier: 'yunda'
    };
  } else {
    const { totalSfPrice, sfPricePerItem } = calculateSFPrice(product, destination, quantity);
    return {
      totalPrice: totalSfPrice,
      pricePerItem: sfPricePerItem,
      courier: 'sf'
    };
  }
}
