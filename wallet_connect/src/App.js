import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import Home from './Props/Home'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Phantom from './Props/Phantom';
import ContractConnection from './Props/ContractConnection';
import Unisat from './Props/Unisat';
import Ton from './Props/Ton';
import Sui from './Props/Sui';
import Aptos from './Props/Aptos';
import Near from './Props/Near';


function App() {
  return (
    <div >
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/phantom-wallet" element={<Phantom />} />
        <Route path="/contract-connection" element={<ContractConnection />} />
        <Route path="/unisat-wallet" element={<Unisat />} />
        <Route path="/ton-wallet" element={<Ton />} />
        <Route path="/sui-wallet" element={<Sui />} />
        <Route path="/aptos-wallet" element={<Aptos />} />
        <Route path="/near-wallet" element={<Near />} />
      </Routes>
    </BrowserRouter>
      <Analytics />
    </div>
  );
}

export default App;
