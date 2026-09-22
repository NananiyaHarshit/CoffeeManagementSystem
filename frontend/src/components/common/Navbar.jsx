import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiTruck,
  FiSettings,
} from 'react-icons/fi';
import { FaCoffee } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useFavorites from '../../hooks/useFavorites';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItemCount } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/coffee?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Coffee', path: '/coffee' },
    { name: 'Menu', path: '/menu' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-md py-3'
          : 'bg-cream/80 backdrop-blur-sm py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-caramel text-cream shadow-sm transition-transform duration-300 group-hover:rotate-12">
              <FaCoffee className="h-5 w-5" />
            </div>
            <span className="heading-serif text-2xl font-extrabold tracking-tight text-dark-espresso">
              Brew Haven
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors duration-200 hover:text-caramel ${
                    isActive ? 'text-caramel font-bold border-b-2 border-caramel pb-1' : 'text-dark-espresso'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            {/* Search Bar Toggle */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search coffees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-44 sm:w-60 rounded-full border border-caramel bg-white px-4 py-1.5 text-xs text-dark-espresso focus:outline-none shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-2 text-dark-espresso hover:text-caramel"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-dark-espresso hover:text-caramel transition-colors"
                  aria-label="Search"
                >
                  <FiSearch className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Favorites Icon */}
            <Link
              to="/favorites"
              className="relative p-2 text-dark-espresso hover:text-caramel transition-colors"
              aria-label="Favorites"
            >
              <FiHeart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-caramel text-[10px] font-bold text-cream">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-dark-espresso hover:text-caramel transition-colors"
              aria-label="Cart"
            >
              <FiShoppingBag className="h-5 w-5" />
              {totalItemCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-caramel text-[10px] font-bold text-cream">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {/* Profile / Auth Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-caramel/30 p-1 hover:border-caramel transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-white p-2 shadow-hover border border-caramel/15 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-cream">
                      <p className="text-xs font-bold text-dark-espresso">{user.name}</p>
                      <p className="text-[11px] text-coffee-brown/70 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-dark-espresso hover:bg-cream rounded-xl transition-colors mt-1"
                    >
                      <FiSettings className="h-4 w-4 text-caramel" />
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-dark-espresso hover:bg-cream rounded-xl transition-colors"
                    >
                      <FiPackage className="h-4 w-4 text-caramel" />
                      My Orders
                    </Link>

                    <Link
                      to="/track-order"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-dark-espresso hover:bg-cream rounded-xl transition-colors"
                    >
                      <FiTruck className="h-4 w-4 text-caramel" />
                      Track Order
                    </Link>

                    <Link
                      to="/favorites"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-dark-espresso hover:bg-cream rounded-xl transition-colors"
                    >
                      <FiHeart className="h-4 w-4 text-caramel" />
                      Favorites
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1 border-t border-cream"
                    >
                      <FiLogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center justify-center rounded-full bg-caramel px-5 py-2 text-xs font-bold text-cream shadow-sm hover:bg-coffee-brown transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-dark-espresso hover:text-caramel"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 rounded-2xl bg-white p-4 shadow-hover border border-caramel/15 animate-fadeIn">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-semibold px-3 py-2 rounded-xl transition-colors ${
                      isActive ? 'bg-caramel text-cream' : 'text-dark-espresso hover:bg-cream'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 text-center rounded-xl bg-caramel py-2.5 text-sm font-bold text-cream"
                >
                  Login / Register
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
