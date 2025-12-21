export default function Search({ search, setSearch }) {
  return (
    <div className="w-full mb-4">
      <input
        type="text"
        placeholder="Search admin by name or username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
      />
    </div>
  );
}