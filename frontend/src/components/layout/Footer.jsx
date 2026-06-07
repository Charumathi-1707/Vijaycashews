import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

// Social icon SVGs (not available in this lucide version)
const Facebook = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>;
const Instagram = ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const Twitter = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>;

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-black text-sm">S</span>
              </div>
              <span className="font-display font-bold text-xl text-white">ShopEase</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-5">Your one-stop destination for quality products. Fast delivery, easy returns, and unbeatable prices.</p>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[['Home', '/'], ['Shop', '/shop'], ['Categories', '/categories'], ['About Us', '/about'], ['Contact', '/contact']].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2.5">
              {[['My Account', '/account'], ['Orders', '/orders'], ['Returns', '/returns'], ['FAQ', '/faq'], ['Privacy Policy', '/privacy']].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary-500" />
                123 Commerce St, Mumbai, Maharashtra 400001
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 shrink-0 text-primary-500" />
                +91 98765 43210
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 shrink-0 text-primary-500" />
                support@shopease.in
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2 font-medium">Newsletter</p>
              <div className="flex">
                <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" />
                <button className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-xl transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2025 ShopEase. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Secure Payments</span>
            <div className="flex items-center gap-2">
              {['VISA', 'MC', 'UPI', 'COD'].map(m => (
                <span key={m} className="px-2 py-1 bg-gray-800 rounded text-xs">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
