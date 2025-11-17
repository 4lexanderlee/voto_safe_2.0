// src/pages/admin/Dashboard/DashboardPage.tsx
import { useDashboardStats } from "@/hooks/useDashboardStats";
import StatCard from "@/components/dashboard/StatCard";
import VoterChartCard from "@/components/dashboard/VoterChartCard";
// Nuevas importaciones
import UpcomingElectionCard from "@/components/dashboard/UpcomingElectionCard";
import ActiveElectionAnalysisCard from "@/components/dashboard/ActiveElectionAnalysisCard";

export default function DashboardPage() {
  // El hook ahora provee 'upcomingElections' y 'activeElection'
  const { stats, loading } = useDashboardStats();

  const formatUserCount = (count: number) => {
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(1).replace('.0', '')}M`;
    }
    if (count >= 1_000) {
      return `${(count / 1_000).toFixed(1).replace('.0', '')}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Saludo */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Hola, {stats.adminName}
      </h1>

      {/* Cards de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Elecciones Vigentes"
          value={stats.activeElectionsCount}
        />
        <StatCard
          title="Total de Usuarios"
          value={stats.totalUsersCount}
          trend={`+${formatUserCount(stats.totalUsersCount)}`}
        />
        <VoterChartCard
          title="Votos vs Usuarios"
          percentage={stats.voterPercentage}
          subtitle="Del total de usuarios"
        />
      </div>

      {/* Próximas Elecciones (Ahora dinámico) */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Próximas Elecciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Renderiza las próximas elecciones. Si no hay, muestra placeholders.
          */}
          {stats.upcomingElections.length > 0 ? (
            stats.upcomingElections.map((election) => (
              <UpcomingElectionCard key={election.id} election={election} />
            ))
          ) : (
            // Mostrar placeholders si no hay elecciones próximas
            <>
              <UpcomingElectionCard election={null} />
              <UpcomingElectionCard election={null} />
              <UpcomingElectionCard election={null} />
            </>
          )}

          {/* Rellenar si hay 1 o 2 elecciones para que siempre se vean 3 tarjetas */}
          {stats.upcomingElections.length === 1 && (
            <>
              <UpcomingElectionCard election={null} />
              <UpcomingElectionCard election={null} />
            </>
          )}
          {stats.upcomingElections.length === 2 && (
            <UpcomingElectionCard election={null} />
          )}
        </div>
      </section>

      {/* Análisis por Elecciones (Ahora dinámico) */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Análisis por Elecciones
        </h2>
        {/* Renderiza la primera elección activa encontrada */}
        <ActiveElectionAnalysisCard election={stats.activeElection} />
      </section>
    </div>
  );
}