import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';

// Detect the Unisat provider
const getProvider = () => {
  if ("unisat" in window) {
    return window.unisat;
  }
  window.open("https://unisat.io/", "_blank");
  return null;
};

const Unisat = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [network, setNetwork] = useState('livenet'); // 'livenet' or 'testnet'
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unisatProvider = getProvider();
    setProvider(unisatProvider);

    if (unisatProvider) {
      // Check if already connected
      unisatProvider
        .getAccounts()
        .then((accounts) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            updateBalance(accounts[0]);
          }
        })
        .catch((err) => console.error('Error getting accounts:', err));

      // Listen for account changes
      unisatProvider.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          updateBalance(accounts[0]);
        } else {
          setAddress(null);
          setIsConnected(false);
          setBalance(0);
        }
      });

      // Listen for network changes
      unisatProvider.on('networkChanged', (newNetwork) => {
        setNetwork(newNetwork);
        if (address) {
          updateBalance(address);
        }
      });
    }

    return () => {
      unisatProvider?.removeListener('accountsChanged');
      unisatProvider?.removeListener('networkChanged');
    };
  }, [address]);

  const updateBalance = async (accountAddress) => {
    try {
      if (provider) {
        const balanceResult = await provider.getBalance();
        // Balance is in satoshis, convert to BTC
        const btcBalance = balanceResult.confirmed / Math.pow(10, 8);
        setBalance(btcBalance);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  const connectWallet = async (selectedNetwork) => {
    try {
      if (provider) {
        // Request account access
        const accounts = await provider.requestAccounts();
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          setNetwork(selectedNetwork);
          updateBalance(accounts[0]);
        }
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
    }
  };

  const switchNetwork = async (selectedNetwork) => {
    try {
      if (provider) {
        // Note: Unisat may not support programmatic network switching
        // This is handled through the wallet settings
        setNetwork(selectedNetwork);
        if (address) {
          updateBalance(address);
        }
        alert(`Please switch to ${selectedNetwork === 'livenet' ? 'Bitcoin Mainnet' : 'Bitcoin Testnet'} in your Unisat wallet.`);
      }
    } catch (err) {
      console.error('Error switching network:', err);
    }
  };

  const disconnectWallet = async () => {
    setAddress(null);
    setIsConnected(false);
    setBalance(0);
  };

  const getNetworkName = () => {
    return network === 'livenet' ? 'Bitcoin Mainnet' : 'Bitcoin Testnet';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-10">
        <h1 className="text-3xl font-bold mb-8">Unisat Bitcoin Wallet</h1>

        {isConnected && address ? (
          <>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Wallet Connected</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Network:</p>
                <p className="text-lg font-semibold">{getNetworkName()}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Address:</p>
                <p className="text-sm font-mono break-all bg-gray-100 p-2 rounded">
                  {address}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Balance:</p>
                <p className="text-2xl font-bold text-orange-600">{balance.toFixed(8)} BTC</p>
              </div>
            </div>

            <button
              onClick={disconnectWallet}
              className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
            >
              Disconnect Wallet
            </button>
          </>
        ) : (
          <>
            <p className="text-lg mb-6 text-gray-700">Connect your Unisat wallet to get started</p>

            <div className="flex gap-4 mb-8">
              <button
                onClick={() => connectWallet('livenet')}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
              >
                Connect to Bitcoin Mainnet
              </button>
              <button
                onClick={() => connectWallet('testnet')}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
              >
                Connect to Bitcoin Testnet
              </button>
            </div>

            <p className="text-sm text-gray-600 text-center">
              Don't have Unisat installed?{' '}
              <a
                href="https://unisat.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Download Unisat Wallet
              </a>
            </p>
          </>
        )}

        {isConnected && address && (
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => switchNetwork('livenet')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                network === 'livenet'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Mainnet
            </button>
            <button
              onClick={() => switchNetwork('testnet')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                network === 'testnet'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Testnet
            </button>
          </div>
        )}
      </main>
      <div className="flex gap-4 justify-center p-4 flex-wrap">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
        >
          Go to Home
        </button>
        <button
          onClick={() => navigate('/phantom-wallet')}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition"
        >
          Go to Phantom Wallet
        </button>
        <button
          onClick={() => navigate('/contract-connection')}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
        >
          Go to Contract Connection
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Unisat;
