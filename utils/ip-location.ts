/**
 * IP地理位置查询工具
 * 使用免费的IP.SB API获取IP地址的地理位置信息
 */

interface IPLocation {
  country: string;
  region: string;
  city: string;
  isp: string;
  asn: number;
  asn_organization: string;
  latitude: number;
  longitude: number;
  timezone: string;
  organization: string;
}

/**
 * 查询IP地址的地理位置
 * @param ip IP地址
 * @returns 地理位置信息，如果查询失败则返回null
 */
export async function getIPLocation(ip: string): Promise<IPLocation | null> {
  // 如果是本地IP地址，直接返回本地信息
  if (ip === '127.0.0.1' || ip === 'localhost' || ip === '::1' || !ip) {
    return {
      country: '本地',
      region: '本地',
      city: '本地',
      isp: '本地网络',
      asn: 0,
      asn_organization: '本地网络',
      latitude: 0,
      longitude: 0,
      timezone: 'Asia/Shanghai',
      organization: '本地网络'
    };
  }

  try {
    // 使用IP.SB的免费API
    const response = await fetch(`https://api.ip.sb/geoip/${ip}`);
    
    if (!response.ok) {
      console.error(`IP查询失败: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    return data as IPLocation;
  } catch (error) {
    console.error('IP地理位置查询出错:', error);
    return null;
  }
}

/**
 * 格式化IP地理位置信息为简短的字符串
 * @param location IP地理位置信息
 * @returns 格式化后的字符串，例如: "中国 广东省 深圳市 (电信)"
 */
export function formatIPLocation(location: IPLocation | null): string {
  if (!location) {
    return '未知位置';
  }
  
  if (location.country === '本地') {
    return '本地网络';
  }
  
  return `${location.country} ${location.region} ${location.city} (${location.isp || '未知ISP'})`;
}
