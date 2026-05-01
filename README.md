# Dashboard de Vendas Farmacêuticas

Dashboard interativo em React para análise de vendas farmacêuticas, com filtros por representante e grupo/bandeira, indicadores executivos, Top 10 lojas e gráficos em Recharts.

## Stack

- React
- Vite
- Tailwind CSS
- Recharts

## Como executar

```bash
npm install
npm run dev
```

Depois acesse a URL exibida pelo Vite.

## Estrutura

- `src/App.jsx`: app principal, filtros, cálculos e layout
- `src/data/sales.json`: dados mockados
- `src/components/MetricCard.jsx`: cards de indicadores
- `src/components/Filters.jsx`: filtros
- `src/components/TopStoresTable.jsx`: tabela Top 10
- `src/components/BarComparisonChart.jsx`: barras Março vs Abril
- `src/components/GrowthRankingChart.jsx`: ranking de crescimento
