import React from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpenIcon className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">BookVault</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your digital library for discovering and reading amazing books. 
              Access thousands of titles across all genres.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Fiction</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Non-Fiction</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Business</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Self-Help</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-gray-400">
            &copy; 2024 BookVault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;