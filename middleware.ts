import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要登录才能访问的路径 - 保护所有路径
const PROTECTED_PATHS = ['/'];

// 管理员才能访问的路径
const ADMIN_PATHS = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否需要保护此路径
  const isProtectedPath = PROTECTED_PATHS.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // 检查是否是管理员路径
  const isAdminPath = ADMIN_PATHS.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // 如果不需要保护，直接通过
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // 获取token cookie
  const token = request.cookies.get('token')?.value;

  // 如果没有token，仍然允许访问首页，前端会显示登录模态框
  if (!token) {
    // 对于首页，允许访问，前端会显示登录模态框
    if (pathname === '/') {
      return NextResponse.next();
    }

    // 对于其他页面，重定向到首页
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 如果是管理员路径，检查是否是管理员
  if (isAdminPath && token !== 'winston') {
    // 不是管理员，重定向到首页
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 通过验证，继续访问
  return NextResponse.next();
}

// 配置中间件应用的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了:
     * - api 路由
     * - 静态文件 (如 /vercel.svg)
     * - favicon.ico
     * - 登录页面
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
