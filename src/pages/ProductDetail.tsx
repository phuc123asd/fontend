import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useReviews } from '../contexts/ReviewContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { StarIcon, HeartIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon, RotateCcwIcon, ThumbsUpIcon, EditIcon, TrashIcon } from 'lucide-react';
// Mock product data - in real app, fetch from API
const productData = {
  1: {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 999,
    originalPrice: 1099,
    image: 'https://images.unsplash.com/photo-1632661674596-618e45337a12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80',
    images: ['https://images.unsplash.com/photo-1632661674596-618e45337a12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80', 'https://images.unsplash.com/photo-1678652197950-d4c0268e1b0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80', 'https://images.unsplash.com/photo-1678911820864-e5c67c6c3f93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80'],
    rating: 4.8,
    reviewCount: 256,
    category: 'Smartphones',
    brand: 'Apple',
    description: 'The iPhone 15 Pro features a stunning titanium design, A17 Pro chip, and advanced camera system. Experience the power of professional photography in your pocket.',
    features: ['A17 Pro chip for lightning-fast performance', 'Pro camera system with 48MP main camera', 'Titanium design with Ceramic Shield', 'Action button for quick shortcuts', 'USB-C connectivity', 'All-day battery life'],
    specifications: {
      Display: '6.1-inch Super Retina XDR display',
      Chip: 'A17 Pro chip',
      Camera: '48MP Main | 12MP Ultra Wide | 12MP Telephoto',
      Battery: 'Up to 23 hours video playback',
      Storage: '128GB, 256GB, 512GB, 1TB',
      Colors: 'Natural Titanium, Blue Titanium, White Titanium, Black Titanium'
    },
    inStock: true,
    hasARView: true
  }
};
export const ProductDetail = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    addToCart
  } = useCart();
  const {
    addToWishlist,
    isInWishlist,
    removeFromWishlist
  } = useWishlist();
  const { getProductReviews, addReview, updateReview, deleteReview, markHelpful } = useReviews();
  const { isAuthenticated, user } = useAuth();
  const product = productData[parseInt(id || '1') as keyof typeof productData] || productData[1];
  const inWishlist = isInWishlist(product.id);
  const productReviews = getProductReviews(product.id);
  
  const availableColors = product.specifications.Colors 
    ? product.specifications.Colors.split(',').map(c => c.trim())
    : [];
  
  React.useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableColors, selectedColor]);
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };
  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;
    
    if (newReviewComment.trim().length < 10) {
      alert('Please write a review with at least 10 characters.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addReview({
      productId: product.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || 'https://randomuser.me/api/portraits/women/4.jpg',
      rating: newReviewRating,
      comment: newReviewComment.trim()
    });
    
    setNewReviewRating(5);
    setNewReviewComment('');
    setIsSubmitting(false);
  };

  const handleEditReview = (reviewId: number, currentComment: string, currentRating: number) => {
    setEditingReviewId(reviewId);
    setEditComment(currentComment);
    setEditRating(currentRating);
  };

  const handleUpdateReview = (reviewId: number) => {
    if (editComment.trim().length < 10) {
      alert('Please write a review with at least 10 characters.');
      return;
    }
    updateReview(reviewId, editComment.trim(), editRating);
    setEditingReviewId(null);
  };

  // Calculate review statistics
  const calculateReviewStats = () => {
    if (productReviews.length === 0) {
      return { averageRating: 0, totalReviews: 0, ratingDistribution: [0, 0, 0, 0, 0] };
    }
    
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / productReviews.length;
    
    const ratingDistribution = [0, 0, 0, 0, 0];
    productReviews.forEach(review => {
      ratingDistribution[review.rating - 1]++;
    });
    
    return { 
      averageRating: Math.round(averageRating * 10) / 10, 
      totalReviews: productReviews.length,
      ratingDistribution
    };
  };

  // Sort reviews
  const sortedReviews = [...productReviews].sort((a, b) => {
    switch(sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const reviewStats = calculateReviewStats();

  const handleDeleteReview = (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
    }
  };
  return <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            Home
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to="/shop" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            Shop
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-96 object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => <button key={index} onClick={() => setSelectedImage(index)} className={`rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-indigo-600' : 'border-gray-200 dark:border-gray-700'}`}>
                  <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-24 object-cover" />
                </button>)}
            </div>
          </div>
          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                {product.brand}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />)}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                {product.originalPrice && <span className="text-2xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>}
              </div>
              <p className="text-green-600 dark:text-green-400 mt-2">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {product.description}
            </p>
            {/* Color Selector */}
            {availableColors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Color: <span className="text-gray-900 dark:text-white font-semibold">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {availableColors.map((color) => {
                    const colorMap: { [key: string]: string } = {
                      'Natural Titanium': 'bg-gradient-to-br from-gray-300 to-gray-400',
                      'Blue Titanium': 'bg-gradient-to-br from-blue-400 to-blue-600',
                      'White Titanium': 'bg-gradient-to-br from-gray-100 to-white',
                      'Black Titanium': 'bg-gradient-to-br from-gray-700 to-black',
                      'Gold': 'bg-gradient-to-br from-yellow-400 to-yellow-600',
                      'Silver': 'bg-gradient-to-br from-gray-300 to-gray-400',
                      'Space Gray': 'bg-gradient-to-br from-gray-600 to-gray-800',
                      'Rose Gold': 'bg-gradient-to-br from-pink-300 to-pink-400',
                      'Red': 'bg-gradient-to-br from-red-500 to-red-700',
                      'Green': 'bg-gradient-to-br from-green-500 to-green-700',
                      'Purple': 'bg-gradient-to-br from-purple-500 to-purple-700',
                    };
                    const colorClass = colorMap[color] || 'bg-gray-400';
                    const isSelected = selectedColor === color;
                    
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-12 h-12 rounded-full ${colorClass} border-2 transition-all duration-200 ${
                          isSelected 
                            ? 'border-indigo-600 dark:border-indigo-400 scale-110 shadow-lg' 
                            : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                        }`}
                        title={color}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full shadow-md"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    -
                  </button>
                  <span className="px-6 py-2 text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    +
                  </button>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button onClick={handleAddToCart} className="flex-grow" leftIcon={<ShoppingCartIcon className="w-5 h-5" />}>
                Add to Cart
              </Button>
              <Button onClick={handleWishlistToggle} variant="outline" className={inWishlist ? 'text-red-600 border-red-600' : ''}>
                <HeartIcon className={`w-5 h-5 ${inWishlist ? 'fill-red-600' : ''}`} />
              </Button>
            </div>
            {/* AR View Button */}
            {product.hasARView && <Link to={`/products/${product.id}/ar-view`} className="w-full mb-8 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                View in AR
              </Link>}
            {/* Features */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <TruckIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Free Shipping
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    1 Year Warranty
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcwIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    30-Day Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Product Details
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => <li key={index} className="flex items-start">
                    <span className="text-indigo-600 dark:text-indigo-400 mr-2">
                      •
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  </li>)}
              </ul>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Specifications
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => <div key={key} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {key}:
                    </span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {value}
                    </span>
                  </div>)}
              </div>
            </div>
          </div>
          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Customer Reviews
            </h2>

            {/* Review Statistics */}
            {productReviews.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900 dark:text-white">
                        {reviewStats.averageRating.toFixed(1)}
                      </div>
                      <div className="flex justify-center my-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.round(reviewStats.averageRating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                    <div className="flex-grow">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviewStats.ratingDistribution[rating - 1];
                        const percentage = reviewStats.totalReviews > 0 
                          ? (count / reviewStats.totalReviews) * 100 
                          : 0;
                        return (
                          <div key={rating} className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                              {rating} <StarIcon className="w-3 h-3 inline text-amber-400" />
                            </span>
                            <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-end">
                    <div className="text-center md:text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Want to share your experience?
                      </p>
                      {isAuthenticated ? (
                        <button
                          onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
                        >
                          Write a Review →
                        </button>
                      ) : (
                        <Link
                          to="/login"
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
                        >
                          Log in to Review →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sort Controls */}
            {productReviews.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {sortedReviews.length} {sortedReviews.length === 1 ? 'review' : 'reviews'}
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* Add Review Form */}
            {isAuthenticated ? (
              <div id="review-form" className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6 border-2 border-transparent hover:border-indigo-500/30 transition-colors">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Write a Review
                </h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="focus:outline-none"
                        >
                          <StarIcon
                            className={`w-8 h-8 ${
                              star <= newReviewRating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      rows={4}
                      required
                      minLength={10}
                      placeholder="Share your experience with this product (minimum 10 characters)..."
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {newReviewComment.length}/500 characters {newReviewComment.length < 10 && '(minimum 10)'}
                    </p>
                  </div>
                  <Button type="submit" disabled={isSubmitting || newReviewComment.trim().length < 10} isLoading={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Please log in to write a review
                </p>
                <Link to="/login" className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                  Log In
                </Link>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {sortedReviews.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-600 mb-4">
                    <StarIcon className="w-16 h-16 mx-auto" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                    No reviews yet
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    Be the first to share your experience with this product!
                  </p>
                </div>
              )}
              {sortedReviews.map(review => (
                <div key={review.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  {editingReviewId === review.id ? (
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditRating(star)}
                              className="focus:outline-none"
                            >
                              <StarIcon
                                className={`w-6 h-6 ${
                                  star <= editRating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdateReview(review.id)}>Save</Button>
                        <Button variant="outline" onClick={() => setEditingReviewId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <img src={review.userAvatar} alt={review.userName} className="w-12 h-12 rounded-full" />
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {review.userName}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(review.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            {user && user.id === review.userId && (
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => handleEditReview(review.id, review.comment, review.rating)}
                                  className="text-indigo-600 hover:text-indigo-700"
                                >
                                  <EditIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {review.comment}
                        </p>
                        <button
                          onClick={() => markHelpful(review.id)}
                          className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
                        >
                          <ThumbsUpIcon className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>;
};