import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { UsersIcon, TrophyIcon, HeartIcon, ZapIcon, ArrowRightIcon } from 'lucide-react';
export const About = () => {
  const stats = [{
    label: 'Years in Business',
    value: '10+'
  }, {
    label: 'Happy Customers',
    value: '50K+'
  }, {
    label: 'Products Sold',
    value: '100K+'
  }, {
    label: 'Countries Served',
    value: '25+'
  }];
  const values = [{
    icon: <TrophyIcon className="w-8 h-8" />,
    title: 'Quality First',
    description: 'We only offer premium, authentic products from trusted brands.'
  }, {
    icon: <HeartIcon className="w-8 h-8" />,
    title: 'Customer Focus',
    description: "Your satisfaction is our priority. We're here to help every step of the way."
  }, {
    icon: <ZapIcon className="w-8 h-8" />,
    title: 'Innovation',
    description: 'We stay ahead of tech trends to bring you the latest and greatest.'
  }, {
    icon: <UsersIcon className="w-8 h-8" />,
    title: 'Community',
    description: 'Join thousands of tech enthusiasts who trust TechHub for their needs.'
  }];
  const team = [{
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    image: 'https://randomuser.me/api/portraits/women/1.jpg'
  }, {
    name: 'Michael Chen',
    role: 'Chief Technology Officer',
    image: 'https://randomuser.me/api/portraits/men/2.jpg'
  }, {
    name: 'Emily Rodriguez',
    role: 'Head of Customer Success',
    image: 'https://randomuser.me/api/portraits/women/3.jpg'
  }, {
    name: 'David Kim',
    role: 'Product Manager',
    image: 'https://randomuser.me/api/portraits/men/4.jpg'
  }];
  return <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About TechHub
            </h1>
            <p className="text-xl text-indigo-100">
              Your trusted destination for premium technology products since
              2014
            </p>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <div key={index} className="text-center">
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>)}
          </div>
        </div>
      </section>
      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Founded in 2014, TechHub started with a simple mission: to
                  make premium technology accessible to everyone. What began as
                  a small online store has grown into a trusted destination for
                  tech enthusiasts worldwide.
                </p>
                <p>
                  We believe technology should enhance lives, not complicate
                  them. That's why we carefully curate our selection, ensuring
                  every product meets our high standards for quality,
                  innovation, and value.
                </p>
                <p>
                  Today, we're proud to serve over 50,000 happy customers across
                  25 countries, offering everything from the latest smartphones
                  to cutting-edge accessories. But our commitment remains the
                  same: exceptional products, outstanding service, and a passion
                  for technology that drives everything we do.
                </p>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Team collaboration" className="rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </section>
      {/* Values Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              These core principles guide everything we do at TechHub
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full text-indigo-600 dark:text-indigo-400 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>)}
          </div>
        </div>
      </section>
      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The passionate people behind TechHub
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => <div key={index} className="text-center">
                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.role}
                </p>
              </div>)}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Experience the TechHub Difference?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover why TechHub is
            the premier destination for tech enthusiasts.
          </p>
          <Button as={Link} to="/shop" size="lg" className="bg-white text-indigo-600 hover:bg-gray-100" rightIcon={<ArrowRightIcon className="w-5 h-5" />}>
            Start Shopping
          </Button>
        </div>
      </section>
    </div>;
};