import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/contact', formData);
      toast.success('Thank you! Your message has been sent to our concierge desk.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-caramel uppercase tracking-widest">Get In Touch</span>
          <h1 className="heading-serif text-3xl sm:text-4xl font-extrabold text-dark-espresso mt-1">
            We’d Love To Hear From You
          </h1>
          <p className="text-xs sm:text-sm text-coffee-brown/80 mt-2">
            Have a question about our coffee roasts, catering services, or order tracking? Drop us a line below!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Information Cards */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-card border border-caramel/15 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-caramel text-cream">
                  <FiMapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="heading-serif text-base font-bold text-dark-espresso">Store Location</h4>
                  <p className="text-xs text-coffee-brown/80 mt-1 leading-relaxed">
                    148 Espresso Blvd, Coffee Quarter, New Delhi, 110001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-3 border-t border-cream">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-caramel text-cream">
                  <FiPhone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="heading-serif text-base font-bold text-dark-espresso">Phone & WhatsApp</h4>
                  <p className="text-xs text-coffee-brown/80 mt-1">+91 (800) 555-BREW</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-3 border-t border-cream">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-caramel text-cream">
                  <FiMail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="heading-serif text-base font-bold text-dark-espresso">Email Inquiry</h4>
                  <p className="text-xs text-coffee-brown/80 mt-1">support@brewhaven.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-3 border-t border-cream">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-caramel text-cream">
                  <FiClock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="heading-serif text-base font-bold text-dark-espresso">Opening Hours</h4>
                  <p className="text-xs text-coffee-brown/80 mt-1">Mon - Sun: 7:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-2xl bg-white p-6 shadow-card border border-caramel/15 text-center">
              <h4 className="heading-serif text-sm font-bold text-dark-espresso mb-3">Connect With Us</h4>
              <div className="flex items-center justify-center gap-4">
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-caramel hover:bg-caramel hover:text-cream transition-colors">
                  <FaInstagram className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-caramel hover:bg-caramel hover:text-cream transition-colors">
                  <FaFacebookF className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-caramel hover:bg-caramel hover:text-cream transition-colors">
                  <FaTwitter className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-card border border-caramel/15">
            <h3 className="heading-serif text-2xl font-bold text-dark-espresso mb-6">Send Us A Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-espresso mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-4 py-2.5 text-xs text-dark-espresso focus:outline-none focus:border-caramel"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-espresso mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-4 py-2.5 text-xs text-dark-espresso focus:outline-none focus:border-caramel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-espresso mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-4 py-2.5 text-xs text-dark-espresso focus:outline-none focus:border-caramel"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-espresso mb-1">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Inquiry about whole bean subscriptions"
                    className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-4 py-2.5 text-xs text-dark-espresso focus:outline-none focus:border-caramel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-espresso mb-1">Your Message *</label>
                <textarea
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you..."
                  className="w-full rounded-xl border border-caramel/30 bg-cream/50 p-4 text-xs text-dark-espresso focus:outline-none focus:border-caramel"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-caramel px-8 py-3 text-xs font-bold text-cream shadow-md transition-all hover:bg-coffee-brown active:scale-95 disabled:opacity-50"
              >
                <FiSend className="h-4 w-4" />
                {submitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
