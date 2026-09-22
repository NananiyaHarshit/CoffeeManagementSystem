import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCoffee, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing to Brew Haven newsletter!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-dark-espresso text-cream pt-16 pb-8 border-t border-caramel/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-cream/10">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-caramel text-cream">
                <FaCoffee className="h-5 w-5" />
              </div>
              <span className="heading-serif text-2xl font-bold tracking-tight text-cream">
                Brew Haven
              </span>
            </Link>
            <p className="text-sm text-cream/70 leading-relaxed mb-6 max-w-sm">
              Carefully selected beans, expertly roasted and brewed for moments worth remembering. Experience coffee craftsmanship at its finest.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: FaInstagram, href: '#' },
                { icon: FaFacebookF, href: '#' },
                { icon: FaTwitter, href: '#' },
                { icon: FaLinkedinIn, href: '#' },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-caramel hover:text-cream"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="heading-serif text-base font-semibold text-caramel mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-cream/80">
              <li>
                <Link to="/" className="hover:text-caramel transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/coffee" className="hover:text-caramel transition-colors">Coffee Shop</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-caramel transition-colors">Popular Menu</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-caramel transition-colors">Our Story</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-caramel transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h4 className="heading-serif text-base font-semibold text-caramel mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-cream/80">
              <li>
                <Link to="/profile" className="hover:text-caramel transition-colors">My Profile</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-caramel transition-colors">My Orders</Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-caramel transition-colors">Track Order</Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-caramel transition-colors">Favorites</Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-caramel transition-colors">Support Desk</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="heading-serif text-base font-semibold text-caramel mb-4">Newsletter</h4>
            <p className="text-xs text-cream/70 mb-4">
              Subscribe to receive special offers, new roasts & coffee brewing tips.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-full bg-cream/10 border border-cream/20 px-4 py-2 text-xs text-cream placeholder-cream/50 focus:outline-none focus:border-caramel"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-caramel text-cream transition-colors hover:bg-coffee-brown"
                >
                  <FiSend className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-cream/50 gap-4">
          <p>© {new Date().getFullYear()} Brew Haven Coffee Co. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cream">Privacy Policy</a>
            <a href="#" className="hover:text-cream">Terms & Conditions</a>
            <a href="#" className="hover:text-cream">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
