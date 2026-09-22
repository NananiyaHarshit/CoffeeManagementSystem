import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaCoffee, FaTruck, FaAward, FaShieldAlt, FaStar, FaArrowRight, FaQuoteLeft } from 'react-icons/fa';
import CoffeeCard from '../components/coffee/CoffeeCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { getCoffeesApi } from '../services/coffee.service';
import { CATEGORIES } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuredRef = useRef(null);

  const [featuredCoffees, setFeaturedCoffees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getCoffeesApi({ featured: 'true' });
        setFeaturedCoffees(data.coffees.slice(0, 6));
      } catch (err) {
        console.error('Fetch featured coffees error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance Animation
      gsap.from('.hero-anim', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const categories = [
    { name: 'Espresso', img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400', desc: 'Concentrated & intense' },
    { name: 'Cappuccino', img: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=400', desc: 'Rich espresso with microfoam' },
    { name: 'Latte', img: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=400', desc: 'Smooth & velvety milk blend' },
    { name: 'Cold Brew', img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=400', desc: 'Slow steeped for 20 hours' },
    { name: 'Americano', img: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=400', desc: 'Clean, bold hot spring water brew' },
    { name: 'Mocha', img: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=400', desc: 'Decadent dark chocolate blend' },
  ];

  const valueProps = [
    { icon: FaAward, title: 'Premium Beans', desc: 'Ethically sourced 100% Arabica beans from world-renowned coffee estates.' },
    { icon: FaCoffee, title: 'Freshly Roasted', desc: 'Small-batch roasted daily to guarantee optimal aroma and depth of flavor.' },
    { icon: FaTruck, title: 'Fast Delivery', desc: 'Free express shipping on orders over ₹500 delivered straight to your door.' },
    { icon: FaShieldAlt, title: 'Secure Payments', desc: 'Encrypted checkout powered by industry leading payment gateways.' },
  ];

  const testimonials = [
    {
      name: 'Eleanor Vance',
      role: 'Coffee Enthusiast',
      comment: 'Brew Haven’s Nitro Cold Brew is hands down the smoothest coffee I have ever tasted. The velvety microfoam texture is unmatched!',
      rating: 5,
    },
    {
      name: 'Marcus Sterling',
      role: 'Art Director',
      comment: 'The house espresso blend is my morning ritual now. Rich dark chocolate notes and immaculate packaging!',
      rating: 5,
    },
    {
      name: 'Sophia Chen',
      role: 'Food Blogger',
      comment: 'Fast delivery, beautiful classic aesthetics, and unbelievable almond butter croissants. Highly recommended!',
      rating: 5,
    },
  ];

  return (
    <div className="pt-20">
      {/* SECTION 1: HERO */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center bg-cream py-12 lg:py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <span className="hero-anim inline-block rounded-full bg-caramel/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-coffee-brown border border-caramel/30">
                ☕ Welcome to Brew Haven
              </span>
              <h1 className="hero-anim heading-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark-espresso leading-tight">
                Start Your Day With <br />
                <span className="text-caramel italic">The Perfect Coffee</span>
              </h1>
              <p className="hero-anim text-base sm:text-lg text-coffee-brown/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Carefully selected beans, expertly roasted and brewed for moments worth remembering.
              </p>

              <div className="hero-anim flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/coffee"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-caramel px-8 py-3.5 text-sm font-bold text-cream shadow-md transition-all hover:bg-coffee-brown hover:shadow-lg active:scale-95"
                >
                  Explore Coffee
                  <FaArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border-2 border-caramel/40 bg-white/80 px-8 py-3.5 text-sm font-bold text-dark-espresso backdrop-blur-sm transition-all hover:bg-caramel/10 active:scale-95"
                >
                  View Menu
                </Link>
              </div>

              {/* Stats */}
              <div className="hero-anim grid grid-cols-3 gap-4 pt-8 border-t border-caramel/20 max-w-md mx-auto lg:mx-0">
                <div>
                  <span className="block text-2xl font-extrabold text-dark-espresso">100%</span>
                  <span className="text-xs text-coffee-brown/70">Arabica Beans</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-dark-espresso">15k+</span>
                  <span className="text-xs text-coffee-brown/70">Happy Customers</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-dark-espresso">4.9 ★</span>
                  <span className="text-xs text-coffee-brown/70">User Rating</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="hero-anim relative flex justify-center">
              <div className="relative aspect-square w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1000"
                  alt="Brew Haven Premium Coffee"
                  className="h-full w-full object-cover transform transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-espresso/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-caramel text-cream font-bold text-lg">
                      🔥
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-dark-espresso">Freshly Brewed Special</h4>
                      <p className="text-[11px] text-coffee-brown">Artisanal House Espresso & Nitro Draft</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED COFFEE */}
      <section ref={featuredRef} className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-caramel uppercase tracking-widest">Handpicked Selections</span>
              <h2 className="heading-serif text-3xl sm:text-4xl font-bold text-dark-espresso mt-1">
                Featured Coffees
              </h2>
            </div>
            <Link
              to="/coffee"
              className="mt-4 md:mt-0 text-sm font-bold text-caramel hover:text-coffee-brown flex items-center gap-1 group"
            >
              View Full Coffee Shop
              <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <SkeletonLoader count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCoffees.map((coffee) => (
                <CoffeeCard key={coffee._id} coffee={coffee} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: COFFEE CATEGORIES */}
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-caramel uppercase tracking-widest">Explore Flavor Profiles</span>
            <h2 className="heading-serif text-3xl sm:text-4xl font-bold text-dark-espresso mt-1">
              Coffee Categories
            </h2>
            <p className="text-sm text-coffee-brown/80 mt-2">
              Discover your perfect brew from our wide selection of classic espresso blends, velvety lattes, and refreshing cold brews.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => navigate(`/coffee?category=${cat.name}`)}
                className="group cursor-pointer rounded-2xl bg-white p-4 text-center shadow-card border border-caramel/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-hover hover:border-caramel/40"
              >
                <div className="relative mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border-2 border-caramel/20">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="heading-serif text-base font-bold text-dark-espresso group-hover:text-caramel transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-coffee-brown/70 line-clamp-1 mt-0.5">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE US */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-cream p-6 border border-caramel/15 transition-all hover:shadow-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-caramel text-cream mb-4 shadow-sm">
                  <prop.icon className="h-6 w-6" />
                </div>
                <h3 className="heading-serif text-lg font-bold text-dark-espresso mb-2">{prop.title}</h3>
                <p className="text-xs text-coffee-brown/80 leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: OUR STORY */}
      <section className="py-16 bg-cream border-y border-caramel/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-4/3 overflow-hidden rounded-3xl shadow-xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=900"
                  alt="Brew Haven Roastery"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block rounded-2xl bg-dark-espresso p-5 text-cream shadow-xl max-w-xs border border-caramel/30">
                <p className="text-xs italic leading-relaxed">
                  "We believe coffee is not just a drink — it’s a craft of passion, community, and comfort."
                </p>
                <span className="block text-[11px] font-bold text-caramel mt-2">— Master Roaster</span>
              </div>
            </div>

            <div className="space-y-5">
              <span className="text-xs font-bold text-caramel uppercase tracking-widest">Our Story & Craft</span>
              <h2 className="heading-serif text-3xl sm:text-4xl font-bold text-dark-espresso">
                Born From A Passion For Exceptional Coffee
              </h2>
              <p className="text-sm text-coffee-brown/80 leading-relaxed">
                Brew Haven began with a simple mission: to elevate daily coffee rituals into unforgettable sensory experiences. From direct-trade farms in Ethiopia and Colombia to our small-batch roastery, every single step is guided by unyielding commitment to quality.
              </p>
              <p className="text-sm text-coffee-brown/80 leading-relaxed">
                Whether you prefer an intense ristretto espresso or a smooth nitro cold brew, our master baristas bring precision, warmth, and classic elegance to every cup.
              </p>

              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-caramel px-7 py-3 text-xs font-bold text-cream shadow-sm transition-all hover:bg-coffee-brown active:scale-95"
                >
                  Discover Our Story
                  <FaArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CUSTOMER TESTIMONIALS */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-caramel uppercase tracking-widest">Loved By Coffee Lovers</span>
            <h2 className="heading-serif text-3xl sm:text-4xl font-bold text-dark-espresso mt-1">
              Customer Testimonials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-cream p-6 border border-caramel/15 shadow-card flex flex-col justify-between"
              >
                <div>
                  <FaQuoteLeft className="h-6 w-6 text-caramel/40 mb-3" />
                  <p className="text-xs text-coffee-brown/90 leading-relaxed italic mb-4">
                    "{t.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-caramel/20">
                  <div>
                    <h4 className="text-xs font-bold text-dark-espresso">{t.name}</h4>
                    <span className="text-[10px] text-coffee-brown/70">{t.role}</span>
                  </div>
                  <div className="flex text-amber-500 text-xs">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
