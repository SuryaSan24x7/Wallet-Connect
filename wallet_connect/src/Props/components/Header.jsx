import React from 'react';
import { Link } from 'react-router-dom';
const Header = () => {
  return (
   <div>
      
      <nav className="bg-gradient-to-r from-slate-900 to-slate-800 border-b-2 border-orange-500 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-bold">
            <span className="text-orange-500">Wallet</span> Connect Demo
          </div>
          <div>
            <Link to="/" className="hover:text-orange-400 transition duration-200 font-semibold">Home</Link>
          </div>
        </div>
      </nav>
      <div className="container mx-auto text-center bg-gradient-to-r from-slate-900 to-slate-800">
        <p className="text-sm mt-2 text-gray-300">Experience seamless blockchain interactions!</p>
      
        </div>
        </div>
  );
};

export default Header;
