const Filters = ({ representantes, grupos, selectedRep, selectedGroup, onRepChange, onGroupChange }) => {
  return (
    <div className="grid gap-4 rounded-xl bg-white p-4 shadow sm:grid-cols-2">
      <label className="flex flex-col text-sm font-medium text-slate-700">
        Representante
        <select className="mt-1 rounded-lg border border-slate-300 px-3 py-2" value={selectedRep} onChange={(e) => onRepChange(e.target.value)}>
          {representantes.map((rep) => (
            <option key={rep} value={rep}>{rep}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col text-sm font-medium text-slate-700">
        Grupo_Bandeira
        <select className="mt-1 rounded-lg border border-slate-300 px-3 py-2" value={selectedGroup} onChange={(e) => onGroupChange(e.target.value)}>
          {grupos.map((grupo) => (
            <option key={grupo} value={grupo}>{grupo}</option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Filters;
