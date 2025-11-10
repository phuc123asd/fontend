import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useReviews } from '../contexts/ReviewContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { StarIcon, HeartIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon, RotateCcwIcon, ThumbsUpIcon, EditIcon, TrashIcon } from 'lucide-react';

// Kiểu dữ liệu từ API
interface ApiProduct {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating?: number;
  category: string;
  brand: string;
  isNew?: boolean;
  detail?: {
    id?: string;
    images?: string[];
    rating?: number;
    reviewCount?: number;
    description?: string;
    features?: string[];
    specifications?: Record<string, string>;
    inStock?: boolean;
    hasARView?: boolean;
    product?: string;
  };
}

// Kiểu dữ liệu chuẩn hóa dùng trong app
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  description: string;
  category: string;
  colors: string[];
  stock: number;
  brand: string;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  hasARView: boolean;
  isNew: boolean;
}

// Mock product data - dùng fallback nếu API fail
const productData: Record<number, Product> = {
  1: {
    id: 1,
    name: '',
    price: 999,
    originalPrice: 1099,
    image: '',
    images: [
      '',
      '',
      ''
    ],
    rating: 4.8,
    reviewCount: 256,
    category: 'Smartphones',
    brand: 'Apple',
    description: 'iPhone 15 Pro mang đến thiết kế titanium tuyệt đẹp, chip A17 Pro và hệ thống camera tiên tiến. Trải nghiệm sức mạnh nhiếp ảnh chuyên nghiệp trong túi của bạn.',
    features: [
      'Chip A17 Pro cho hiệu suất cực nhanh',
      'Hệ thống camera Pro với camera chính 48MP',
      'Thiết kế titanium với Ceramic Shield',
      'Nút hành động cho phím tắt nhanh',
      'Kết nối USB-C',
      'Pin dùng cả ngày'
    ],
    specifications: {
      Display: 'Màn hình Super Retina XDR 6.1 inch',
      Chip: 'Chip A17 Pro',
      Camera: '48MP Chính | 12MP Siêu rộng | 12MP Telephoto',
      Battery: 'Phát lại video lên đến 23 giờ',
      Storage: '128GB, 256GB, 512GB, 1TB',
      Colors: 'Titanium Tự Nhiên, Titanium Xanh, Titanium Trắng, Titanium Đen'
    },
    inStock: true,
    hasARView: true,
    isNew: true,
    colors: ['Titanium Tự Nhiên', 'Titanium Xanh', 'Titanium Trắng', 'Titanium Đen'],
    stock: 999
  }
};

const defaultProduct: Product = {
  id: 1,
  name: "Default Product",
  price: 0,
  originalPrice: 0,
  image: "",
  images: [],
  rating: 0,
  reviewCount: 0,
  description: "",
  category: "",
  colors: [],
  stock: 0,
  brand: "",
  features: [],
  specifications: {},
  inStock: true,
  hasARView: false,
  isNew: false
};

function normalizeProduct(apiData: ApiProduct): Product {
  const detail = apiData.detail || {};

  // Colors từ specifications nếu có
  const colors = detail.specifications?.Colors
    ? detail.specifications.Colors.split(',').map(c => c.trim())
    : [];

  return {
    ...defaultProduct, // Base từ default để tránh lỗi thiếu field
    id: Number(apiData.id) || defaultProduct.id,
    name: apiData.name || defaultProduct.name,
    price: Number(apiData.price) || defaultProduct.price,
    originalPrice: Number(apiData.originalPrice) || defaultProduct.originalPrice,
    image: apiData.image || defaultProduct.image,
    images: detail.images || [defaultProduct.image],
    rating: detail.rating ?? apiData.rating ?? defaultProduct.rating,
    reviewCount: detail.reviewCount ?? defaultProduct.reviewCount,
    category: apiData.category || defaultProduct.category,
    brand: apiData.brand || defaultProduct.brand,
    description: detail.description || defaultProduct.description,
    features: detail.features || defaultProduct.features,
    specifications: detail.specifications || defaultProduct.specifications,
    inStock: detail.inStock ?? true,
    hasARView: detail.hasARView ?? false,
    isNew: apiData.isNew ?? false,
    colors,
    stock: detail.inStock ? 999 : 0 // Giả sử stock lớn nếu inStock true
  };
}

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "1", 10);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true); // Thêm state loading
  const [error, setError] = useState<string | null>(null); // Thêm state error

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { getProductReviews, addReview, updateReview, deleteReview, markHelpful } = useReviews();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<Product>(defaultProduct);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching product with ID:', id); // Debug log
        const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiProduct = await response.json();
        console.log('API data received:', data); // Debug log
        const normalized = normalizeProduct(data);
        setProduct(normalized);
      } catch (err) {
        console.error('Fetch error:', err); // Debug log
        setError(`Không thể tải sản phẩm: ${(err as Error).message}. Sử dụng dữ liệu mẫu.`);
        // Fallback to mock data
        const mock = productData[productId] || defaultProduct;
        setProduct(mock);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setLoading(false);
      setError('ID sản phẩm không hợp lệ.');
    }
  }, [id]);

  const inWishlist = isInWishlist(productId);
  const productReviews = getProductReviews(productId);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: productId,
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
      alert('Vui lòng viết đánh giá ít nhất 10 ký tự.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    addReview({
      productId: productId,
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
      alert('Vui lòng viết đánh giá ít nhất 10 ký tự.');
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
    switch (sortBy) {
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
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      deleteReview(reviewId);
    }
  };

  // Loading và Error UI
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Lỗi tải dữ liệu</h2>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
          {/* Vẫn render với mock data */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            Trang Chủ
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to="/shop" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            Cửa Hàng
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img src={product.images[selectedImage] || product.image} alt={product.name} className="w-full h-96 object-cover" />
            </div>
            {product.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-indigo-600' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{product.brand}</span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.rating} ({product.reviewCount} đánh giá)
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                {product.originalPrice > 0 && (
                  <span className="text-2xl text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>
              <p className="text-green-600 dark:text-green-400 mt-2">
                {product.inStock ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
              </p>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">{product.description}</p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Số lượng</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    disabled={!product.inStock}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 text-gray-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    disabled={!product.inStock || quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="flex-grow"
                leftIcon={<ShoppingCartIcon className="w-5 h-5" />}
                disabled={!product.inStock}
              >
                Thêm vào giỏ
              </Button>
              <Button
                onClick={handleWishlistToggle}
                variant="outline"
                className={inWishlist ? 'text-red-600 border-red-600' : ''}
              >
                <HeartIcon className={`w-5 h-5 ${inWishlist ? 'fill-red-600' : ''}`} />
              </Button>
            </div>

            {/* AR View Button */}
            {product.hasARView && (
              <Link
                to={`/products/${product.id}/ar-view`}
                className="w-full mb-8 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="mr-2">🔮</span> Xem AR
              </Link>
            )}

            {/* Features */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <TruckIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Miễn phí vận chuyển</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Bảo hành 1 năm</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcwIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Đổi trả trong 30 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Chi Tiết Sản Phẩm</h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tính Năng Chính</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Thông Số Kỹ Thuật</h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-b-0">
                    <span className="font-semibold text-gray-900 dark:text-white">{key}:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section - Phần bình luận/đánh giá được khôi phục đầy đủ */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Đánh Giá Khách Hàng</h2>

            {/* Review Statistics */}
            {productReviews.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900 dark:text-white">{reviewStats.averageRating.toFixed(1)}</div>
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
                        {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'đánh giá' : 'đánh giá'}
                      </p>
                    </div>
                    <div className="flex-grow">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviewStats.ratingDistribution[rating - 1];
                        const percentage =
                          reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
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
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-end">
                    <div className="text-center md:text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Muốn chia sẻ trải nghiệm của bạn?</p>
                      {isAuthenticated ? (
                        <button
                          onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
                        >
                          Viết Đánh Giá →
                        </button>
                      ) : (
                        <Link
                          to="/login"
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
                        >
                          Đăng Nhập để Đánh Giá →
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
                  Hiển thị {sortedReviews.length} {sortedReviews.length === 1 ? 'đánh giá' : 'đánh giá'}
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Sắp xếp:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="highest">Đánh giá cao nhất</option>
                    <option value="lowest">Đánh giá thấp nhất</option>
                    <option value="helpful">Hữu ích nhất</option>
                  </select>
                </div>
              </div>
            )}

            {/* Add Review Form */}
            {isAuthenticated ? (
              <div id="review-form" className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6 border-2 border-transparent hover:border-indigo-500/30 transition-colors">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Viết Đánh Giá</h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Xếp hạng</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setNewReviewRating(star)} className="focus:outline-none">
                          <StarIcon
                            className={`w-8 h-8 ${
                              star <= newReviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Đánh Giá Của Bạn <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      rows={4}
                      required
                      minLength={10}
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này (tối thiểu 10 ký tự)..."
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {newReviewComment.length}/500 ký tự {newReviewComment.length < 10 && '(tối thiểu 10)'}
                    </p>
                  </div>
                  <Button type="submit" disabled={isSubmitting || newReviewComment.trim().length < 10} isLoading={isSubmitting}>
                    {isSubmitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Vui lòng đăng nhập để viết đánh giá</p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  Đăng Nhập
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
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">Chưa có đánh giá</p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    Hãy là người đầu tiên chia sẻ trải nghiệm về sản phẩm này!
                  </p>
                </div>
              )}
              {sortedReviews.map(review => (
                <div key={review.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  {editingReviewId === review.id ? (
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Xếp hạng</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button" onClick={() => setEditRating(star)} className="focus:outline-none">
                              <StarIcon
                                className={`w-6 h-6 ${
                                  star <= editRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'
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
                        <Button onClick={() => handleUpdateReview(review.id)}>Lưu</Button>
                        <Button variant="outline" onClick={() => setEditingReviewId(null)}>
                          Hủy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <img src={review.userAvatar} alt={review.userName} className="w-12 h-12 rounded-full" />
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{review.userName}</h4>
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
                                    i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'
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
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{review.comment}</p>
                        <button
                          onClick={() => markHelpful(review.id)}
                          className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
                        >
                          <ThumbsUpIcon className="w-4 h-4" />
                          Hữu ích ({review.helpful})
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
    </div>
  );
};