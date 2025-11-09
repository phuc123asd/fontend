import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircleIcon, TruckIcon, PackageIcon, MapPinIcon } from 'lucide-react';
export const OrderDetail = () => {
  const {
    orderId
  } = useParams<{
    orderId: string;
  }>();
  // Mock order data
  const order = {
    id: orderId,
    date: new Date().toLocaleDateString(),
    status: 'Processing',
    total: 1098.9,
    items: [{
      id: 1,
      name: 'iPhone 15 Pro',
      price: 999,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1632661674596-618e45337a12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80'
    }],
    shipping: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107'
    },
    tracking: 'TRK' + Math.random().toString(36).substring(7).toUpperCase()
  };
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400 mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Order Confirmed!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Thank you for your purchase. Your order has been received and is
                being processed.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Order Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Order Number
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    #{order.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Order Date
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.date}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </p>
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tracking Number
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.tracking}
                  </p>
                </div>
              </div>
            </div>
            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Items Ordered
              </h3>
              <div className="space-y-4">
                {order.items.map(item => <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2" />
                Shipping Address
              </h3>
              <div className="text-gray-600 dark:text-gray-400">
                <p>{order.shipping.name}</p>
                <p>{order.shipping.address}</p>
                <p>
                  {order.shipping.city}, {order.shipping.state}{' '}
                  {order.shipping.zipCode}
                </p>
              </div>
            </div>
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${(order.total / 1.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>${(order.total / 1.1 * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button as={Link} to="/shop" className="w-full mb-4">
                Continue Shopping
              </Button>
              <Button as={Link} to="/orders" variant="outline" className="w-full">
                View All Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};