import React, { useState, useEffect } from 'react';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';

// Detect the Phantom provider
const getProvider = () => {
  if ("solana" in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
};

const Phantom = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [pubKey, setPubKey] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const phantomProvider = getProvider();
    setProvider(phantomProvider);

    const updateBalance = async (network) => {
      if (phantomProvider && pubKey) {
        const connection = new Connection(clusterApiUrl(network), 'confirmed');
        const newBalance = await connection.getBalance(new PublicKey(pubKey));
        setBalance(newBalance / Math.pow(10, 9)); // Convert lamports to SOL
      }
    };

    if (phantomProvider) {
      phantomProvider.on("connect", () => {
        console.log("Connected to Phantom Wallet!");
        setPubKey(phantomProvider.publicKey.toString());
        updateBalance(phantomProvider._network); // Use the current network of the provider
      });

      phantomProvider.on("disconnect", () => {
        console.log("Disconnected from Phantom Wallet!");
        setPubKey(null);
        setBalance(0);
      });
    }

    // Clean up listeners on component unmount
    return () => {
      phantomProvider?.removeListener('connect');
      phantomProvider?.removeListener('disconnect');
    };
  }, [provider, pubKey]); // Removed network from dependencies to prevent unnecessary effect triggers

  const connectWallet = async (network) => {
    try {
      if (provider) {
        await provider.connect();
        provider._network = network; // Set the network on the provider for later reference
        const connection = new Connection(clusterApiUrl(network), 'confirmed');
        const newBalance = await connection.getBalance(new PublicKey(provider.publicKey));
        setBalance(newBalance / Math.pow(10, 9)); // Convert lamports to SOL
      }
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = async () => {
    await provider?.disconnect();
    setPubKey(null);
    setBalance(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center w-full px-3 sm:px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800">Phantom Wallet</h1>
          
          {pubKey ? (
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">Connected Public Key</p>
                <p className="text-xs sm:text-sm font-mono break-all bg-gray-100 p-3 rounded text-gray-800">{pubKey}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">SOL Balance</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">{balance.toFixed(4)} SOL</p>
              </div>
              <button 
                onClick={disconnectWallet} 
                className="w-full mt-6 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-200"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-700 mb-6">Connect your Phantom wallet to view your Solana balance</p>
              <button 
                onClick={() => connectWallet('mainnet-beta')} 
                className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-200"
              >
                Connect to Mainnet
              </button>
              <button 
                onClick={() => connectWallet('devnet')} 
                className="w-full px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition duration-200"
              >
                Connect to Devnet
              </button>
            </div>
          )}
        </div>
      </main>
      <nav className="w-full bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 sm:py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-200"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate('/contract-connection')}
              className="w-full px-4 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-200"
            >
              Contract Connection
            </button>
            <button
              onClick={() => navigate('/unisat-wallet')}
              className="w-full px-4 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition duration-200"
            >
              Unisat Wallet
            </button>
          </div>
        </div>
      </nav>
      <Footer />
    </div>
  );
};

export default Phantom;
