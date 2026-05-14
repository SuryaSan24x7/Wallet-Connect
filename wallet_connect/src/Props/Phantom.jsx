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
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [network, setNetwork] = useState('devnet');

  useEffect(() => {
    // Load from localStorage
    const savedPubKey = localStorage.getItem('phantom_pubkey');
    const savedNetwork = localStorage.getItem('phantom_network') || 'devnet';
    const savedConnected = localStorage.getItem('phantom_connected') === 'true';

    const phantomProvider = getProvider();
    setProvider(phantomProvider);

    const updateBalance = async (net) => {
      if (phantomProvider && savedPubKey) {
        try {
          const connection = new Connection(clusterApiUrl(net), 'confirmed');
          const newBalance = await connection.getBalance(new PublicKey(savedPubKey));
          setBalance(newBalance / Math.pow(10, 9));
        } catch (err) {
          console.error('Error fetching balance:', err);
        }
      }
    };

    if (phantomProvider) {
      phantomProvider.on("connect", () => {
        console.log("Connected to Phantom Wallet!");
        const pubKeyStr = phantomProvider.publicKey.toString();
        setPubKey(pubKeyStr);
        localStorage.setItem('phantom_pubkey', pubKeyStr);
        localStorage.setItem('phantom_network', savedNetwork);
        localStorage.setItem('phantom_connected', 'true');
        updateBalance(savedNetwork);
        setConnectionStatus('✓ Phantom connected successfully!');
      });

      phantomProvider.on("disconnect", () => {
        console.log("Disconnected from Phantom Wallet!");
        setPubKey(null);
        setBalance(0);
        localStorage.removeItem('phantom_pubkey');
        localStorage.removeItem('phantom_network');
        localStorage.removeItem('phantom_connected');
        setConnectionStatus('');
      });
    }

    // Restore from localStorage if was connected
    if (savedPubKey && savedConnected) {
      setPubKey(savedPubKey);
      setNetwork(savedNetwork);
      updateBalance(savedNetwork);
    }

    // Clean up listeners on component unmount
    return () => {
      phantomProvider?.removeListener('connect');
      phantomProvider?.removeListener('disconnect');
    };
  }, [provider, pubKey]); // Removed network from dependencies to prevent unnecessary effect triggers

  const connectWallet = async (net) => {
    try {
      if (provider) {
        await provider.connect();
        setNetwork(net);
        localStorage.setItem('phantom_network', net);
        const connection = new Connection(clusterApiUrl(net), 'confirmed');
        const newBalance = await connection.getBalance(new PublicKey(provider.publicKey));
        setBalance(newBalance / Math.pow(10, 9));
        setPubKey(provider.publicKey.toString());
        localStorage.setItem('phantom_pubkey', provider.publicKey.toString());
        localStorage.setItem('phantom_connected', 'true');
        setConnectionStatus('✓ Phantom connected successfully!');
      }
    } catch (err) {
      console.error(err);
      setConnectionStatus('✗ Connection failed: ' + err.message);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('Testing connection...');
    try {
      if (provider && pubKey) {
        const connection = new Connection(clusterApiUrl(network), 'confirmed');
        const balance = await connection.getBalance(new PublicKey(pubKey));
        setConnectionStatus('✓ Connection successful! Wallet is responding.');
      } else {
        setConnectionStatus('✗ Wallet not connected.');
      }
    } catch (err) {
      setConnectionStatus('✗ Connection test failed: ' + err.message);
    }
    setIsLoading(false);
  };

  const disconnectWallet = async () => {
    await provider?.disconnect();
    setPubKey(null);
    setBalance(0);
    setConnectionStatus('');
    localStorage.removeItem('phantom_pubkey');
    localStorage.removeItem('phantom_network');
    localStorage.removeItem('phantom_connected');
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

              <button 
                onClick={testConnection} 
                disabled={isLoading}
                className="w-full mt-3 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Connection'}
              </button>

              {connectionStatus && (
                <div className={`mt-4 p-3 rounded-lg text-sm font-semibold ${
                  connectionStatus.includes('✓') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                }`}>
                  {connectionStatus}
                </div>
              )}
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
      <nav className="w-full bg-slate-800 border-t-2 border-purple-500 backdrop-blur">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate('/unisat-wallet')}
              className="w-full px-4 py-2 sm:py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Unisat Bitcoin
            </button>
            <button
              onClick={() => navigate('/ton-wallet')}
              className="w-full px-4 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              TON Wallet
            </button>
            <button
              onClick={() => navigate('/sui-wallet')}
              className="w-full px-4 py-2 sm:py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Sui Wallet
            </button>
            <button
              onClick={() => navigate('/aptos-wallet')}
              className="w-full px-4 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Aptos Wallet
            </button>
            <button
              onClick={() => navigate('/near-wallet')}
              className="w-full px-4 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              NEAR Protocol
            </button>
            <button
              onClick={() => navigate('/contract-connection')}
              className="w-full px-4 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Contract Connection
            </button>
          </div>
        </div>
      </nav>
      <Footer />
    </div>
  );
};

export default Phantom;
