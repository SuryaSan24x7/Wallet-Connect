import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 border-t-2 border-orange-500 text-white py-4 shadow-lg">
      <div className="container mx-auto text-center">
        <p className="text-sm">© 2024 Wallet Connect Demo. All rights reserved.</p>
        <p className="text-xs mt-2 text-gray-400">Made with <span className="text-orange-500">♦</span> using React and Tailwind CSS</p>
      </div>
    </footer>
  );
};

export default Footer;
