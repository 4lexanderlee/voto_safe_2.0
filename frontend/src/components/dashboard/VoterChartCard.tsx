// src/components/dashboard/VoterChartCard.tsx
// Tarjeta para el gráfico de dona "Votos vs Usuarios"

interface VoterChartCardProps {
  title: string;
  percentage: number;
  subtitle: string;
}

export default function VoterChartCard({ title, percentage, subtitle }: VoterChartCardProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.327...
  
  // Calcula el "offset" para la parte verde. 
  // (100% = 0 offset, 0% = 251.3 offset)
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)]">
      <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Círculo de fondo (gris) */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="10"
            />
            {/* Círculo de progreso (verde) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#4ade80"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
          </svg>
          {/* Texto en el centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-800">
              {Math.round(percentage)}
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">
        {subtitle}
      </p>
    </div>
  );
}