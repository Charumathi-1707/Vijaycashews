import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-100 pt-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="rounded-full bg-yellow-100 px-5 py-2 text-sm font-semibold text-yellow-800">
            Premium Quality Since 1985
          </span>

          <h1 className="mt-8 text-6xl font-bold leading-tight text-gray-900">
            Nature's Finest
            <span className="text-yellow-700"> Cashews</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Experience rich buttery taste from handpicked premium
            cashews sourced from the best farms in India.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-full bg-yellow-700 px-8 py-4 font-semibold text-white transition hover:bg-yellow-800">
              Shop Now
            </button>

            <button className="rounded-full border border-yellow-700 px-8 py-4 font-semibold text-yellow-700 transition hover:bg-yellow-700 hover:text-white">
              Learn More
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <img
            src="https://images.unsplash.com/photo-1601302074001-9b1c3a6e6da4?w=800"
            alt="Cashews"
            className="rounded-3xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;