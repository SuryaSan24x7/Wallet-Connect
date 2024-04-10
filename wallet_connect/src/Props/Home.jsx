// src/Home.jsx
import React, { useState, useEffect } from 'react';
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

  const networks = [
    { id: 1, name: "Ethereum Mainnet" ,symbol: "ETH",cid:1n},
    { id: 5, name: "Goerli Testnet" ,symbol: "GorliETH",cid:5n},
    { id: 137, name: "Polygon Mainnet",symbol: "MATIC",cid:137n },
    { id: 80001, name: "Polygon Mumbai Testnet",symbol: "Matic",cid:80001n },
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
    {id:256,name:"Hedera Testnet",xymbol:"Hbar",cid:256n}
  ];
  

  const redirectToPhantomWallet = () => {
    navigate('/phantom-wallet'); 
  };
  const connectWallet = async () => {
    setIsLoading(true); // Start loading
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccounts(accounts);
        fetchBalance(accounts[0]);
        updateSymbol(await web3Instance.eth.getChainId());
        console.log(await web3Instance.eth.getChainId());

      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      } finally {
        setIsLoading(false); // Stop loading irrespective of the outcome
      }
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  };

  const disconnectWallet = () => {
    setAccounts([]);
    setBalance('0');
    setSymbol("");
    // Note: This doesn't actually "disconnect" MetaMask but resets the app's state.
  };

  const fetchBalance = async (account) => {
    if (!web3) return;
    const balance = await web3.eth.getBalance(account);
    console.log(account);
    setBalance(web3.utils.fromWei(balance, 'ether'));
  };
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
    if (accounts.length > 0) {
      fetchBalance(accounts[0]);
    }
  }, [accounts]);

  return (
    <div className="flex flex-col min-h-screen" >
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
          {/* Bootstrap Carousel Start */}
          <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel" >
  <div className="carousel-inner">
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
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
        {/* Bootstrap Carousel End */}
        {/* <button
          className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={connectWallet}
        >
          Connect MetaMask
        </button> */}
        <button
          className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={connectWallet}
          disabled={isLoading} // Disable button when loading
        >
          Connect MetaMask
        </button>
        
        {isLoading && (
          <div class="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden"> Loading...</span>
          </div>
          </div>
        )}
        <div>
          <select
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            defaultValue=""
            onChange={(e) => switchNetwork(e.target.value)}
          >
            <option value="" disabled>Default Network</option>
            {networks.map((network) => (
              <option key={network.id} value={network.id}>
                {network.name}
              </option>
            ))}
          </select>
        </div>
        {accounts.length > 0 && (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </button>
        )}
        <div className="mt-6">
          <p className="text-sm text-gray-700">Accounts: <span className="font-semibold">{accounts.join(', ')}</span></p>
          <p className="text-sm text-gray-700">Balance: <span className="font-semibold">{balance} {symbol}</span></p>
        </div>
        <button
  onClick={redirectToPhantomWallet}
  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
>
  Go to Phantom Wallet Connect Page
</button>
</main>
      <Footer />
    </div>
  );
};

export default Home;