const filters = [
  "all",
  "premium",
  "roasted",
  "gift",
];

const ProductFilters = ({
  selectedFilter,
  setSelectedFilter,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">

      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setSelectedFilter(filter)}
          className={`rounded-full border px-6 py-3 text-sm font-semibold capitalize transition
          
          ${
            selectedFilter === filter
              ? "border-yellow-700 bg-yellow-700 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:border-yellow-700 hover:bg-yellow-700 hover:text-white"
          }
          `}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default ProductFilters;