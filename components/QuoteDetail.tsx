import React from 'react';

export default function QuoteDetail({ quoteData }: { quoteData: any }) {
  return (
    <div className="p-8 bg-black text-[#ADADAD] font-['PingFang_SC']">
      <div className="text-2xl font-bold mb-6 text-center">好運氏</div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">送貨地址：</span>
          <span>{quoteData.province} {quoteData.city} {quoteData.district}</span>
        </div>
        
        <div className="space-y-2">
          <div className="font-semibold">產品明細：</div>
          {quoteData.items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between pl-4">
              <span>{item.product}</span>
              <span>× {item.quantity}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-semibold">總體積：</span>
          <span>{quoteData.totalVolume.toFixed(3)} m³</span>
        </div>
        
        {quoteData.pricePerM3 && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold">單價：</span>
            <span>{quoteData.pricePerM3} 元/m³</span>
          </div>
        )}
        
        {quoteData.pricePerM3 && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold">總價：</span>
            <span>{(quoteData.totalVolume * quoteData.pricePerM3).toFixed(2)} 元</span>
          </div>
        )}
      </div>
    </div>
  );
} 