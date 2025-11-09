import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon, MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react';
export const Footer = () => {
  return <footer className="bg-gray-100 dark:bg-gray-900 pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="mb-12 p-6 bg-indigo-600 dark:bg-indigo-700 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-2">
                Subscribe to our newsletter
              </h3>
              <p className="text-indigo-100">
                Get the latest news and exclusive offers
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input type="email" placeholder="Your email" className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none" aria-label="Email address" />
              <button className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-r-lg transition-colors" aria-label="Subscribe">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              TechHub
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The ultimate destination for premium technology products and
              accessories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <FacebookIcon className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <TwitterIcon className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <InstagramIcon className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <YoutubeIcon className="w-5 h-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Warranty
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  123 Tech Street, San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center">
                <MailIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  support@techhub.com
                </span>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} TechHub. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-8 w-auto" />
              <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" className="h-8 w-auto" />
              <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-8 w-auto" />
              <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="Apple Pay" className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>;
};