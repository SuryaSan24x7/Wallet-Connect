import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';

const Sui = () => {
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
    const savedAddress = localStorage.getItem('sui_address');
    const savedNetwork = localStorage.getItem('sui_network');
    const savedConnected = localStorage.getItem('sui_connected') === 'true';

    // Check if Sui wallet is available
    const checkWallet = async () => {
      if (window.suiWallet) {
        setProvider(window.suiWallet);
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
        const accounts = await provider.getAccounts();
        if (accounts.length > 0) {
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

  const connectWallet = async (selectedNetwork) => {
    try {
      if (provider) {
        const accounts = await provider.getAccounts();
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          setNetwork(selectedNetwork);
          setBalance('0.00 SUI');
          setConnectionStatus('✓ Wallet connected successfully!');

          // Save to localStorage
          localStorage.setItem('sui_address', accounts[0]);
          localStorage.setItem('sui_network', selectedNetwork);
          localStorage.setItem('sui_connected', 'true');
        }
      } else {
        window.open('https://docs.sui.io/guides/user/getting-started/sui-wallet', '_blank');
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setConnectionStatus('✗ Connection failed: ' + err.message);
    }
  };

  const disconnectWallet = async () => {
    setAddress(null);
    setIsConnected(false);
    setBalance('0');
    setConnectionStatus('');

    // Clear localStorage
    localStorage.removeItem('sui_address');
    localStorage.removeItem('sui_network');
    localStorage.removeItem('sui_connected');
  };

  const switchNetwork = (selectedNetwork) => {
    setNetwork(selectedNetwork);
    localStorage.setItem('sui_network', selectedNetwork);
    const networkName = selectedNetwork === 'mainnet' ? 'Sui Mainnet' : 'Sui Testnet';
    alert(`Please switch to ${networkName} in your wallet.`);
  };

  const getNetworkName = () => {
    return network === 'mainnet' ? 'Sui Mainnet' : 'Sui Testnet';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-10">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
          Sui Wallet
        </h1>
        <p className="text-gray-400 mb-8">Move-based Blockchain by Mysten Labs</p>

        {isConnected && address ? (
          <>
            <div className="bg-slate-700 bg-opacity-50 backdrop-blur shadow-lg rounded-lg p-6 mb-6 w-full max-w-md border border-sky-500">
              <h2 className="text-xl font-semibold mb-4 text-sky-400">Wallet Connected</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-400">Network:</p>
                <p className="text-lg font-semibold text-white">{getNetworkName()}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-400">Address:</p>
                <p className="text-sm font-mono break-all bg-slate-800 p-2 rounded text-sky-400">
                  {address}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-400">Balance:</p>
                <p className="text-2xl font-bold text-sky-400">{balance}</p>
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
            <p className="text-lg mb-6 text-gray-300">Connect your Sui wallet to get started</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => connectWallet('mainnet')}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition shadow-lg"
              >
                Connect to Sui Mainnet
              </button>
              <button
                onClick={() => connectWallet('testnet')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-lg"
              >
                Connect to Sui Testnet
              </button>
            </div>

            <p className="text-sm text-gray-400 text-center">
              Don't have a Sui wallet?{' '}
              <a
                href="https://docs.sui.io/guides/user/getting-started/sui-wallet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline"
              >
                Download Sui Wallet
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
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Mainnet
            </button>
            <button
              onClick={() => switchNetwork('testnet')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                network === 'testnet'
                  ? 'bg-blue-600 text-white'
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
          onClick={() => navigate('/unisat-wallet')}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition"
        >
          Go to Unisat
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Sui;
