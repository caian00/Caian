import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const brlCompact = (n) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 });

const SalesCharts = ({ comparisonData, growthData }) => {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-4 text-base font-semibold text-slate-800">Março vs Abril por loja</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="loja" hide />
              <YAxis tickFormatter={brlCompact} />
              <Tooltip formatter={(value) => brlCompact(value)} />
              <Legend />
              <Bar dataKey="Março" fill="#64748b" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Abril" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-4 text-base font-semibold text-slate-800">Ranking de maior crescimento</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={brlCompact} />
              <YAxis type="category" dataKey="loja" width={130} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => brlCompact(value)} />
              <Bar dataKey="Dif_Abr_vs_Mar" fill="#16a34a" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesCharts;
