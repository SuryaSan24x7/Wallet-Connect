// src/Home.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.module.css'; 
import Designer_1  from "./images/Designer_1.jpg";
import Designer_2  from "./images/Designer_2.jpg";
import Designer_3  from "./images/Designer_3.jpg";
import Designer_4  from "./images/Designer_4.jpg";
import Designer_5  from "./images/Designer_5.jpg";
import Designer_6  from "./images/Designer_6.jpg";
const Home = () => {
  let navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState('0');
  const [symbol, setSymbol] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const savedAccounts = JSON.parse(localStorage.getItem('metamask_accounts') || '[]');
    const savedBalance = localStorage.getItem('metamask_balance') || '0';
    const savedSymbol = localStorage.getItem('metamask_symbol') || '';

    if (savedAccounts.length > 0) {
      setAccounts(savedAccounts);
      setBalance(savedBalance);
      setSymbol(savedSymbol);
    }
  }, []); 

const networks = [
  { id: 1, name: "Ethereum Mainnet" ,symbol: "ETH", cid: 1n },
  { id: 5, name: "Goerli Testnet" ,symbol: "GoerliETH", cid: 5n },
  { id: 137, name: "Polygon Mainnet", symbol: "MATIC", cid: 137n },
  { id: 80001, name: "Polygon Mumbai Testnet", symbol: "Matic", cid: 80001n },
  { id: 56, name: "Binance Smart Chain Mainnet", symbol: "BNB", cid: 56n },
  { id: 97, name: "Binance Smart Chain Testnet", symbol: "BNB", cid: 97n },
  { id: 128, name: "Huobi ECO Chain Mainnet", symbol: "HECO", cid: 128n },
  { id: 256, name: "Huobi ECO Chain Testnet", symbol: "HECO", cid: 256n },
  { id: 1666600000, name: "Harmony Mainnet", symbol: "ONE", cid: 1666600000n },
  { id: 1666700000, name: "Harmony Testnet", symbol: "ONE", cid: 1666700000n },
  { id: 43114, name: "Avalanche Mainnet", symbol: "AVAX", cid: 43114n },
  { id: 43113, name: "Avalanche Testnet", symbol: "AVAX", cid: 43113n },
  { id: 250, name: "Fantom Opera Mainnet", symbol: "FTM", cid: 250n },
  { id: 4002, name: "Fantom Testnet", symbol: "FTM", cid: 4002n },
  { id: 1285, name: "Moonbeam Polkadot Mainnet", symbol: "GLMR", cid: 1285n },
  { id: 1286, name: "Moonbeam Polkadot Testnet", symbol: "GLMR", cid: 1286n },
  { id: 100, name: "xDAI Chain", symbol: "xDAI", cid: 100n },
  { id: 1377, name: "xDai Chain Testnet", symbol: "xDAI", cid: 1377n },
  { id: 296, name: "Hedera Testnet", symbol: "HBAR", cid: 296n },
  { id: 42161, name: "Arbitrum One", symbol: "ETH", cid: 42161n },
  { id: 421613, name: "Arbitrum Goerli Testnet", symbol: "GoerliETH", cid: 421613n },
  { id: 10, name: "Optimism Mainnet", symbol: "ETH", cid: 10n },
  { id: 420, name: "Optimism Goerli Testnet", symbol: "GoerliETH", cid: 420n },
  { id: 8453, name: "Base Mainnet", symbol: "ETH", cid: 8453n },
  { id: 84531, name: "Base Goerli Testnet", symbol: "GoerliETH", cid: 84531n },
  { id: 204, name: "OP BNB Mainnet", symbol: "BNB", cid: 204n },
  { id: 991, name: "OP BNB Testnet", symbol: "tBNB", cid: 991n },
  { id: 1284, name: "Moonriver", symbol: "MOVR", cid: 1284n },
  { id: 42220, name: "Celo Mainnet", symbol: "CELO", cid: 42220n },
  { id: 44787, name: "Celo Alfajores Testnet", symbol: "CELO", cid: 44787n },
  { id: 8217, name: "Klaytn Mainnet", symbol: "KLAY", cid: 8217n },
  { id: 42, name: "Kovan Testnet", symbol: "KETH", cid: 42n },
  { id: 1313161554, name: "Aurora Mainnet", symbol: "AURORA", cid: 1313161554n },
  { id: 1313161555, name: "Aurora Testnet", symbol: "AURORA", cid: 1313161555n },
  { id: 25, name: "Cronos Mainnet", symbol: "CRO", cid: 25n },
  { id: 338, name: "Cronos Testnet", symbol: "CRO", cid: 338n },
  { id: 2222, name: "Kava Mainnet", symbol: "KAVA", cid: 2222n },
  { id: 2221, name: "Kava Testnet", symbol: "KAVA", cid: 2221n },
  { id: 1088, name: "Metis Mainnet", symbol: "METIS", cid: 1088n },
  { id: 588, name: "Metis Testnet", symbol: "METIS", cid: 588n },
  { id: 9001, name: "Evmos Mainnet", symbol: "EVMOS", cid: 9001n },
  { id: 9000, name: "Evmos Testnet", symbol: "EVMOS", cid: 9000n }
];

  

  const redirectToPhantomWallet = () => {
    navigate('/phantom-wallet'); 
  };

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('Testing connection...');
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const currentAccounts = await web3Instance.eth.getAccounts();
        if (currentAccounts.length > 0) {
          setConnectionStatus('✓ MetaMask connection successful! Wallet is responding.');
        } else {
          setConnectionStatus('✗ No accounts found. Please connect to MetaMask.');
        }
      } else {
        setConnectionStatus('✗ MetaMask not detected.');
      }
    } catch (err) {
      setConnectionStatus('✗ Connection test failed: ' + err.message);
    }
    setIsLoading(false);
  };

  const connectWallet = async () => {
    setIsLoading(true);
    setConnectionStatus('Connecting...');
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccounts(accounts);
        fetchBalance(accounts[0]);
        console.log(accounts);
        const chainId = await web3Instance.eth.getChainId();
        updateSymbol(chainId);
        console.log(chainId);

        // Save to localStorage
        localStorage.setItem('metamask_accounts', JSON.stringify(accounts));
        localStorage.setItem('metamask_balance', await web3Instance.eth.getBalance(accounts[0]));
        setConnectionStatus('✓ MetaMask connected successfully!');
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
        setConnectionStatus('✗ Connection failed: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please install MetaMask to use this feature.");
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccounts([]);
    setBalance('0');
    setSymbol("");
    setConnectionStatus('');
    // Clear localStorage
    localStorage.removeItem('metamask_accounts');
    localStorage.removeItem('metamask_balance');
    localStorage.removeItem('metamask_symbol');
  };

  const fetchBalance = useCallback(async (account) => {
    if (!web3) return;
    const balance = await web3.eth.getBalance(account);
    setBalance(web3.utils.fromWei(balance, 'ether'));
  }, [web3]);

  const updateSymbol = (chainId) => {
    const network = networks.find(network => network.cid === chainId);
    console.log("inside update symbol");
    console.log(network);
    if (network) {
      setSymbol(network.symbol);
    } else {
      setSymbol("");
    }
  };
  const switchNetwork = async (chainId) => {
    disconnectWallet();
    
    if (!chainId) return; 
    
    const hexChainId = `0x${Number(chainId).toString(16)}`;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
    } catch (error) {
      console.error("Error switching network: ", error);
      if (error.code === 4902){
        alert("Add this Network in Your Metamask Wallet")
      }
    }
    connectWallet();
  };

  useEffect(() => {
    if (accounts.length > 0 && web3) {
      fetchBalance(accounts[0]);
    }
  }, [accounts, web3, fetchBalance]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black" >
      <Header />
      <main className="flex-grow w-full px-3 sm:px-4 md:px-6 py-6 sm:py-8">
          {/* Bootstrap Carousel Start */}
          <div id="carouselExampleInterval" class="carousel slide w-full shadow-2xl" data-bs-ride="carousel" >
  <div className="carousel-inner rounded-xl overflow-hidden border-2 border-orange-500">
     <div className="carousel-item active" data-bs-interval="5000">
      <img src={Designer_1} class="d-block w-100 " alt="..."/>
    </div>
    <div className="carousel-item" data-bs-interval="5000">
      <img src={Designer_2} class="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item" data-bs-interval="5000">
      <img src={Designer_3} class="d-block w-100" alt="..."/>
    </div> 
    <div className="carousel-item " data-bs-interval="5000">
      <img src={Designer_4} class="d-block w-100 " alt="..."/>
    </div>
    <div className="carousel-item" data-bs-interval="5000">
      <img src={Designer_5} class="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item" data-bs-interval="5000">
      <img src={Designer_6} class="d-block w-100" alt="..."/>
    </div> 
  </div>
  <button className="carousel-control-prev opacity-70 hover:opacity-100" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next opacity-70 hover:opacity-100" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
        {/* Bootstrap Carousel End */}
        <div className="mt-6 sm:mt-8 space-y-4">
          <button
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-200 disabled:opacity-50 shadow-lg"
            onClick={connectWallet}
            disabled={isLoading}
          >
            Connect MetaMask
          </button>
          
          {isLoading && (
            <div className="text-center">
              <div className="inline-block spinner-border text-orange-500" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-2">Select Network</label>
            <select
              className="w-full bg-slate-700 border-2 border-orange-500 text-white hover:border-orange-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              defaultValue=""
              onChange={(e) => switchNetwork(e.target.value)}
            >
              <option value="" disabled className="bg-slate-700">Select a network</option>
              {networks.map((network) => (
                <option key={network.id} value={network.id} className="bg-slate-700">
                  {network.name}
                </option>
              ))}
            </select>
          </div>

          {accounts.length > 0 && (
            <button
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-200 shadow-lg"
              onClick={disconnectWallet}
            >
              Disconnect Wallet
            </button>
          )}

          {accounts.length > 0 && (
            <button
              onClick={testConnection}
              disabled={isLoading}
              className="w-full sm:w-auto ml-3 bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-200 shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
          )}

          {connectionStatus && (
            <div className={`p-3 rounded-lg text-sm font-semibold ${
              connectionStatus.includes('✓') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
            }`}>
              {connectionStatus}
            </div>
          )}

          {accounts.length > 0 && (
            <div className="mt-6 bg-slate-700 bg-opacity-50 backdrop-blur p-4 rounded-xl shadow-xl border border-orange-500">
              <h3 className="text-lg font-semibold mb-3 text-orange-400">Wallet Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs sm:text-sm text-gray-300 font-medium">Account Address</p>
                  <p className="text-xs sm:text-sm font-mono break-all bg-slate-800 p-2 rounded mt-1 text-orange-400">{accounts[0]}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-300 font-medium">Balance</p>
                  <p className="text-lg sm:text-xl font-bold text-orange-500">{balance} {symbol}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        </main>
        <nav className="w-full bg-slate-800 border-t-2 border-orange-500 backdrop-blur">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={redirectToPhantomWallet}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition duration-200 shadow-lg"
              >
                Phantom Wallet
              </button>
              <button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition duration-200 shadow-lg"
                onClick={() => navigate('/unisat-wallet')}
              >
                Unisat Bitcoin
              </button>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition duration-200 shadow-lg"
                onClick={() => navigate('/ton-wallet')}
              >
                TON Wallet
              </button>
              <button
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition duration-200 shadow-lg"
                onClick={() => navigate('/sui-wallet')}
              >
                Sui Wallet
              </button>
              <button
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition duration-200 shadow-lg"
                onClick={() => navigate('/aptos-wallet')}
              >
                Aptos Wallet
              </button>
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition duration-200 shadow-lg"
                onClick={() => navigate('/near-wallet')}
              >
                NEAR Protocol
              </button>
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition duration-200 shadow-lg"
                onClick={() => navigate('/contract-connection')}
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

export default Home;
