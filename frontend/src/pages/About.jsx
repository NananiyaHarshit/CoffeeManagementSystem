import React from 'react';
import { Link } from 'react-router-dom';
import { FaCoffee, FaLeaf, FaHeart, FaRibbon, FaArrowRight } from 'react-icons/fa';

const About = () => {
  const stats = [
    { number: '12+', label: 'Artisanal Single-Origin Roasts' },
    { number: '100%', label: 'Ethically Sourced Beans' },
    { number: '20+', label: 'Master Baristas & Roasters' },
    { number: '15,000+', label: 'Delighted Coffee Lovers' },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-caramel uppercase tracking-widest">Our Legacy & Philosophy</span>
          <h1 className="heading-serif text-4xl sm:text-5xl font-extrabold text-dark-espresso mt-2 leading-tight">
            Crafting Extraordinary Coffee Experiences
          </h1>
          <p className="text-base text-coffee-brown/80 mt-4 leading-relaxed">
            At Brew Haven, we view coffee as a sacred ritual — a fusion of agricultural art, master roasting science, and genuine human warmth.
          </p>
        </div>

        {/* STORY & MISSION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-xl border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=900"
              alt="Coffee Bean Roasting"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-xs font-bold text-caramel uppercase tracking-widest">The Beginning</span>
            <h2 className="heading-serif text-3xl font-bold text-dark-espresso">
              From Direct-Trade Farms To Your Favorite Mug
            </h2>
            <p className="text-sm text-coffee-brown/80 leading-relaxed">
              Founded in 2021, Brew Haven was built on a simple promise: never compromise on bean quality or roast freshness. We partner directly with smallholder coffee farmers across Ethiopia, Colombia, Guatemala, and Sumatra to source 100% specialty grade Arabica beans.
            </p>
            <p className="text-sm text-coffee-brown/80 leading-relaxed">
              Every single batch is custom-roasted in small drums to highlight the unique terroirs and natural tasting notes — from bright bergamot and red cherry to velvety cocoa and butter caramel.
            </p>
          </div>
        </div>

        {/* COFFEE SOURCING & PROCESS */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="heading-serif text-3xl font-bold text-dark-espresso">Our Crafting Process</h2>
            <p className="text-xs text-coffee-brown/70 mt-1">Four steps to absolute perfection in every cup</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FaLeaf, step: '01', title: 'Ethical Sourcing', desc: 'Direct trade relationship with sustainable family farms.' },
              { icon: FaCoffee, step: '02', title: 'Small Batch Roast', desc: 'Roasted daily in small drums to optimize flavor expression.' },
              { icon: FaRibbon, step: '03', title: 'Cupping & QC', desc: 'Rigorously cupped and graded by certified Q-graders.' },
              { icon: FaHeart, step: '04', title: 'Fresh Brew & Ship', desc: 'Sealed immediately in valve bags to lock in aroma.' },
            ].map((p, idx) => (
              <div key={idx} className="rounded-2xl bg-white p-6 shadow-card border border-caramel/15 relative">
                <span className="absolute top-4 right-4 text-2xl font-extrabold text-caramel/20">{p.step}</span>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-caramel text-cream mb-4">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="heading-serif text-base font-bold text-dark-espresso mb-1">{p.title}</h3>
                <p className="text-xs text-coffee-brown/80 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="rounded-3xl bg-dark-espresso p-10 text-cream shadow-2xl mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((st, idx) => (
              <div key={idx}>
                <span className="block text-3xl sm:text-4xl font-extrabold text-caramel">{st.number}</span>
                <span className="text-xs font-semibold text-cream/70 mt-1 block">{st.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-caramel/15 p-10 text-center border border-caramel/30">
          <h2 className="heading-serif text-3xl font-bold text-dark-espresso mb-3">
            Ready to Taste the Haven Difference?
          </h2>
          <p className="text-xs sm:text-sm text-coffee-brown/80 max-w-md mx-auto mb-6">
            Order your first bag of fresh artisanal roast today and receive complimentary delivery.
          </p>
          <Link
            to="/coffee"
            className="inline-flex items-center gap-2 rounded-full bg-caramel px-8 py-3.5 text-xs font-bold text-cream hover:bg-coffee-brown transition-colors shadow-md"
          >
            Explore All Coffees
            <FaArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
