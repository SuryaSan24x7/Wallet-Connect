import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';

const Aptos = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState('mainnet');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const savedAddress = localStorage.getItem('aptos_address');
    const savedNetwork = localStorage.getItem('aptos_network');
    const savedConnected = localStorage.getItem('aptos_connected') === 'true';

    // Check if Aptos wallet is available
    const checkWallet = async () => {
      if (window.aptos) {
        setProvider(window.aptos);
      }
    };
    checkWallet();

    if (savedAddress && savedConnected) {
      setAddress(savedAddress);
      setIsConnected(true);
      setNetwork(savedNetwork || 'mainnet');
    }
  }, []);

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('Testing connection...');
    try {
      if (provider) {
        const response = await provider.account();
        if (response?.address) {
          setConnectionStatus('✓ Connection successful! Wallet is responding.');
        } else {
          setConnectionStatus('✗ No account found. Please connect a wallet.');
        }
      } else {
        setConnectionStatus('✗ Wallet provider not found.');
      }
    } catch (err) {
      setConnectionStatus('✗ Connection test failed: ' + err.message);
    }
    setIsLoading(false);
  };

  const connectWallet = async (selectedNetwork) => {
    try {
      if (provider) {
        const response = await provider.connect();
        if (response?.address) {
          setAddress(response.address);
          setIsConnected(true);
          setNetwork(selectedNetwork);
          setBalance('0.00 APT');
          setConnectionStatus('✓ Wallet connected successfully!');

          // Save to localStorage
          localStorage.setItem('aptos_address', response.address);
          localStorage.setItem('aptos_network', selectedNetwork);
          localStorage.setItem('aptos_connected', 'true');
        }
      } else {
        window.open('https://aptos.dev/en/build/guides/install-petra-wallet-extension', '_blank');
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setConnectionStatus('✗ Connection failed: ' + err.message);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (provider) {
        await provider.disconnect();
      }
    } catch (err) {
      console.error('Error disconnecting:', err);
    }
    setAddress(null);
    setIsConnected(false);
    setBalance('0');
    setConnectionStatus('');

    // Clear localStorage
    localStorage.removeItem('aptos_address');
    localStorage.removeItem('aptos_network');
    localStorage.removeItem('aptos_connected');
  };

  const switchNetwork = (selectedNetwork) => {
    setNetwork(selectedNetwork);
    localStorage.setItem('aptos_network', selectedNetwork);
    const networkName = selectedNetwork === 'mainnet' ? 'Aptos Mainnet' : 'Aptos Testnet';
    alert(`Please switch to ${networkName} in your wallet.`);
  };

  const getNetworkName = () => {
    return network === 'mainnet' ? 'Aptos Mainnet' : 'Aptos Testnet';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-10">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
          Aptos Wallet
        </h1>
        <p className="text-gray-400 mb-8">Move-based Blockchain by Aptos Foundation</p>

        {isConnected && address ? (
          <>
            <div className="bg-slate-700 bg-opacity-50 backdrop-blur shadow-lg rounded-lg p-6 mb-6 w-full max-w-md border border-red-500">
              <h2 className="text-xl font-semibold mb-4 text-red-400">Wallet Connected</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-400">Network:</p>
                <p className="text-lg font-semibold text-white">{getNetworkName()}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-400">Address:</p>
                <p className="text-sm font-mono break-all bg-slate-800 p-2 rounded text-red-400">
                  {address}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-400">Balance:</p>
                <p className="text-2xl font-bold text-red-400">{balance}</p>
              </div>
            </div>

            <button
              onClick={disconnectWallet}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition shadow-lg"
            >
              Disconnect Wallet
            </button>

            <button
              onClick={testConnection}
              disabled={isLoading}
              className="mt-4 ml-3 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition shadow-lg disabled:opacity-50"
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
            <p className="text-lg mb-6 text-gray-300">Connect your Aptos wallet to get started</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => connectWallet('mainnet')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition shadow-lg"
              >
                Connect to Aptos Mainnet
              </button>
              <button
                onClick={() => connectWallet('testnet')}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition shadow-lg"
              >
                Connect to Aptos Testnet
              </button>
            </div>

            <p className="text-sm text-gray-400 text-center">
              Don't have an Aptos wallet?{' '}
              <a
                href="https://aptos.dev/en/build/guides/install-petra-wallet-extension"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:underline"
              >
                Download Petra Wallet
              </a>
            </p>
          </>
        )}

        {isConnected && address && (
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => switchNetwork('mainnet')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                network === 'mainnet'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Mainnet
            </button>
            <button
              onClick={() => switchNetwork('testnet')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                network === 'testnet'
                  ? 'bg-pink-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
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
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
        >
          Go to Home
        </button>
        <button
          onClick={() => navigate('/phantom-wallet')}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition"
        >
          Go to Phantom
        </button>
        <button
          onClick={() => navigate('/ton-wallet')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          Go to TON
        </button>
        <button
          onClick={() => navigate('/sui-wallet')}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition"
        >
          Go to Sui
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Aptos;
