import { useState } from "react";

const Section5 = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Subscribed Successfully!");

    setEmail("");
  };

  return (
    <section className="bg-gradient-to-r from-yellow-800 to-yellow-700 px-6 py-24 text-white">

      <div className="mx-auto max-w-4xl text-center">

        <h2 className="text-5xl font-bold">
          Stay Updated
        </h2>

        <p className="mt-6 text-lg leading-8 text-yellow-100">
          Subscribe for exclusive offers, product launches,
          and premium cashew updates.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 flex max-w-2xl flex-col gap-4 md:flex-row"
        >

          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-full border-none px-6 py-4 text-black outline-none"
          />

          <button
            type="submit"
            className="rounded-full bg-white px-8 py-4 font-bold text-yellow-800 transition hover:bg-yellow-100"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Section5;