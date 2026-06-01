import {
  FaLeaf,
  FaBoxOpen,
  FaHandSparkles,
} from "react-icons/fa";

const features = [
  {
    icon: <FaHandSparkles />,
    title: "Hand Picked",
    description:
      "Each cashew is carefully selected for premium quality.",
  },

  {
    icon: <FaLeaf />,
    title: "100% Natural",
    description:
      "No preservatives or artificial additives used.",
  },

  {
    icon: <FaBoxOpen />,
    title: "Fresh Packaging",
    description:
      "Vacuum-packed to maintain freshness and crunch.",
  },
];

const Section4 = () => {
  return (
    <section
      id="quality"
      className="bg-yellow-50 px-6 py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

        {/* Image */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800"
            alt="Quality"
            className="rounded-3xl shadow-2xl"
          />
        </div>

        {/* Content */}
        <div>

          <p className="font-semibold uppercase tracking-[4px] text-yellow-700">
            Why Choose Us
          </p>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">
            Premium Quality Standards
          </h2>

          <div className="mt-12 space-y-8">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-5 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-700 text-2xl text-white">
                  {feature.icon}
                </div>

                <div>
                  <h3 className="text-2xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section4;