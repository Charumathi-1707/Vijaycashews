import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-yellow-50 to-white pt-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-20 lg:grid-cols-2">
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
            Premium Cashews Since 1985
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-gray-900">
            Nature's Finest
            <span className="text-yellow-700"> Cashews</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Premium hand-picked cashews delivered fresh to your doorstep.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-full bg-yellow-700 px-8 py-4 text-white">
              Shop Now
            </button>

            <button className="rounded-full border border-yellow-700 px-8 py-4 text-yellow-700">
              Learn More
            </button>
          </div>
        </motion.div>

        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          src="/cashew.png"
          alt="Cashews"
          className="mx-auto w-full max-w-lg rounded-3xl shadow-2xl"
        />
      </div>
    </section>
  );
};

export default HeroSection;