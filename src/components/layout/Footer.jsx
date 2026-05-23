import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="bg-[#111111] px-6 py-24 text-white"
    >
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>

          <h2 className="text-4xl font-bold text-yellow-500">
            Vijay Cashews
          </h2>

          <p className="mt-6 leading-8 text-gray-400">
            Bringing premium quality handpicked cashews
            since 1985 with trusted freshness and taste.
          </p>

          <div className="mt-8 flex gap-4">

            <a
              href="#"
              className="rounded-full bg-white/10 p-4 transition hover:bg-yellow-700"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              className="rounded-full bg-white/10 p-4 transition hover:bg-yellow-700"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              className="rounded-full bg-white/10 p-4 transition hover:bg-yellow-700"
            >
              <FaTwitter />
            </a>

            <a
              href="https://wa.me/919751694905"
              target="_blank"
              className="rounded-full bg-white/10 p-4 transition hover:bg-green-500"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="mb-6 text-2xl font-bold">
            Quick Links
          </h3>

          <div className="space-y-4 text-gray-400">
            <p>Home</p>
            <p>Products</p>
            <p>Quality</p>
            <p>Reviews</p>
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="mb-6 text-2xl font-bold">
            Products
          </h3>

          <div className="space-y-4 text-gray-400">
            <p>Whole Cashews</p>
            <p>Roasted Cashews</p>
            <p>Gift Packs</p>
            <p>Bulk Orders</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-6 text-2xl font-bold">
            Contact
          </h3>

          <div className="space-y-4 text-gray-400">
            <p>+91 97516 94905</p>
            <p>hello@vijaycashews.com</p>
            <p>Mumbai, India</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-gray-500 md:flex-row">

        <p>
          © 2026 Vijay Cashews. All rights reserved.
        </p>

        <p>
          Made with ❤️ in India
        </p>
      </div>
    </footer>
  );
};

export default Footer;