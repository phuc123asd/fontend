import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { SlidersHorizontalIcon, ChevronDownIcon, FilterIcon, XIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
// Sample product data - same as in FeaturedProducts
const categoryMapping: Record<string, string> = {
  'Điện Thoại': 'Smartphones',
  'Laptop': 'Laptops',
  'Đồng Hồ Thông Minh': 'Smartwatches',
  'Âm Thanh': 'Audio',
  'Máy Tính Bảng': 'Tablets',
  'Game': 'Gaming',
  'Phụ Kiện': 'Accessories',
  'Flycam': 'Drones'
};


const products = [{
  id: 1,
  name: 'iPhone 15 Pro',
  price: 999,
  originalPrice: 1099,
  image: 'https://images.unsplash.com/photo-1632661674596-618e45337a12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80',
  rating: 4.8,
  category: 'Smartphones',
  brand: 'Apple',
  isNew: true
}, {
  id: 2,
  name: 'MacBook Pro M3',
  price: 1999,
  originalPrice: 2199,
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1452&q=80',
  rating: 4.9,
  category: 'Laptops',
  brand: 'Apple',
  isNew: true
}, {
  id: 3,
  name: 'Apple Watch Series 9',
  price: 399,
  originalPrice: 429,
  image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80',
  rating: 4.7,
  category: 'Smartwatches',
  brand: 'Apple'
}, {
  id: 4,
  name: 'Sony WH-1000XM5',
  price: 349,
  originalPrice: 399,
  image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80',
  rating: 4.8,
  category: 'Audio',
  brand: 'Sony'
}, {
  id: 5,
  name: 'iPad Pro M2',
  price: 799,
  originalPrice: 899,
  image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
  rating: 4.9,
  category: 'Tablets',
  brand: 'Apple',
  isNew: true
}, {
  id: 6,
  name: 'Samsung Galaxy S24 Ultra',
  price: 1199,
  originalPrice: 1299,
  image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
  rating: 4.7,
  category: 'Smartphones',
  brand: 'Samsung',
  isNew: true
}, {
  id: 7,
  name: 'Nintendo Switch OLED',
  price: 349,
  originalPrice: 379,
  image: 'https://images.unsplash.com/photo-1662979291139-44b1370fbfb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  rating: 4.8,
  category: 'Gaming',
  brand: 'Nintendo'
}, {
  id: 8,
  name: 'DJI Mini 3 Pro',
  price: 749,
  originalPrice: 799,
  image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  rating: 4.6,
  category: 'Drones',
  brand: 'DJI'
}, {
  id: 9,
  name: 'Dell XPS 15',
  price: 1499,
  originalPrice: 1699,
  image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
  rating: 4.5,
  category: 'Laptops',
  brand: 'Dell'
}, {
  id: 10,
  name: 'Samsung Galaxy Watch 6',
  price: 299,
  originalPrice: 349,
  image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1464&q=80',
  rating: 4.4,
  category: 'Smartwatches',
  brand: 'Samsung'
}, {
  id: 11,
  name: 'Google Pixel 8 Pro',
  price: 899,
  originalPrice: 999,
  image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  rating: 4.7,
  category: 'Smartphones',
  brand: 'Google',
  isNew: true
}, {
  id: 12,
  name: 'Logitech MX Master 3S',
  price: 99,
  originalPrice: 119,
  image: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  rating: 4.9,
  category: 'Accessories',
  brand: 'Logitech'
}];
const categories = ['Tất Cả', 'Điện Thoại', 'Laptop', 'Đồng Hồ Thông Minh', 'Âm Thanh', 'Máy Tính Bảng', 'Game', 'Phụ Kiện', 'Flycam'];
const brands = ['Tất Cả', 'Apple', 'Samsung', 'Sony', 'Google', 'Dell', 'Nintendo', 'DJI', 'Logitech'];
const sortOptions = ['Nổi Bật', 'Giá: Thấp đến Cao', 'Giá: Cao đến Thấp', 'Mới Nhất', 'Đánh Giá Cao'];
export const Shop = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('Tất Cả');
  const [selectedBrand, setSelectedBrand] = useState('Tất Cả');
  const [selectedSort, setSelectedSort] = useState('Nổi Bật');
  const [priceRange, setPriceRange] = useState([0, 2500]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);
const filteredProducts = products
  .filter(product => {
    // Lọc theo category
    if (selectedCategory === 'Tất Cả') return true;

    const englishCategory =
      categoryMapping[selectedCategory] ?? selectedCategory; // fallback
    return product.category === englishCategory;
  })
  .filter(product => {
    // Lọc theo brand
    if (selectedBrand === 'Tất Cả') return true;
    return product.brand === selectedBrand;
  })
  .filter(product => {
    // Lọc theo giá
    return product.price >= priceRange[0] && product.price <= priceRange[1];
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case 'Giá: Thấp đến Cao':
        return a.price - b.price;
      case 'Giá: Cao đến Thấp':
        return b.price - a.price;
      case 'Mới Nhất':
        return a.isNew ? -1 : b.isNew ? 1 : 0;
      case 'Đánh Giá Cao':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Tất Cả Sản Phẩm
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Khám phá bộ sưu tập sản phẩm công nghệ cao cấp
          </p>
        </div>
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Button onClick={() => setIsMobileFilterOpen(true)} variant="outline" className="w-full" leftIcon={<FilterIcon className="w-4 h-4" />}>
            Lọc Sản Phẩm
          </Button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sticky top-24 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                  <SlidersHorizontalIcon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Bộ Lọc
                </h3>
                <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400 p-0 h-auto hover:scale-100" onClick={() => {
                setSelectedCategory('Tất Cả');
                setSelectedBrand('Tất Cả');
                setPriceRange([0, 2500]);
              }}>
                  Xóa tất cả bộ lọc
                </Button>
              </div>
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Danh Mục
                </h4>
                <div className="space-y-2">
                  {categories.map(category => <div key={category} className="flex items-center">
                      <input type="radio" id={`category-${category}`} name="category" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer" checked={selectedCategory === category} onChange={() => setSelectedCategory(category)} />
                      <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {category}
                      </label>
                    </div>)}
                </div>
              </div>
              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Thương Hiệu
                </h4>
                <div className="space-y-2">
                  {brands.map(brand => <div key={brand} className="flex items-center">
                      <input type="radio" id={`brand-${brand}`} name="brand" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={selectedBrand === brand} onChange={() => setSelectedBrand(brand)} />
                      <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {brand}
                      </label>
                    </div>)}
                </div>
              </div>
              {/* Price Range */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Khoảng Giá
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ${priceRange[0]}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ${priceRange[1]}
                    </span>
                  </div>
                  <input type="range" min="0" max="2500" step="100" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>
              </div>
            </div>
          </div>
          {/* Mobile Filter Sidebar */}
          {isMobileFilterOpen && <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)}></div>
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-xl p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-xl text-gray-900 dark:text-white">
                    Bộ Lọc
                  </h3>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
                <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400 p-0 h-auto mb-6" onClick={() => {
              setSelectedCategory('Tất Cả');
              setSelectedBrand('Tất Cả');
              setPriceRange([0, 2500]);
            }}>
                  Xóa tất cả bộ lọc
                </Button>
                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Danh Mục
                  </h4>
                  <div className="space-y-2">
                    {categories.map(category => <div key={category} className="flex items-center">
                        <input type="radio" id={`mobile-category-${category}`} name="mobile-category" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={selectedCategory === category} onChange={() => setSelectedCategory(category)} />
                        <label htmlFor={`mobile-category-${category}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {category}
                        </label>
                      </div>)}
                  </div>
                </div>
                {/* Brands */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Thương Hiệu
                  </h4>
                  <div className="space-y-2">
                    {brands.map(brand => <div key={brand} className="flex items-center">
                        <input type="radio" id={`mobile-brand-${brand}`} name="mobile-brand" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={selectedBrand === brand} onChange={() => setSelectedBrand(brand)} />
                        <label htmlFor={`mobile-brand-${brand}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {brand}
                        </label>
                      </div>)}
                  </div>
                </div>
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Khoảng Giá
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ${priceRange[0]}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ${priceRange[1]}
                      </span>
                    </div>
                    <input type="range" min="0" max="2500" step="100" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                  </div>
                </div>
                <Button onClick={() => setIsMobileFilterOpen(false)} className="w-full">
                  Áp Dụng Bộ Lọc
                </Button>
              </div>
            </div>}
          {/* Product Grid */}
          <div className="flex-grow">
            {/* Sort & Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600 dark:text-gray-400">
                Hiển thị{' '}
                <span className="font-medium">{sortedProducts.length}</span>{' '}
                kết quả
              </p>
              <div className="relative">
                <select value={selectedSort} onChange={e => setSelectedSort(e.target.value)} className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-4 pr-10 text-gray-700 dark:text-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {sortOptions.map(option => <option key={option} value={option}>
                      {option}
                    </option>)}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
            {/* Products */}
            {sortedProducts.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map(product => <ProductCard key={product.id} {...product} />)}
              </div> : <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Thử điều chỉnh bộ lọc để tìm sản phẩm bạn muốn.
                </p>
                <Button onClick={() => {
              setSelectedCategory('Tất Cả');
              setSelectedBrand('Tất Cả');
              setPriceRange([0, 2500]);
            }}>
                  Xóa Bộ Lọc
                </Button>
              </div>}
            {/* Pagination */}
            {sortedProducts.length > 0 && <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">
                    Trước
                  </button>
                  <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white">
                    1
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    2
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    3
                  </button>
                  <span className="px-3 py-2 text-gray-600 dark:text-gray-400">
                    ...
                  </span>
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    8
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    Sau
                  </button>
                </nav>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};