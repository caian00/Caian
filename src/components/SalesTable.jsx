const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const SalesTable = ({ rows }) => {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-left text-slate-600">
          <tr>
            {['Produto', 'Grupo_Bandeira', 'CNPJ', 'Endereço', 'Março', 'Abril', 'Dif_Abr_vs_Mar'].map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={`${r.CNPJ}-${idx}`} className="border-t border-slate-100">
              <td className="px-4 py-3">{r.Produto}</td>
              <td className="px-4 py-3">{r.Grupo_Bandeira}</td>
              <td className="px-4 py-3">{r.CNPJ}</td>
              <td className="px-4 py-3">{r.Endereço}</td>
              <td className="px-4 py-3">{brl(r.Março)}</td>
              <td className="px-4 py-3">{brl(r.Abril)}</td>
              <td className={`px-4 py-3 font-semibold ${r.Dif_Abr_vs_Mar >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {brl(r.Dif_Abr_vs_Mar)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
