import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Button } from '../components/ui/Button';
import { StarIcon, HeartIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon, RotateCcwIcon } from 'lucide-react';
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
interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}
const reviews: Review[] = [{
  id: 1,
  userName: 'John Smith',
  userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  rating: 5,
  date: '2024-01-15',
  comment: 'Absolutely love this phone! The camera quality is outstanding and the titanium design feels premium. Best iPhone yet!',
  helpful: 24
}, {
  id: 2,
  userName: 'Sarah Johnson',
  userAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  rating: 4,
  date: '2024-01-10',
  comment: 'Great phone overall. The A17 Pro chip is incredibly fast. Only minor complaint is the price, but you get what you pay for.',
  helpful: 18
}, {
  id: 3,
  userName: 'Michael Chen',
  userAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  rating: 5,
  date: '2024-01-05',
  comment: 'The battery life is impressive and the USB-C port is a welcome change. Highly recommend for anyone upgrading from an older iPhone.',
  helpful: 32
}];
export const ProductDetail = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const {
    addToCart
  } = useCart();
  const {
    addToWishlist,
    isInWishlist,
    removeFromWishlist
  } = useWishlist();
  const product = productData[parseInt(id || '1') as keyof typeof productData] || productData[1];
  const inWishlist = isInWishlist(product.id);
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
            {product.hasARView && <Button as={Link} to={`/products/${product.id}/ar-view`} variant="outline" className="w-full mb-8" leftIcon={<div className="w-5 h-5" />}>
                View in AR
              </Button>}
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
            <div className="space-y-6">
              {reviews.map(review => <div key={review.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
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
                        <div className="flex">
                          {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />)}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {review.comment}
                      </p>
                      <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
};