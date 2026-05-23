import { useEffect, useState } from "react";

import { FaStar } from "react-icons/fa";

import {
  fetchTestimonials,
} from "../../services/googleSheets.service";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH TESTIMONIALS
  useEffect(() => {
    const loadTestimonials =
      async () => {
        try {
          const data =
            await fetchTestimonials();

          setTestimonials(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadTestimonials();
  }, []);

  // LOADING
  if (loading) {
    return (
      <section className="py-24 text-center">

        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-yellow-700 border-t-transparent" />

        <p className="mt-5 text-gray-500">
          Loading Testimonials...
        </p>
      </section>
    );
  }

  return (
    <section
      id="reviews"
      className="bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-16 text-center">

          <p className="font-semibold uppercase tracking-[4px] text-yellow-700">
            Testimonials
          </p>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {testimonials.length > 0 ? (
            testimonials.map(
              (item, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-gray-200 bg-yellow-50 p-8 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >

                  {/* Stars */}
                  <div className="mb-6 flex gap-1 text-yellow-500">

                    {[...Array(5)].map(
                      (_, index) => (
                        <FaStar
                          key={index}
                        />
                      )
                    )}
                  </div>

                  {/* Review */}
                  <p className="leading-8 text-gray-700">
                    "{item.review}"
                  </p>

                  {/* User */}
                  <div className="mt-8 flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-700 text-lg font-bold text-white">

                      {item.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900">

                        {item.name}
                      </h4>

                      <p className="text-sm text-gray-500">

                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="col-span-full text-center text-gray-500">

              No testimonials found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;