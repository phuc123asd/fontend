import { ProductCard } from '../product/ProductCard';
import { Button } from '../ui/Button';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
// Sample product data
const featuredProducts = [{
  id: 1,
  name: 'iPhone 15 Pro',
  price: 999,
  originalPrice: 1099,
  image: 'https://images.unsplash.com/photo-1632661674596-618e45337a12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80',
  rating: 4.8,
  category: 'Smartphones',
  isNew: true,
  isFeatured: true
}, {
  id: 2,
  name: 'MacBook Pro M3',
  price: 1999,
  originalPrice: 2199,
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1452&q=80',
  rating: 4.9,
  category: 'Laptops',
  isNew: true,
  isFeatured: true
}, {
  id: 3,
  name: 'Apple Watch Series 9',
  price: 399,
  originalPrice: 429,
  image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80',
  rating: 4.7,
  category: 'Smartwatches',
  isFeatured: true
}, {
  id: 4,
  name: 'Sony WH-1000XM5',
  price: 349,
  originalPrice: 399,
  image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80',
  rating: 4.8,
  category: 'Audio',
  isFeatured: true
}, {
  id: 5,
  name: 'iPad Pro M2',
  price: 799,
  originalPrice: 899,
  image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
  rating: 4.9,
  category: 'Tablets',
  isNew: true,
  isFeatured: true
}, {
  id: 6,
  name: 'Samsung Galaxy S24 Ultra',
  price: 1199,
  originalPrice: 1299,
  image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
  rating: 4.7,
  category: 'Smartphones',
  isNew: true,
  isFeatured: true
}, {
  id: 7,
  name: 'Nintendo Switch OLED',
  price: 349,
  originalPrice: 379,
  image: 'https://images.unsplash.com/photo-1662979291139-44b1370fbfb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  rating: 4.8,
  category: 'Gaming',
  isFeatured: true
}, {
  id: 8,
  name: 'DJI Mini 3 Pro',
  price: 749,
  originalPrice: 799,
  image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  rating: 4.6,
  category: 'Drones',
  isFeatured: true
}];
export const FeaturedProducts = () => {
  return <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Khám phá bộ sưu tập sản phẩm công nghệ cao cấp được tuyển chọn
            </p>
          </div>
          <Button as={Link} to="/shop" variant="outline" className="mt-6 md:mt-0" rightIcon={<ArrowRightIcon className="w-4 h-4" />}>
            Xem Tất Cả
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => <ProductCard key={product.id} {...product} />)}
        </div>
      </div>
    </section>;
};