export default function StatusCard({ title, value, borderColor }) {
  return (
    <div className={`p-6 rounded-2xl shadow  border-l-4 dark:bg-primary ${borderColor}`}>
      <h2 className={`text-lg font-medium }`}>{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
