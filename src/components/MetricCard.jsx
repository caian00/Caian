const MetricCard = ({ title, value, tone = 'default' }) => {
  const styles = {
    default: 'border-slate-200',
    positive: 'border-emerald-300 bg-emerald-50',
    negative: 'border-rose-300 bg-rose-50',
  };

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${styles[tone]}`}>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-800">{value}</p>
    </div>
  );
};

export default MetricCard;
