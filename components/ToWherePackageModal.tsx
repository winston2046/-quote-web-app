import React, { useState, useEffect } from 'react';

const productOptions = [
  { label: '120*200*28', value: '120*200*28', volume: 0.672 },
  { label: '135*200*28', value: '135*200*28', volume: 0.756 },
  { label: '150*200*28', value: '150*200*28', volume: 0.84 },
  { label: '180*200*28', value: '180*200*28', volume: 1.008 },
  { label: '200*200*28', value: '200*200*28', volume: 1.12 },
];

// select 和 input 樣式
const selectStyle: React.CSSProperties = {
  height: '40.27px',
  background: '#161616',
  border: '0.21px solid #838383',
  borderRadius: '48.52px',
  fontFamily: 'Inter',
  fontWeight: 400,
  fontSize: '24.27px',
  color: '#fff',
  textAlign: 'left',
  outline: 'none',
  appearance: 'none',
  boxSizing: 'border-box',
  paddingLeft: '18.4px',
  paddingRight: '40.25px',
  display: 'block',
  position: 'relative',
  zIndex: 2,
};

const quantityStyle: React.CSSProperties = {
  ...selectStyle,
  textAlign: 'center',
  paddingLeft: '0px',
  paddingRight: '35px',
  WebkitAppearance: 'none',
  MozAppearance: 'textfield'
};

// 箭頭圖標樣式
const arrowIconStyle: React.CSSProperties = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '16px',
  height: '16px',
  pointerEvents: 'none',
};

export default function ToWherePackageModal({
  open,
  onClose,
  onConfirm
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { province: string; city: string; district: string; items: any[]; totalVolume: number; pricePerM3: number | null }) => void;
}) {
  // 省市區資料
  const [provinceData, setProvinceData] = useState<any>({});
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [items, setItems] = useState([{ product: '', quantity: '' }]);
  const maxItems = 5;
  const [priceData, setPriceData] = useState<any[]>([]);

  // 讀取省市區資料
  useEffect(() => {
    fetch('/province_city_area.json')
      .then(res => res.json())
      .then(data => {
        setProvinceData(data);
      });
  }, []);

  useEffect(() => {
    fetch('/price_data.json')
      .then(res => res.json())
      .then(data => setPriceData(data));
  }, []);

  // 聯動
  const provinceList = Object.keys(provinceData);
  const cityList = province ? Object.keys(provinceData[province] || {}) : [];
  const districtList = (province && city) ? (provinceData[province][city] || []) : [];

  // 體積計算
  const totalVolume = items.reduce((sum, item) => {
    const prod = productOptions.find((p) => p.value === item.product);
    return sum + (prod ? prod.volume * (Number(item.quantity) || 0) : 0);
  }, 0);

  // 自動新增行
  useEffect(() => {
    const last = items[items.length - 1];
    if (
      items.length < maxItems &&
      last.product &&
      last.quantity &&
      items.filter(i => !i.product || !i.quantity).length === 0
    ) {
      setItems([...items, { product: '', quantity: '' }]);
    }
  }, [items]);

  // 確認報價
  const handleConfirm = async () => {
    if (!province || !city || !district) {
      alert('請選擇完整的地址信息');
      return;
    }
    
    if (items.length === 1 && (!items[0].product || !items[0].quantity)) {
      alert('請至少添加一個產品');
      return;
    }

    onConfirm({
      province,
      city,
      district,
      items,
      totalVolume,
      pricePerM3: getPrice()
    });
  };

  function getPrice() {
    let found = priceData.find(
      (item) =>
        item.province === province &&
        item.city === city &&
        item.district === district
    );
    if (!found) {
      found = priceData.find(
        (item) =>
          item.province === province &&
          item.city === city &&
          (!item.district || item.district === "")
      );
    }
    if (!found) {
      found = priceData.find(
        (item) =>
          item.province === province &&
          (!item.city || item.city === "") &&
          (!item.district || item.district === "")
      );
    }
    return found ? (found.price || found["價格"]) : null;
  }

  const pricePerM3 = getPrice();
  const totalPrice = pricePerM3 ? pricePerM3 * totalVolume : null;

  if (!open) return null;

  return (
    <div
      style={{
        position: 'absolute',
        width: '459.52px',
        minHeight: '405.65px',
        background: '#000000',
        borderRadius: '48.52px',
        boxSizing: 'border-box',
        padding: '36.8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        top: '5%',
        right: '15%',
        zIndex: 1000,
      }}
    >
      {/* 關閉按鈕 */}
      <button
        style={{
          position: 'absolute',
          right: '28.75px',
          top: '18.4px',
          width: '33.97px',
          height: '33.97px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          zIndex: 10,
        }}
        onClick={onClose}
      >
        <span
          style={{
            display: 'block',
            width: '33.97px',
            height: '33.97px',
            borderRadius: '50%',
            background: '#fff',
            color: '#000',
            fontSize: '27.6px',
            textAlign: 'center',
            lineHeight: '33.97px',
          }}
        >
          ×
        </span>
      </button>

      {/* TO WEHRE 標題 */}
      <div
        style={{
          position: 'relative',
          width: '335.58px',
          marginBottom: '18.4px',
          marginTop: '9.2px',
        }}
      >
        <img 
          src="/to where icon.png" 
          alt="To Where Icon" 
          style={{
            position: 'absolute',
            left: '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '29.54px',
            height: '29.54px',
          }}
        />
        <div
          style={{
            fontFamily: 'Luckiest Guy',
            fontWeight: 400,
            fontSize: '38.82px',
            lineHeight: '110%',
            color: '#fff',
            textAlign: 'center',
            width: '100%',
          }}
        >
          TO WEHRE
        </div>
      </div>

      {/* 省市區 */}
      <div style={{ display: 'flex', gap: '13.8px', width: '386px', marginBottom: '23px' }}>
        <div style={{ position: 'relative' }}>
          <select
            style={{ ...selectStyle, width: '125.19px' }}
            value={province}
            onChange={e => { setProvince(e.target.value); setCity(''); setDistrict(''); }}
          >
            <option value="">省</option>
            {provinceList.map((provinceName) => (
              <option key={provinceName} value={provinceName}>{provinceName}</option>
            ))}
          </select>
          <svg style={{
            ...arrowIconStyle,
            width: '18.4px',
            height: '18.4px',
            zIndex: 1,
          }} viewBox="0 0 24 24" fill="none">
            <path 
              d="M7 10L12 15L17 10" 
              stroke="white" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div style={{ position: 'relative' }}>
          <select
            style={{ ...selectStyle, width: '125.19px' }}
            value={city}
            onChange={e => { setCity(e.target.value); setDistrict(''); }}
            disabled={!province}
          >
            <option value="">市</option>
            {cityList.map((cityName) => (
              <option key={cityName} value={cityName}>{cityName}</option>
            ))}
          </select>
          <svg style={{
            ...arrowIconStyle,
            width: '18.4px',
            height: '18.4px',
            zIndex: 1,
          }} viewBox="0 0 24 24" fill="none">
            <path 
              d="M7 10L12 15L17 10" 
              stroke="white" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div style={{ position: 'relative' }}>
          <select
            style={{ ...selectStyle, width: '125.19px' }}
            value={district}
            onChange={e => setDistrict(e.target.value)}
            disabled={!city}
          >
            <option value="">區</option>
            {districtList.map((districtName: string) => (
              <option key={districtName} value={districtName}>{districtName}</option>
            ))}
          </select>
          <svg style={{
            ...arrowIconStyle,
            width: '18.4px',
            height: '18.4px',
            zIndex: 1,
          }} viewBox="0 0 24 24" fill="none">
            <path 
              d="M7 10L12 15L17 10" 
              stroke="white" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* PACKAGE 標題 */}
      <div
        style={{
          position: 'relative',
          width: '335.58px',
          marginTop: '0px',
          marginBottom: '18.4px',
        }}
      >
        <img 
          src="/package icon.png" 
          alt="Package Icon" 
          style={{
            position: 'absolute',
            left: '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '29.54px',
            height: '29.54px',
          }}
        />
        <div
          style={{
            fontFamily: 'Luckiest Guy',
            fontWeight: 400,
            fontSize: '38.82px',
            lineHeight: '110%',
            color: '#fff',
            textAlign: 'center',
            width: '100%',
          }}
        >
          PACKAGE
        </div>
      </div>

      {/* 產品列表 */}
      <div style={{ width: '386px' }}>
        {items.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            gap: '13.8px', 
            marginBottom: '13.8px',
          }}>
            <div style={{ position: 'relative' }}>
              <select
                style={{ 
                  ...selectStyle, 
                  width: '264.34px'
                }}
                value={item.product}
                onChange={e => {
                  const newItems = [...items];
                  newItems[index] = { ...item, product: e.target.value };
                  setItems(newItems);
                }}
              >
                <option value="">產品</option>
                {productOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <svg style={{
                ...arrowIconStyle,
                width: '18.4px',
                height: '18.4px',
                zIndex: 1,
              }} viewBox="0 0 24 24" fill="none">
                <path 
                  d="M7 10L12 15L17 10" 
                  stroke="white" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                style={{ 
                  ...quantityStyle, 
                  width: '125.19px',
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                }}
                value={item.quantity}
                onChange={e => {
                  const newValue = e.target.value.replace(/[^0-9]/g, '');
                  const newItems = [...items];
                  newItems[index] = { ...item, quantity: newValue };
                  setItems(newItems);
                }}
                placeholder="數量"
              />
              <svg style={{
                ...arrowIconStyle,
                width: '18.4px',
                height: '18.4px',
                zIndex: 1,
              }} viewBox="0 0 24 24" fill="none">
                <path 
                  d="M7 10L12 15L17 10" 
                  stroke="white" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* 重量顯示 */}
      <div style={{
        width: '335.58px',
        marginTop: '8px',
        marginBottom: '16px',
        color: '#fff',
        fontSize: '21.1px',
        fontWeight: 'bold',
      }}>
        重量：{totalVolume ? totalVolume.toFixed(3) + ' m³' : ''}
      </div>

      {/* 確認按鈕 */}
      <div style={{ 
        width: '386px', 
        display: 'flex', 
        justifyContent: 'flex-end',
        marginTop: 'auto',
        paddingBottom: '16px'
      }}>
        <button
          onClick={handleConfirm}
          style={{
            width: '125.19px',
            height: '40.27px',
            background: '#7C3AED',
            borderRadius: '48.52px',
            border: 'none',
            color: '#fff',
            fontSize: '24.27px',
            fontWeight: 'bold',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          確認
        </button>
      </div>

      {/* 透明查看報價按鈕 */}
      <button
        onClick={handleConfirm}
        style={{
          position: 'fixed',
          right: '15%',
          bottom: '15%',
          width: '200px',
          height: '60px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1001
        }}
      >
        <span style={{ opacity: 0 }}>查看報價</span>
      </button>
    </div>
  );
}