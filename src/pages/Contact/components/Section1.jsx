const Section1 = () => {
  return (
    <div className="rounded-3xl bg-white p-10 shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900">Send Us a Message</h2>
      <form className="mt-8 space-y-6">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
        />
        <textarea
          placeholder="Your Message"
          className="w-full rounded-2xl border p-4 outline-none focus:border-yellow-700"
          rows="6"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-yellow-700 py-4 text-lg font-semibold text-white transition hover:bg-yellow-800"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Section1;
