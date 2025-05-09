import { useState } from 'react';
import Layout from '../components/Layout';
import ToWherePackageModal from '../components/ToWherePackageModal';

interface QuoteData {
  province: string;
  city: string;
  district: string;
  items: Array<{ product: string; quantity: string }>;
  totalVolume: number;
  pricePerM3: number | null;
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [showPrice, setShowPrice] = useState(false);

  const handleQuoteConfirm = (data: QuoteData) => {
    setQuoteData(data);
    setModalOpen(false);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-white relative">
        {/* 整張大圖 */}
        <img
          src="/main_banner.png"
          alt="主視覺"
          className="max-w-full h-auto"
          style={{ maxHeight: '90vh' }}
        />
        {/* TO WHERE & PACKAGE 點擊區域 */}
        <button
          style={{
            position: 'absolute',
            left: '55%',
            top: '15%',
            width: '400px',
            height: '250px',
            background: 'rgba(0,0,0,0)',
            cursor: 'pointer',
            border: 'none',
            padding: 0,
            zIndex: 10,
          }}
          onClick={() => setModalOpen(true)}
          aria-label="TO WHERE & PACKAGE"
        />
        
        {/* 价格按钮 */}
        {quoteData && (
          <button
            style={{
              position: 'absolute',
              right: '15%',
              bottom: '20%',
              padding: '12px 24px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              width: '300px',
              height: '80px',
              zIndex: 20,
            }}
            onClick={() => {
              // 顯示報價
              setShowPrice(true);
              
              // 靜默記錄數據
              fetch('/api/saveQuote', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(quoteData),
              }).catch(() => {
                // 靜默處理錯誤，不顯示任何提示
              });
            }}
          >
            <span style={{ opacity: 0 }}>查看报价</span>
          </button>
        )}

        {/* 报价详情弹窗 */}
        {showPrice && quoteData && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
            }}
            onClick={() => setShowPrice(false)}
          >
            <div
              style={{
                background: 'white',
                padding: '32px',
                borderRadius: '20px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                报价详情
              </h2>
              <div style={{ marginBottom: '16px' }}>
                <p>地址：{quoteData.province} {quoteData.city} {quoteData.district}</p>
                <p>总体积：{quoteData.totalVolume.toFixed(3)} m³</p>
                <p>单价：{quoteData.pricePerM3} 元/m³</p>
                <p>总价：{(quoteData.totalVolume * (quoteData.pricePerM3 || 0)).toFixed(2)} 元</p>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
                  产品明细
                </h3>
                {quoteData.items.map((item, index) => (
                  item.product && item.quantity ? (
                    <p key={index}>
                      {item.product} × {item.quantity}
                    </p>
                  ) : null
                ))}
              </div>
              
              {/* 備註說明 */}
              <div style={{ 
                marginTop: '32px', 
                paddingTop: '24px',
                borderTop: '1px solid #E5E7EB',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#374151'
              }}>
                <p style={{ marginBottom: '16px' }}>
                  此報價適用於月發貨量 3,000-5,000 立方米的客戶專屬優惠。此報價含稅，適用於體積滿 20m³ 的訂單；未滿則加收 150 元送貨費。報價有效期為 30 天。價格不含上樓、搬運或特殊裝卸費，如有需求可另行報價。此報價僅供參考，最終以雙方簽訂之協議為準。
                </p>
                <div style={{ 
                  width: '100%', 
                  height: '1px', 
                  background: '#E5E7EB', 
                  margin: '16px 0' 
                }} />
                <div style={{ color: '#6B7280' }}>
                  <p style={{ marginBottom: '8px' }}>公司名稱：好運勢®️（東莞）百貨有限公司</p>
                  <p style={{ marginBottom: '8px' }}>支付條件：首次合作需支付全額訂金，常規客戶可享受 30 天商業信用付款期</p>
                  <p>報價編號：BILL-{new Date().getTime()}（供追蹤與對帳使用）</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 弹窗 */}
        <ToWherePackageModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleQuoteConfirm}
        />
      </div>
    </Layout>
  );
}