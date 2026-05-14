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
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const savedAddress = localStorage.getItem('unisat_address');
    const savedNetwork = localStorage.getItem('unisat_network') || 'livenet';
    const savedConnected = localStorage.getItem('unisat_connected') === 'true';

    const unisatProvider = getProvider();
    setProvider(unisatProvider);

    const updateBalance = async () => {
      try {
        if (unisatProvider) {
          const balanceResult = await unisatProvider.getBalance();
          // Balance is in satoshis, convert to BTC
          const btcBalance = balanceResult.confirmed / Math.pow(10, 8);
          setBalance(btcBalance);
        }
      } catch (err) {
        console.error('Error fetching balance:', err);
      }
    };

    if (unisatProvider) {
      // Check if already connected
      unisatProvider
        .getAccounts()
        .then((accounts) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            updateBalance();
            localStorage.setItem('unisat_address', accounts[0]);
            localStorage.setItem('unisat_connected', 'true');
          } else if (savedAddress && savedConnected) {
            setAddress(savedAddress);
            setIsConnected(true);
            setNetwork(savedNetwork);
            updateBalance();
          }
        })
        .catch((err) => console.error('Error getting accounts:', err));

      // Listen for account changes
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          updateBalance();
          localStorage.setItem('unisat_address', accounts[0]);
          localStorage.setItem('unisat_connected', 'true');
        } else {
          setAddress(null);
          setIsConnected(false);
          setBalance(0);
          localStorage.removeItem('unisat_address');
          localStorage.removeItem('unisat_connected');
        }
      };

      // Listen for network changes
      const handleNetworkChanged = (newNetwork) => {
        setNetwork(newNetwork);
        localStorage.setItem('unisat_network', newNetwork);
        updateBalance();
      };

      unisatProvider.on('accountsChanged', handleAccountsChanged);
      unisatProvider.on('networkChanged', handleNetworkChanged);

      return () => {
        unisatProvider.removeListener('accountsChanged', handleAccountsChanged);
        unisatProvider.removeListener('networkChanged', handleNetworkChanged);
      };
    }
  }, []);

  const connectWallet = async (selectedNetwork) => {
    try {
      if (provider) {
        // Request account access
        const accounts = await provider.requestAccounts();
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          // Network will be updated via the networkChanged event listener
          // or from the provider's current state
          const currentNetwork = await provider.getNetwork();
          setNetwork(currentNetwork || selectedNetwork);
          setConnectionStatus('✓ Unisat connected successfully!');

          // Save to localStorage
          localStorage.setItem('unisat_address', accounts[0]);
          localStorage.setItem('unisat_network', currentNetwork || selectedNetwork);
          localStorage.setItem('unisat_connected', 'true');
        }
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setConnectionStatus('✗ Connection failed: ' + err.message);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('Testing connection...');
    try {
      if (provider) {
        const accounts = await provider.getAccounts();
        if (accounts.length > 0) {
          const balanceResult = await provider.getBalance();
          setConnectionStatus('✓ Connection successful! Wallet is responding.');
        } else {
          setConnectionStatus('✗ No accounts found. Please connect a wallet.');
        }
      } else {
        setConnectionStatus('✗ Wallet provider not found.');
      }
    } catch (err) {
      setConnectionStatus('✗ Connection test failed: ' + err.message);
    }
    setIsLoading(false);
  };

  const switchNetwork = async (selectedNetwork) => {
    try {
      if (provider) {
        // Note: Unisat may not support programmatic network switching
        // This is handled through the wallet settings
        setNetwork(selectedNetwork);
        localStorage.setItem('unisat_network', selectedNetwork);
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
    setConnectionStatus('');

    // Clear localStorage
    localStorage.removeItem('unisat_address');
    localStorage.removeItem('unisat_network');
    localStorage.removeItem('unisat_connected');
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

            <button
              onClick={testConnection}
              disabled={isLoading}
              className="mt-4 ml-3 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
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
      <div className="w-full bg-slate-800 border-t-2 border-orange-500">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate('/phantom-wallet')}
              className="w-full px-4 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Go to Phantom
            </button>
            <button
              onClick={() => navigate('/ton-wallet')}
              className="w-full px-4 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Go to TON
            </button>
            <button
              onClick={() => navigate('/sui-wallet')}
              className="w-full px-4 py-2 sm:py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Go to Sui
            </button>
            <button
              onClick={() => navigate('/aptos-wallet')}
              className="w-full px-4 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Go to Aptos
            </button>
            <button
              onClick={() => navigate('/near-wallet')}
              className="w-full px-4 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Go to NEAR
            </button>
            <button
              onClick={() => navigate('/contract-connection')}
              className="w-full px-4 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Contract Connection
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Unisat;
