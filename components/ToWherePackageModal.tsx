  <div className="flex items-center justify-center mb-6">
    <img src="/to where icon.png" alt="To Where Icon" className="w-8 h-8 mr-3" />
    <h2 className="modal-title">to where</h2>
  </div>

  <div style={{ display: 'flex', gap: '16px', width: '386px', marginBottom: '28px' }}>
    {/* 省市區選擇框 */}
    <div style={{ position: 'relative' }}>
      <select
        style={{
          ...selectStyle,
          width: '125.19px',
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          color: '#ADADAD'
        }}
        value={province}
        onChange={e => { setProvince(e.target.value); setCity(''); setDistrict(''); }}
      >
        <option value="">省</option>
        {provinceList.map((provinceName) => (
          <option key={provinceName} value={provinceName}>{provinceName}</option>
        ))}
      </select>
    </div>
    {/* ... existing code ... */}
  </div>

  <div className="flex items-center justify-center mb-6">
    <img src="/package icon.png" alt="Package Icon" className="w-8 h-8 mr-3" />
    <h2 className="modal-title">package</h2>
  </div>

  <div style={{ width: '386px', marginBottom: '24px' }}>
    {items.map((item, index) => (
      <div key={index} style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '16px',
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      }}>
        {/* ... existing code ... */}
      </div>
    ))}
  </div>

  <div style={{
    width: '335.58px',
    marginTop: '12px',
    marginBottom: '24px',
    color: '#ADADAD',
    fontSize: '21.1px',
    fontWeight: 'bold',
    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
  }}>
    重量：{totalVolume ? totalVolume.toFixed(3) + ' m³' : ''}
  </div> 