import { useEffect, useState } from "react";
import TestimonialCard from "./TestimonialCard";

import {
  fetchTestimonials,
} from "../../../services/read/testimonial.service";

const Section1 = () => {
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
            testimonials.map((item, index) => (
              <TestimonialCard key={index} item={item} />
            ))
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

export default Section1;