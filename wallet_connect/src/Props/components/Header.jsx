import React from 'react';
import { Link } from 'react-router-dom';
const Header = () => {
  return (
   <div>
      
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <div className="text-lg">Wallet Connect Demo DApp</div>
          <div>
            <Link to="/" className="mr-4 hover:underline">Home</Link>
          </div>
        </div>
      </nav>
      <div className="container mx-auto text-center">
        <p className="text-sm mt-2">Experience seamless blockchain interactions!</p>
      
        </div>
        </div>
  );
};

export default Header;
