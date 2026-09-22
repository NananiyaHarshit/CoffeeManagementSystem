import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingBag, FaBolt, FaStar, FaGlobe, FaFire } from 'react-icons/fa';
import RatingStars from '../components/common/RatingStars';
import QuantitySelector from '../components/common/QuantitySelector';
import CoffeeCard from '../components/coffee/CoffeeCard';
import useCart from '../hooks/useCart';
import useFavorites from '../hooks/useFavorites';
import useAuth from '../hooks/useAuth';
import { getCoffeeByIdApi, getProductReviewsApi, submitReviewApi, getCoffeesApi } from '../services/coffee.service';
import { formatPrice } from '../utils/formatPrice';
import { toast } from 'react-toastify';

const CoffeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();

  const [coffee, setCoffee] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [relatedCoffees, setRelatedCoffees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchCoffeeDetails = async () => {
      try {
        setLoading(true);
        const data = await getCoffeeByIdApi(id);
        const prod = data.coffee;
        setCoffee(prod);
        setSelectedImage(prod.images[0]);
        if (prod.sizes && prod.sizes.length > 0) {
          setSelectedSize(prod.sizes[1] || prod.sizes[0]); // Default medium if available
        }

        // Fetch reviews
        const revData = await getProductReviewsApi(id);
        setReviews(revData.reviews || []);

        // Fetch related coffees
        const relData = await getCoffeesApi({ category: prod.category });
        setRelatedCoffees(relData.coffees.filter((c) => c._id !== prod._id).slice(0, 3));
      } catch (err) {
        console.error('Fetch coffee details error:', err);
        toast.error('Could not load coffee details');
      } finally {
        setLoading(false);
      }
    };

    fetchCoffeeDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (coffee) {
      addToCart(coffee, quantity, selectedSize);
    }
  };

  const handleBuyNow = () => {
    if (coffee) {
      addToCart(coffee, quantity, selectedSize);
      navigate('/checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please log in to submit a review');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await submitReviewApi({
        productId: coffee._id,
        rating: newRating,
        comment: newComment,
      });
      toast.success('Thank you for your review!');
      setNewComment('');
      // Refresh reviews
      const revData = await getProductReviewsApi(id);
      setReviews(revData.reviews || []);
      setCoffee((prev) => ({ ...prev, rating: res.newRating, reviewCount: (prev.reviewCount || 0) + 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !coffee) {
    return (
      <div className="pt-32 pb-16 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-caramel border-t-transparent mb-4"></div>
          <p className="text-sm font-bold text-dark-espresso">Brewing coffee details...</p>
        </div>
      </div>
    );
  }

  const fav = isFavorite(coffee._id);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-coffee-brown/70">
          <Link to="/" className="hover:text-caramel">Home</Link>
          <span>/</span>
          <Link to="/coffee" className="hover:text-caramel">Coffee Shop</Link>
          <span>/</span>
          <span className="font-bold text-dark-espresso truncate">{coffee.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-caramel/15 mb-16">
          {/* Left Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream border border-caramel/15">
              <img
                src={selectedImage}
                alt={coffee.name}
                className="h-full w-full object-cover object-center transition-all duration-300"
              />
              <button
                onClick={() => toggleFavorite(coffee)}
                className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-md text-caramel hover:scale-110 active:scale-95 transition-transform"
              >
                {fav ? <FaHeart className="h-5 w-5 text-red-500" /> : <FaRegHeart className="h-5 w-5" />}
              </button>
            </div>

            {/* Thumbnail selector */}
            {coffee.images.length > 1 && (
              <div className="flex items-center gap-3">
                {coffee.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-all ${
                      selectedImage === img ? 'border-caramel scale-105 shadow-sm' : 'border-caramel/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-roast flex items-center gap-1">
                  <FaFire className="h-3 w-3 text-caramel" />
                  {coffee.roastLevel}
                </span>
                <span className="text-xs font-semibold text-coffee-brown/70 uppercase">
                  {coffee.category}
                </span>
              </div>
              <h1 className="heading-serif text-3xl sm:text-4xl font-extrabold text-dark-espresso">
                {coffee.name}
              </h1>
              <div className="mt-3 flex items-center gap-4">
                <RatingStars rating={coffee.rating} reviewCount={coffee.reviewCount} size="md" />
                <span className="text-xs text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                  In Stock ({coffee.stock} available)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2 border-t border-cream">
              <span className="text-3xl font-extrabold text-dark-espresso">
                {formatPrice(coffee.price)}
              </span>
              <span className="text-xs text-coffee-brown/70">(Taxes included)</span>
            </div>

            <p className="text-sm text-coffee-brown/90 leading-relaxed">
              {coffee.description}
            </p>

            {/* Attributes: Origin & Flavor Notes */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-cream p-4 border border-caramel/15">
              <div>
                <span className="text-[11px] font-bold text-coffee-brown flex items-center gap-1 uppercase">
                  <FaGlobe className="h-3 w-3 text-caramel" /> Origin
                </span>
                <p className="text-xs font-bold text-dark-espresso mt-0.5">{coffee.origin}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-coffee-brown uppercase">Flavor Profile</span>
                <p className="text-xs font-bold text-dark-espresso mt-0.5">
                  {coffee.flavorNotes ? coffee.flavorNotes.join(', ') : 'Rich & Smooth'}
                </p>
              </div>
            </div>

            {/* Size Selector */}
            {coffee.sizes && coffee.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-dark-espresso mb-2">Select Serving Size</label>
                <div className="flex flex-wrap gap-2">
                  {coffee.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                        selectedSize === sz
                          ? 'border-caramel bg-caramel text-cream shadow-sm'
                          : 'border-caramel/30 bg-cream text-dark-espresso hover:border-caramel'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-bold text-dark-espresso mb-2">Quantity</label>
              <QuantitySelector
                quantity={quantity}
                onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                onIncrease={() => setQuantity(quantity + 1)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-cream">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-caramel px-6 py-3.5 text-xs font-bold text-cream shadow-md transition-all hover:bg-coffee-brown active:scale-95"
              >
                <FaShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-dark-espresso px-6 py-3.5 text-xs font-bold text-cream shadow-md transition-all hover:bg-black active:scale-95"
              >
                <FaBolt className="h-4 w-4 text-amber-400" />
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-caramel/15 mb-16">
          <h2 className="heading-serif text-2xl font-bold text-dark-espresso mb-6">
            Customer Reviews ({reviews.length})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-coffee-brown/70 italic">No reviews yet. Be the first to review this coffee!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="rounded-2xl bg-cream p-4 border border-caramel/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-dark-espresso">{rev.user?.name || 'Coffee Lover'}</h4>
                          <span className="text-[10px] text-coffee-brown/60">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-xs text-coffee-brown/90 mt-2">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Submit Review Form */}
            <div className="rounded-2xl bg-cream p-5 border border-caramel/20 h-fit">
              <h3 className="heading-serif text-base font-bold text-dark-espresso mb-3">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-dark-espresso mb-1">Your Rating</label>
                  <div className="flex gap-2 text-xl text-amber-500 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="hover:scale-125 transition-transform"
                      >
                        <FaStar className={star <= newRating ? 'text-amber-500' : 'text-amber-200'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-espresso mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    placeholder="Share your tasting notes..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    className="w-full rounded-xl border border-caramel/30 bg-white p-3 text-xs text-dark-espresso focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full rounded-full bg-caramel py-2.5 text-xs font-bold text-cream hover:bg-coffee-brown transition-colors disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Related Coffees Section */}
        {relatedCoffees.length > 0 && (
          <div>
            <h2 className="heading-serif text-2xl font-bold text-dark-espresso mb-6">
              You Might Also Enjoy
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCoffees.map((c) => (
                <CoffeeCard key={c._id} coffee={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoffeeDetails;
