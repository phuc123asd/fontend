import React, { useState, lazy } from 'react';
import { Button } from '../components/ui/Button';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon, SendIcon } from 'lucide-react';
export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const contactInfo = [{
    icon: <MapPinIcon className="w-6 h-6" />,
    title: 'Visit Us',
    content: '123 Tech Street, San Francisco, CA 94107'
  }, {
    icon: <PhoneIcon className="w-6 h-6" />,
    title: 'Call Us',
    content: '+1 (555) 123-4567'
  }, {
    icon: <MailIcon className="w-6 h-6" />,
    title: 'Email Us',
    content: 'support@techhub.com'
  }, {
    icon: <ClockIcon className="w-6 h-6" />,
    title: 'Business Hours',
    content: 'Mon-Fri: 9AM-6PM PST'
  }];
  return <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-indigo-100">
              Have a question? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>
      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full text-indigo-600 dark:text-indigo-400 mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {info.content}
                </p>
              </div>)}
          </div>
          {/* Contact Form & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Send Us a Message
              </h2>
              {isSubmitted && <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-200">
                    Thank you for your message! We'll get back to you soon.
                  </p>
                </div>}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="How can we help?" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none" placeholder="Tell us more about your inquiry..." />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full" rightIcon={<SendIcon className="w-5 h-5" />}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
            {/* Map */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Location
              </h2>
              <div className="bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden h-96">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0977573578644!2d-122.39492668468198!3d37.78924397975767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807ddf427e99%3A0x47e87febfb20c2c5!2sSan%20Francisco%2C%20CA%2094107!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus" width="100%" height="100%" style={{
                border: 0
              }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="TechHub Location" />
              </div>
              {/* FAQ Section */}
              <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      What are your shipping times?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We offer free shipping on orders over $50. Standard
                      delivery takes 3-5 business days.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      What is your return policy?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We offer a 30-day return policy on all products. Items
                      must be in original condition.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Do you offer warranty?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All products come with a 1-year manufacturer warranty.
                      Extended warranties available.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};