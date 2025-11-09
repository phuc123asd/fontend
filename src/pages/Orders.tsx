import React from 'react';
import { Link } from 'react-router-dom';
import { PackageIcon, ChevronRightIcon } from 'lucide-react';
const mockOrders = [{
  id: '123456',
  date: '2024-01-15',
  status: 'Đã Giao',
  total: 1098.9,
  items: 1
}, {
  id: '123457',
  date: '2024-01-10',
  status: 'Đang Vận Chuyển',
  total: 349.0,
  items: 1
}, {
  id: '123458',
  date: '2024-01-05',
  status: 'Đang Xử Lý',
  total: 1999.0,
  items: 1
}];
export const Orders = () => {
  return <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Đơn Hàng Của Tôi
        </h1>
        {mockOrders.length === 0 ? <div className="text-center py-16">
            <PackageIcon className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Chưa có đơn hàng
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Bắt đầu mua sắm để xem đơn hàng tại đây
            </p>
            <Link to="/shop" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Bắt Đầu Mua Sắm
            </Link>
          </div> : <div className="space-y-4">
            {mockOrders.map(order => <Link key={order.id} to={`/orders/${order.id}`} className="block bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Đơn hàng #{order.id}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Đã Giao' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : order.status === 'Đang Vận Chuyển' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                      <span>Ngày: {order.date}</span>
                      <span>{order.items} sản phẩm</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-6 h-6 text-gray-400" />
                </div>
              </Link>)}
          </div>}
      </div>
    </div>;
};