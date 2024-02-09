import React from 'react';
import './App.css';
import Home from './Props/Home'; 

function App() {
  return (
    <div >
      {/* Here we integrate the Home component which includes functionality for MetaMask */}
      <Home />
    </div>
  );
}

export default App;
