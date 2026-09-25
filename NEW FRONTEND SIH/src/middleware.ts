import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // -------------------------------------------------------------
  // Canonical URL Aliases & Redirects for Citizen Portal
  // -------------------------------------------------------------
  if (pathname === '/citizen/dashboard' || pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/citizen', request.url));
  }
  if (pathname === '/citizen/report-problem' || pathname === '/report-problem') {
    return NextResponse.redirect(new URL('/citizen/report', request.url));
  }
  if (pathname === '/citizen/my-issues' || pathname === '/my-issues') {
    return NextResponse.redirect(new URL('/citizen/issues', request.url));
  }
  if (pathname.startsWith('/citizen/my-issues/')) {
    const subId = pathname.replace('/citizen/my-issues/', '');
    return NextResponse.redirect(new URL(`/citizen/issues/${subId}`, request.url));
  }
  if (pathname === '/citizen/track-issues' || pathname === '/track-issues') {
    return NextResponse.redirect(new URL('/citizen/track', request.url));
  }
  if (pathname === '/citizen/help-faq' || pathname === '/citizen/faq') {
    return NextResponse.redirect(new URL('/citizen/help', request.url));
  }

  // -------------------------------------------------------------
  // Role Guard for Citizen Portal
  // -------------------------------------------------------------
  const isCitizenRoute = pathname.startsWith('/citizen');
  if (isCitizenRoute) {
    const rawRole = request.cookies.get('social_x_user_role')?.value;
    const sessionToken = request.cookies.get('social_x_session')?.value;
    const role = rawRole?.toLowerCase();

    // If no session and no role cookie -> unauthenticated
    if (!sessionToken && !role) {
      const loginUrl = new URL('/login/citizen', request.url);
      loginUrl.searchParams.set('error', 'citizen_access_required');
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role check: Only citizen or super_admin are authorized
    if (role && role !== 'citizen' && role !== 'super_admin') {
      return new NextResponse('Forbidden: Citizen access required', { status: 403 });
    }
  }

  // -------------------------------------------------------------
  // Role Guard for Government Portal
  // -------------------------------------------------------------
  const isGovRoute = pathname.startsWith('/government');
  if (isGovRoute) {
    const govRole = request.cookies.get('social_x_government_role')?.value;
    if (!govRole) {
      const loginUrl = new URL('/official-login', request.url);
      loginUrl.searchParams.set('error', 'officer_access_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  // -------------------------------------------------------------
  // Role Guard for University Portal
  // -------------------------------------------------------------
  const isUniversityRoute = pathname.startsWith('/university');
  if (isUniversityRoute) {
    const rawRoleCookie = request.cookies.get('social_x_university_role')?.value;
    const roleCookie = rawRoleCookie?.toLowerCase();
    const isFacultyRoute = pathname.startsWith('/university/faculty');
    const isStudentRoute = pathname.startsWith('/university/student');

    if (isFacultyRoute) {
      if (roleCookie !== 'faculty') {
        if (roleCookie) {
          return new NextResponse('Forbidden: Faculty access required', { status: 403 });
        }
        const loginUrl = new URL('/university-login', request.url);
        loginUrl.searchParams.set('error', 'faculty_access_required');
        return NextResponse.redirect(loginUrl);
      }
    } else if (isStudentRoute) {
      if (roleCookie !== 'student') {
        if (roleCookie) {
          return new NextResponse('Forbidden: Student access required', { status: 403 });
        }
        const loginUrl = new URL('/university-login', request.url);
        loginUrl.searchParams.set('error', 'student_access_required');
        return NextResponse.redirect(loginUrl);
      }
    } else {
      if (roleCookie !== 'faculty' && roleCookie !== 'student') {
        const loginUrl = new URL('/university-login', request.url);
        loginUrl.searchParams.set('error', 'university_access_required');
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // -------------------------------------------------------------
  // Role Guard for Industry Portal
  // -------------------------------------------------------------
  const isIndustryRoute = pathname.startsWith('/industry');
  if (isIndustryRoute) {
    const industryRole = request.cookies.get('social_x_industry_role')?.value;
    if (!industryRole) {
      const loginUrl = new URL('/login/industry', request.url);
      loginUrl.searchParams.set('error', 'industry_access_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  // -------------------------------------------------------------
  // Role Guard for NGO Portal
  // -------------------------------------------------------------
  const isNgoRoute = pathname.startsWith('/ngo');
  if (isNgoRoute) {
    const ngoRole = request.cookies.get('social_x_ngo_role')?.value;
    if (!ngoRole) {
      const loginUrl = new URL('/login/ngo', request.url);
      loginUrl.searchParams.set('error', 'ngo_access_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  // -------------------------------------------------------------
  // Role Guard for Research Organization Portal
  // -------------------------------------------------------------
  const isResearchRoute = pathname.startsWith('/research');
  if (isResearchRoute) {
    const researchRole = request.cookies.get('social_x_research_role')?.value;
    if (!researchRole) {
      const loginUrl = new URL('/login/research', request.url);
      loginUrl.searchParams.set('error', 'research_access_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  // -------------------------------------------------------------
  // Role Guard for Super Admin Portal
  // -------------------------------------------------------------
  const isAdminRoute = pathname.startsWith('/admin');
  if (isAdminRoute) {
    const adminRole = request.cookies.get('social_x_admin_role')?.value;
    if (!adminRole) {
      const loginUrl = new URL('/login/admin', request.url);
      loginUrl.searchParams.set('error', 'admin_access_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/citizen/:path*',
    '/dashboard',
    '/report-problem',
    '/my-issues',
    '/track-issues',
    '/government/:path*',
    '/university/:path*',
    '/industry/:path*',
    '/ngo/:path*',
    '/research/:path*',
    '/admin/:path*',
  ],
};
