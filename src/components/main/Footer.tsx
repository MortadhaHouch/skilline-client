import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary-950 py-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h3 className="text-2xl font-semibold">Skilline</h3>
          <p className="text-sm mt-2">An educational journey through the world of card games, making learning fun!</p>
        </div>

        {/* Middle Section: Quick Links & Educational Resources */}
        <div className="flex flex-wrap justify-center md:justify-start">
          {/* Quick Links */}
          <div className="mx-6 mb-4 md:mb-0">
            <h4 className="font-medium text-lg">Quick Links</h4>
            <ul className="text-sm mt-2">
              <li><a href="/about" className="hover:text-blue-400">About Us</a></li>
              <li><a href="/faq" className="hover:text-blue-400">FAQ</a></li>
              <li><a href="/terms" className="hover:text-blue-400">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-blue-400">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Educational Resources */}
          <div className="mx-6 mb-4 md:mb-0">
            <h4 className="font-medium text-lg">Educational Resources</h4>
            <ul className="text-sm mt-2">
              <li><a href="/tutorials" className="hover:text-blue-400">Tutorials</a></li>
              <li><a href="/courses" className="hover:text-blue-400">Courses</a></li>
              <li><a href="/community" className="hover:text-blue-400">Community</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="mx-6 mb-4 md:mb-0">
            <h4 className="font-medium text-lg">Support</h4>
            <ul className="text-sm mt-2">
              <li><a href="/contact" className="hover:text-blue-400">Contact Us</a></li>
              <li><a href="/support" className="hover:text-blue-400">Support Center</a></li>
            </ul>
          </div>
        </div>

        {/* Right Section: Social Media Icons */}
        <div className="flex mt-6 md:mt-0 space-x-6 text-2xl">
          <a href="https://facebook.com" className="hover:text-blue-400"><i className="fab fa-facebook"></i></a>
          <a href="https://twitter.com" className="hover:text-blue-400"><i className="fab fa-twitter"></i></a>
          <a href="https://instagram.com" className="hover:text-blue-400"><i className="fab fa-instagram"></i></a>
          <a href="https://youtube.com" className="hover:text-red-500"><i className="fab fa-youtube"></i></a>
        </div>
      </div>

      {/* Bottom Section: Copyright */}
      <div className="text-center mt-8 border-t pt-4 text-sm">
        <p>&copy; 2025 Skilline. All rights reserved. <br /> Built with ❤️ for fun and learning.</p>
      </div>
    </footer>
  );
};

export default Footer;
