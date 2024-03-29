import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import Home from './Props/Home'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Phantom from './Props/Phantom';


function App() {
  return (
    <div >
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/phantom-wallet" element={<Phantom />} />
      </Routes>
    </BrowserRouter>
      <Analytics />
    </div>
  );
}

export default App;
