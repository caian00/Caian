import { useMemo, useState } from 'react';
import MetricCard from './components/MetricCard';
import Filters from './components/Filters';
import SalesTable from './components/SalesTable';
import SalesCharts from './components/SalesCharts';
import rawData from './data/vendas.json';

const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function App() {
  const representantes = useMemo(() => ['Todos', ...new Set(rawData.map((r) => r.Representante))], []);
  const grupos = useMemo(() => ['Todos', ...new Set(rawData.map((r) => r.Grupo_Bandeira))], []);

  const [selectedRep, setSelectedRep] = useState('Todos');
  const [selectedGroup, setSelectedGroup] = useState('Todos');

  const filteredData = useMemo(
    () =>
      rawData.filter(
        (row) =>
          (selectedRep === 'Todos' || row.Representante === selectedRep) &&
          (selectedGroup === 'Todos' || row.Grupo_Bandeira === selectedGroup)
      ),
    [selectedGroup, selectedRep]
  );

  const top10 = useMemo(() => [...filteredData].sort((a, b) => b.Abril - a.Abril).slice(0, 10), [filteredData]);

  const totals = useMemo(() => {
    const marco = filteredData.reduce((acc, row) => acc + row.Março, 0);
    const abril = filteredData.reduce((acc, row) => acc + row.Abril, 0);
    const diff = abril - marco;
    const growth = marco ? (diff / marco) * 100 : 0;
    return { marco, abril, diff, growth };
  }, [filteredData]);

  const comparisonData = top10.map((row) => ({ loja: row.CNPJ.slice(-4), Março: row.Março, Abril: row.Abril }));
  const growthData = [...top10]
    .sort((a, b) => b.Dif_Abr_vs_Mar - a.Dif_Abr_vs_Mar)
    .map((row) => ({ loja: row.CNPJ.slice(-4), Dif_Abr_vs_Mar: row.Dif_Abr_vs_Mar }));

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Dashboard de Vendas Farmacêuticas</h1>
          <p className="text-slate-600">Top 10 lojas, evolução Março vs Abril e prioridades comerciais para Maio.</p>
        </header>

        <Filters
          representantes={representantes}
          grupos={grupos}
          selectedRep={selectedRep}
          selectedGroup={selectedGroup}
          onRepChange={setSelectedRep}
          onGroupChange={setSelectedGroup}
        />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Março" value={brl(totals.marco)} />
          <MetricCard title="Total Abril" value={brl(totals.abril)} />
          <MetricCard title="Diferença absoluta" value={brl(totals.diff)} tone={totals.diff >= 0 ? 'positive' : 'negative'} />
          <MetricCard
            title="Crescimento %"
            value={`${totals.growth.toFixed(2)}%`}
            tone={totals.growth >= 0 ? 'positive' : 'negative'}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800">Top 10 lojas por desempenho em Abril</h2>
          <SalesTable rows={top10} />
        </section>

        <SalesCharts comparisonData={comparisonData} growthData={growthData} />
      </div>
    </main>
  );
}

export default App;
