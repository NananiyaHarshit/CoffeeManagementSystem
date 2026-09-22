import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import CoffeeCard from '../components/coffee/CoffeeCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { getCoffeesApi } from '../services/coffee.service';
import { CATEGORIES, ROAST_LEVELS, SORT_OPTIONS } from '../utils/constants';

const Coffee = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [roastLevel, setRoastLevel] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (category && category !== 'All') params.category = category;
        if (roastLevel && roastLevel !== 'All') params.roastLevel = roastLevel;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (sort) params.sort = sort;

        const data = await getCoffeesApi(params);
        setCoffees(data.coffees || []);
      } catch (err) {
        console.error('Fetch coffees error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoffees();
  }, [search, category, roastLevel, minPrice, maxPrice, sort]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setRoastLevel('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-caramel uppercase tracking-widest">Our Complete Collection</span>
          <h1 className="heading-serif text-3xl sm:text-4xl font-extrabold text-dark-espresso mt-1">
            Artisanal Coffee Shop
          </h1>
          <p className="text-xs sm:text-sm text-coffee-brown/80 mt-2">
            Explore our whole bean coffees, espresso roasts, and signature coffee drinks crafted by master roasters.
          </p>
        </div>

        {/* Top Controls Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-card border border-caramel/15">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caramel h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, origin or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-caramel/30 bg-cream/50 pl-10 pr-4 py-2 text-xs text-dark-espresso placeholder-coffee-brown/50 focus:outline-none focus:border-caramel"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-brown/60 hover:text-dark-espresso"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown & Mobile Filter Toggle */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-2 rounded-full border border-caramel/30 bg-cream px-4 py-2 text-xs font-bold text-dark-espresso"
            >
              <FiFilter className="h-4 w-4 text-caramel" />
              Filters
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-coffee-brown hidden sm:inline">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-caramel/30 bg-cream px-4 py-2 text-xs font-bold text-dark-espresso focus:outline-none focus:border-caramel"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Filters (Desktop & Mobile Drawer) */}
          <aside
            className={`lg:block ${
              mobileFilterOpen ? 'block fixed inset-0 z-50 bg-cream/95 p-6 overflow-y-auto' : 'hidden'
            } rounded-2xl bg-white p-6 shadow-card border border-caramel/15 space-y-6`}
          >
            {mobileFilterOpen && (
              <div className="flex items-center justify-between pb-4 border-b border-cream">
                <h3 className="heading-serif text-lg font-bold text-dark-espresso">Filter Coffees</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-dark-espresso hover:text-caramel"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            )}

            {/* Category Filter */}
            <div>
              <h4 className="heading-serif text-sm font-bold text-dark-espresso mb-3">Categories</h4>
              <div className="flex flex-col gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      if (mobileFilterOpen) setMobileFilterOpen(false);
                    }}
                    className={`text-left px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                      category === cat
                        ? 'bg-caramel text-cream font-bold'
                        : 'text-coffee-brown hover:bg-cream hover:text-dark-espresso'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Roast Level Filter */}
            <div>
              <h4 className="heading-serif text-sm font-bold text-dark-espresso mb-3">Roast Level</h4>
              <div className="flex flex-col gap-1.5">
                {ROAST_LEVELS.map((roast) => (
                  <button
                    key={roast}
                    onClick={() => {
                      setRoastLevel(roast);
                      if (mobileFilterOpen) setMobileFilterOpen(false);
                    }}
                    className={`text-left px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                      roastLevel === roast
                        ? 'bg-caramel text-cream font-bold'
                        : 'text-coffee-brown hover:bg-cream hover:text-dark-espresso'
                    }`}
                  >
                    {roast}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="heading-serif text-sm font-bold text-dark-espresso mb-3">Price Range (₹)</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-3 py-1.5 text-xs text-dark-espresso focus:outline-none"
                />
                <span className="text-xs text-coffee-brown">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-3 py-1.5 text-xs text-dark-espresso focus:outline-none"
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className="w-full rounded-full border border-caramel/40 bg-cream py-2 text-xs font-bold text-dark-espresso hover:bg-caramel hover:text-cream transition-colors"
            >
              Reset All Filters
            </button>
          </aside>

          {/* Coffee Product Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <SkeletonLoader count={6} />
            ) : coffees.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-card border border-caramel/15">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream text-caramel text-2xl">
                  ☕
                </div>
                <h3 className="heading-serif text-xl font-bold text-dark-espresso">No Coffees Found</h3>
                <p className="text-xs text-coffee-brown/80 mt-1 max-w-sm mx-auto">
                  We couldn't find any coffee matching your current search or filter criteria. Try adjusting your filters!
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 rounded-full bg-caramel px-6 py-2.5 text-xs font-bold text-cream hover:bg-coffee-brown transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {coffees.map((coffee) => (
                  <CoffeeCard key={coffee._id} coffee={coffee} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Coffee;
