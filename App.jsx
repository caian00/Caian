import { useEffect, useMemo, useState } from "react";
import salesData from "./data/sales.json";
import BarComparisonChart from "./components/BarComparisonChart";
import Filters from "./components/Filters";
import GrowthRankingChart from "./components/GrowthRankingChart";
import MetricCard from "./components/MetricCard";
import TopStoresTable from "./components/TopStoresTable";
import {
  formatCurrency,
  formatPercent,
  getStoreLabel
} from "./utils/formatters";

function sortByAprilDesc(a, b) {
  return b.Abril - a.Abril;
}

function aggregateStores(rows, selectedProduct) {
  const stores = new Map();

  rows.forEach((item) => {
    const key = `${item.CNPJ}|${item.Endereço}|${item.Grupo_Bandeira}`;
    const current =
      stores.get(key) ||
      {
        Representante: item.Representante,
        Produto: "",
        Grupo_Bandeira: item.Grupo_Bandeira,
        CNPJ: item.CNPJ,
        Endereço: item.Endereço,
        Março: 0,
        Abril: 0,
        Dif_Abr_vs_Mar: 0,
        produtos: new Set()
      };

    current.Março += item.Março;
    current.Abril += item.Abril;
    current.Dif_Abr_vs_Mar += item.Dif_Abr_vs_Mar;
    current.produtos.add(item.Produto);
    stores.set(key, current);
  });

  return [...stores.values()].map((store) => {
    const products = [...store.produtos].sort();
    const productLabel =
      products.length === 1
        ? products[0]
        : selectedProduct === "Todos"
          ? `${products.length} produtos`
          : selectedProduct;

    return {
      ...store,
      Produto: productLabel,
      produtos: products
    };
  });
}

export default function App() {
  const [selectedRepresentative, setSelectedRepresentative] = useState("Todos");
  const [selectedGroup, setSelectedGroup] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState("Todos");

  const representatives = useMemo(
    () => [...new Set(salesData.map((item) => item.Representante))].sort(),
    []
  );

  const groups = useMemo(() => {
    const representativeData =
      selectedRepresentative === "Todos"
        ? salesData
        : salesData.filter((item) => item.Representante === selectedRepresentative);

    return [...new Set(representativeData.map((item) => item.Grupo_Bandeira))].sort();
  }, [selectedRepresentative]);

  const products = useMemo(
    () => [...new Set(salesData.map((item) => item.Produto))].sort(),
    []
  );

  useEffect(() => {
    if (selectedGroup !== "Todos" && !groups.includes(selectedGroup)) {
      setSelectedGroup("Todos");
    }
  }, [groups, selectedGroup]);

  const filteredData = useMemo(() => {
    return salesData.filter((item) => {
      const representativeMatches =
        selectedRepresentative === "Todos" ||
        item.Representante === selectedRepresentative;
      const groupMatches =
        selectedGroup === "Todos" || item.Grupo_Bandeira === selectedGroup;
      const productMatches =
        selectedProduct === "Todos" || item.Produto === selectedProduct;

      return representativeMatches && groupMatches && productMatches;
    });
  }, [selectedGroup, selectedProduct, selectedRepresentative]);

  const storesData = useMemo(
    () => aggregateStores(filteredData, selectedProduct),
    [filteredData, selectedProduct]
  );

  const totals = useMemo(() => {
    const totalMarch = storesData.reduce((sum, item) => sum + item.Março, 0);
    const totalApril = storesData.reduce((sum, item) => sum + item.Abril, 0);
    const absoluteDifference = totalApril - totalMarch;
    const growthRate = totalMarch > 0 ? absoluteDifference / totalMarch : 0;

    return {
      totalMarch,
      totalApril,
      absoluteDifference,
      growthRate
    };
  }, [storesData]);

  const topStores = useMemo(
    () => [...storesData].sort(sortByAprilDesc).slice(0, 10),
    [storesData]
  );

  const chartData = useMemo(
    () =>
      topStores.map((item) => ({
        ...item,
        label: getStoreLabel(item)
      })),
    [topStores]
  );

  const growthRanking = useMemo(
    () =>
      [...storesData]
        .sort((a, b) => b.Dif_Abr_vs_Mar - a.Dif_Abr_vs_Mar)
        .slice(0, 10)
        .map((item) => ({
          ...item,
          label: getStoreLabel(item)
        })),
    [storesData]
  );

  const resultTone = totals.absoluteDifference >= 0 ? "positive" : "negative";

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Vendas farmacêuticas
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              SELL OUT MERCHAN
            </h1>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            {storesData.length} lojas analisadas
          </div>
        </header>

        <Filters
          representatives={representatives}
          groups={groups}
          products={products}
          selectedRepresentative={selectedRepresentative}
          selectedGroup={selectedGroup}
          selectedProduct={selectedProduct}
          onRepresentativeChange={setSelectedRepresentative}
          onGroupChange={setSelectedGroup}
          onProductChange={setSelectedProduct}
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Março"
            value={formatCurrency(totals.totalMarch)}
            detail="unidades"
          />
          <MetricCard
            label="Total Abril"
            value={formatCurrency(totals.totalApril)}
            detail="unidades"
          />
          <MetricCard
            label="Diferença absoluta"
            value={formatCurrency(totals.absoluteDifference)}
            detail="unidades"
            tone={resultTone}
          />
          <MetricCard
            label="Crescimento"
            value={formatPercent(totals.growthRate)}
            detail="Abril vs Março"
            tone={resultTone}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <BarComparisonChart data={chartData} />
          <GrowthRankingChart data={growthRanking} />
        </section>

        <TopStoresTable rows={topStores} />
      </div>
    </main>
  );
}
