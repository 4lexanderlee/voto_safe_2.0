// src/router/routes.ts
export const ADMIN_ROUTES = {
  ROOT: '/admin',
  DASHBOARD: '/admin/dashboard',
  ELECTIONS: '/admin/elections',
  BALLOTS: '/admin/ballots',
  VOTERS: '/admin/voters',
  STATISTICS: '/admin/statistics',
  PARTIES: '/admin/parties',
  PARTY_DETAIL: '/admin/parties/:electionId',
} as const;