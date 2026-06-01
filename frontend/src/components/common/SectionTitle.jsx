const SectionTitle = ({
  subtitle,
  title,
}) => {
  return (
    <div className="mb-16 text-center">

      <p className="font-semibold uppercase tracking-[4px] text-yellow-700">
        {subtitle}
      </p>

      <h2 className="mt-4 text-5xl font-bold text-gray-900">
        {title}
      </h2>
    </div>
  );
};

export default SectionTitle;