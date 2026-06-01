const TestimonialCard = ({ item }) => {
  return (
    <div className="rounded-3xl border border-gray-200 bg-yellow-50 p-8 transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="mb-6 flex gap-1 text-yellow-500">★★★★★</div>
      <p className="leading-8 text-gray-700">"{item.review}"</p>
      <div className="mt-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-700 text-lg font-bold text-white">
          {item.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
          <p className="text-sm text-gray-500">{item.role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
