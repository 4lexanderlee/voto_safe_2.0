// ===============================================
// File: src/router/AppRouter.tsx
// ===============================================
import { Navigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import DashboardPage from "@/pages/admin/Dashboard/DashboardPage";
import BallotsPage from "@/pages/admin/Ballots/BallotsPage";
import VotersPage from "@/pages/admin/Voters/VotersPage";
import StatisticsPage from "@/pages/admin/Statistics/StatisticsPage";
import ElectionsPage from "@/pages/admin/Elections/ElectionsPage";
import PartiesPage from "@/pages/admin/Parties/PartiesPage";
import LandingPage from "@/pages/landing/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import PartyDetailPage from "@/pages/admin/Parties/PartyDetailPage";


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
{ path: "voters", element: <VotersPage /> },
{ path: "parties", element: <PartiesPage /> },
{ path: "parties/:electionId", element: <PartyDetailPage /> },
{ path: "statistics", element: <StatisticsPage /> },
],
},
];