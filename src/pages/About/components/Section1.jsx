import React from 'react';

const Section1 = () => {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 md:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-amber-50 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-yellow-50 blur-3xl" />
      </div>

      {/* Subtle cashew pattern (abstract) */}
      <div className="absolute bottom-0 left-0 right-0 -z-10 h-40 bg-gradient-to-t from-amber-50/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl text-center">
        {/* Animated badge */}
        <div className="animate-fade-in-up group inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-600 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-600" />
          </span>
          <p className="text-sm uppercase tracking-[4px] text-amber-800">Since 2015</p>
        </div>

        {/* Main heading with gradient accent */}
        <h1 className="animate-fade-in-up mt-8 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
          Crafting{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent">
              Premium Cashew
            </span>
            <svg
              className="absolute bottom-2 left-0 z-0 w-full -translate-y-1 scale-105"
              viewBox="0 0 300 12"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 6 Q75 12 150 6 Q225 0 300 6"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                className="opacity-40"
              />
            </svg>
          </span>{" "}
          Experiences
        </h1>

        {/* Description with better readability */}
        <p className="animate-fade-in-up mx-auto mt-8 max-w-3xl text-lg text-gray-600 leading-relaxed md:text-xl md:leading-relaxed">
          We are committed to sourcing the finest cashews and delivering a
          delightful customer experience from{" "}
          <span className="font-semibold text-amber-700">farm to table</span>.
        </p>

        {/* Trust indicators */}
        <div className="animate-fade-in-up mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {[
            { label: "Organic Certified", icon: "🌱" },
            { label: "Direct Sourcing", icon: "🤝" },
            { label: "Crunch Guarantee", icon: "✨" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium text-gray-600">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="animate-fade-in-up mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95">
            <span className="relative z-10">Discover Our Story</span>
            <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-amber-500 to-yellow-500 transition-transform duration-300 group-hover:translate-x-0" />
          </button>
          <button className="rounded-full border-2 border-amber-200 bg-white/80 px-8 py-3 text-base font-semibold text-amber-700 backdrop-blur-sm transition-all duration-300 hover:border-amber-400 hover:bg-amber-50">
            Watch Farm Video →
          </button>
        </div>
      </div>

      {/* Tailwind animations (add to your global CSS or use a plugin) */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
          opacity: 0;
        }
        .animate-fade-in-up:nth-child(1) {
          animation-delay: 0s;
        }
        .animate-fade-in-up:nth-child(2) {
          animation-delay: 0.1s;
        }
        .animate-fade-in-up:nth-child(3) {
          animation-delay: 0.2s;
        }
        .animate-fade-in-up:nth-child(4) {
          animation-delay: 0.3s;
        }
      `}</style>
    </section>
  );
};

export default Section1;