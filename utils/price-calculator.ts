// 计算调整利润率后的价格
export function calculateAdjustedPrice(originalPrice: number): number {
  // 从20%利润调整至35%利润
  // 计算原始成本（不含利润）
  const originalCost = originalPrice / 1.2;

  // 计算新价格（含新利润率）
  const newPrice = originalCost * 1.35;

  return newPrice;
}
