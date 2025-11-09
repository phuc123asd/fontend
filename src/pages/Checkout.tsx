import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { CreditCardIcon, LockIcon, CheckCircleIcon } from 'lucide-react';
export const Checkout = () => {
  const {
    cartItems,
    cartTotal,
    clearCart
  } = useCart();
  const {
    isAuthenticated,
    user
  } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Create order
    const orderId = Math.floor(Math.random() * 1000000);
    clearCart();
    setIsProcessing(false);
    navigate(`/orders/${orderId}`);
  };
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }
  const tax = cartTotal * 0.1;
  const total = cartTotal + tax;
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Checkout
        </h1>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                {step > 1 ? <CheckCircleIcon className="w-6 h-6" /> : '1'}
              </div>
              <div className={`w-20 h-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'}`} />
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                2
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2 gap-24">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Shipping
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Payment
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 ? <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Shipping Information
                </h2>
                <form onSubmit={handleShippingSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input type="text" required value={shippingInfo.fullName} onChange={e => setShippingInfo({
                    ...shippingInfo,
                    fullName: e.target.value
                  })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input type="email" required value={shippingInfo.email} onChange={e => setShippingInfo({
                    ...shippingInfo,
                    email: e.target.value
                  })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address
                      </label>
                      <input type="text" required value={shippingInfo.address} onChange={e => setShippingInfo({
                    ...shippingInfo,
                    address: e.target.value
                  })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <input type="text" required value={shippingInfo.city} onChange={e => setShippingInfo({
                    ...shippingInfo,
                    city: e.target.value
                  })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        State
                      </label>
                      <input type="text" required value={shippingInfo.state} onChange={e => setShippingInfo({
                    ...shippingInfo,
                    state: e.target.value
                  })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ZIP Code
                      </label>
                      <input type="text" required value={shippingInfo.zipCode} onChange={e => setShippingInfo({
                    ...shippingInfo,
                    zipCode: e.target.value
                  })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input type="tel" required value={shippingInfo.phone} onChange={e => setShippingInfo({
                    ...shippingInfo,
                    phone: e.target.value
                  })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-6">
                    Continue to Payment
                  </Button>
                </form>
              </div> : <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <LockIcon className="w-5 h-5 mr-2 text-green-600" />
                  Payment Information
                </h2>
                <form onSubmit={handlePaymentSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input type="text" required placeholder="1234 5678 9012 3456" value={paymentInfo.cardNumber} onChange={e => setPaymentInfo({
                      ...paymentInfo,
                      cardNumber: e.target.value
                    })} className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cardholder Name
                      </label>
                      <input type="text" required value={paymentInfo.cardName} onChange={e => setPaymentInfo({
                    ...paymentInfo,
                    cardName: e.target.value
                  })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expiry Date
                        </label>
                        <input type="text" required placeholder="MM/YY" value={paymentInfo.expiryDate} onChange={e => setPaymentInfo({
                      ...paymentInfo,
                      expiryDate: e.target.value
                    })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CVV
                        </label>
                        <input type="text" required placeholder="123" value={paymentInfo.cvv} onChange={e => setPaymentInfo({
                      ...paymentInfo,
                      cvv: e.target.value
                    })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="saveCard" checked={paymentInfo.saveCard} onChange={e => setPaymentInfo({
                    ...paymentInfo,
                    saveCard: e.target.checked
                  })} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                      <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        Save card for future purchases
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button type="submit" disabled={isProcessing} className="flex-1">
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </form>
              </div>}
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {cartItems.map(item => <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>)}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};