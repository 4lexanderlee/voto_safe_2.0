// ===============================================
// File: src/router/AppRouter.tsx
// ===============================================
import { Navigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import UserLayout from "@/components/layout/UserLayout";
import DashboardPage from "@/pages/admin/Dashboard/DashboardPage";
import BallotsPage from "@/pages/admin/Ballots/BallotsPage";
import BallotDetailPage from "@/pages/admin/Ballots/BallotDetailPage";
import VotersPage from "@/pages/admin/Voters/VotersPage";
import StatisticsPage from "@/pages/admin/Statistics/StatisticsPage";
import ElectionsPage from "@/pages/admin/Elections/ElectionsPage";
import PartiesPage from "@/pages/admin/Parties/PartiesPage";
import PartyDetailPage from "@/pages/admin/Parties/PartyDetailPage";
import LandingPage from "@/pages/landing/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import UserBallotsPage from "@/pages/user/UserBallotsPage";
import UserBallotDetailPage from "@/pages/user/UserBallotDetailPage";

// Rutas exportadas para fácil acceso
export const ROUTES = {
  LANDING: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    ELECTIONS: "/admin/elections",
    BALLOTS: "/admin/ballots",
    BALLOT_DETAIL: "/admin/ballots/:electionId",
    VOTERS: "/admin/voters",
    PARTIES: "/admin/parties",
    PARTY_DETAIL: "/admin/parties/:electionId",
    STATISTICS: "/admin/statistics",
  },
  USER: {
    ROOT: "/user",
    BALLOTS: "/user/ballots",
    BALLOT_DETAIL: "/user/ballots/:electionId",
  },
} as const;

export const routes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/register",
    element: <RegisterPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "elections", element: <ElectionsPage /> },
      { path: "ballots", element: <BallotsPage /> },
      { path: "ballots/:electionId", element: <BallotDetailPage /> },
      { path: "voters", element: <VotersPage /> },
      { path: "parties", element: <PartiesPage /> },
      { path: "parties/:electionId", element: <PartyDetailPage /> },
      { path: "statistics", element: <StatisticsPage /> },
    ],
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      { index: true, element: <Navigate to="ballots" /> },
      { path: "ballots", element: <UserBallotsPage /> },
      { path: "ballots/:electionId", element: <UserBallotDetailPage /> },
    ],
  },
];