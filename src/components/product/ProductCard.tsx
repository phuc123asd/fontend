import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon, StarIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
}
export const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  category,
  isNew = false,
  isFeatured = false
}: ProductCardProps) => {
  const {
    addToCart
  } = useCart();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  } = useWishlist();
  const discount = originalPrice ? Math.round((originalPrice - price) / originalPrice * 100) : 0;
  const inWishlist = isInWishlist(id);
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id,
      name,
      price,
      image
    });
  };
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name,
        price,
        image,
        category
      });
    }
  };
  return <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isNew && <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
            New
          </span>}
        {discount > 0 && <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
            -{discount}%
          </span>}
        {isFeatured && <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded">
            Featured
          </span>}
      </div>
      {/* Wishlist button */}
      <button onClick={handleWishlistToggle} className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 backdrop-blur-sm" aria-label="Add to wishlist">
        <HeartIcon className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
      </button>
      {/* Image */}
      <Link to={`/product/${id}`} className="block relative aspect-square overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
      </Link>
      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${id}`} className="block">
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {category}
          </span>
          <h3 className="mt-1 text-lg font-medium text-gray-900 dark:text-white truncate">
            {name}
          </h3>
          {/* Rating */}
          <div className="flex items-center mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />)}
            </div>
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
              ({rating.toFixed(1)})
            </span>
          </div>
          {/* Price */}
          <div className="mt-2 flex items-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${price.toFixed(2)}
            </span>
            {originalPrice && <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>}
          </div>
        </Link>
        {/* Add to cart button */}
        <button onClick={handleAddToCart} className="mt-3 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center justify-center transition-colors" aria-label="Add to cart">
          <ShoppingCartIcon className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>;
};