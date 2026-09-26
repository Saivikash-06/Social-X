// scripts/verify_citizen_portal.mjs
const BASE_URL = 'http://localhost:3000';

async function testRoute(name, path, headers = {}, expectStatus = 200) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers,
      redirect: 'manual'
    });
    const status = res.status;
    const ok = Array.isArray(expectStatus) ? expectStatus.includes(status) : status === expectStatus;
    const loc = res.headers.get('location') || '';
    console.log(`[${ok ? 'PASS' : 'FAIL'}] ${name} (${path}) => HTTP ${status} ${loc ? `-> ${loc}` : ''}`);
    return ok;
  } catch (err) {
    console.error(`[ERROR] ${name} (${path}) =>`, err.message);
    return false;
  }
}

async function run() {
  console.log('=== VERIFYING CITIZEN PORTAL ROUTES (PHASE 1) ===\n');
  const authHeaders = {
    'Cookie': 'social_x_session=jwt-usr-cit-01; social_x_user_role=citizen'
  };

  let allPassed = true;

  // 1. Sidebar Nav Items (Canonical)
  const canonicalRoutes = [
    ['Dashboard (Canonical)', '/citizen'],
    ['Report Problem (Canonical)', '/citizen/report'],
    ['My Issues (Canonical)', '/citizen/issues'],
    ['Track Issues (Canonical)', '/citizen/track'],
    ['Notifications', '/citizen/notifications'],
    ['Profile', '/citizen/profile'],
    ['Settings', '/citizen/settings'],
    ['Help', '/citizen/help']
  ];

  for (const [name, path] of canonicalRoutes) {
    const ok = await testRoute(name, path, authHeaders, 200);
    if (!ok) allPassed = false;
  }

  console.log('\n--- Checking URL Aliases & Fallbacks (Zero 404 guarantee) ---');
  const aliasRoutes = [
    ['Citizen Dashboard Alias', '/citizen/dashboard', [200, 307, 308]],
    ['Report Problem Alias', '/citizen/report-problem', [200, 307, 308]],
    ['My Issues Alias', '/citizen/my-issues', [200, 307, 308]],
    ['Track Issues Alias', '/citizen/track-issues', [200, 307, 308]]
  ];

  for (const [name, path, status] of aliasRoutes) {
    const ok = await testRoute(name, path, authHeaders, status);
    if (!ok) allPassed = false;
  }

  console.log('\n--- Checking Root Aliases Redirection ---');
  const rootAliases = [
    ['Root /dashboard', '/dashboard', [302, 307, 308]],
    ['Root /report-problem', '/report-problem', [302, 307, 308]],
    ['Root /my-issues', '/my-issues', [302, 307, 308]],
    ['Root /track-issues', '/track-issues', [302, 307, 308]]
  ];

  for (const [name, path, status] of rootAliases) {
    const ok = await testRoute(name, path, authHeaders, status);
    if (!ok) allPassed = false;
  }

  console.log('\n--- Checking Middleware & Role Guard ---');
  // Unauthenticated user should be redirected to /login/citizen
  const unauthOk = await testRoute('Unauthenticated Access to /citizen', '/citizen', {}, [302, 307]);
  if (!unauthOk) allPassed = false;

  // Unauthorized role (e.g. government officer accessing /citizen) should get 403 Forbidden
  const wrongRoleHeaders = {
    'Cookie': 'social_x_session=jwt-usr-gov-01; social_x_user_role=government'
  };
  const unauthRoleOk = await testRoute('Unauthorized Role access to /citizen', '/citizen', wrongRoleHeaders, 403);
  if (!unauthRoleOk) allPassed = false;

  console.log('\n--- Checking Citizen & Upload APIs ---');
  const apiIssuesOk = await testRoute('Citizen Issues API GET', '/api/citizen/issues', authHeaders, 200);
  if (!apiIssuesOk) allPassed = false;

  console.log(`\n========================================`);
  console.log(`PHASE 1 CITIZEN AUDIT RESULT: ${allPassed ? 'ALL TESTS PASSED ✓' : 'SOME TESTS FAILED ✗'}`);
  console.log(`========================================`);
  process.exit(allPassed ? 0 : 1);
}

run();
