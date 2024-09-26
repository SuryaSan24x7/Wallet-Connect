import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; // Import ethers.js
import abi from './Harvest_BTC_Test.json'; // Import the ABI from JSON

const ContractConnection = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState('0');
  const [symbol, setSymbol] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState(""); // Store user-provided contract address
  const [contractFunctions, setContractFunctions] = useState([]); // Store contract functions

  // Only OP BNB Testnet is used
  const opbnbNetwork = {
    id: 97,
    name: "BNB Testnet",
    symbol: "BNB",
    cid: 97n,
  };

  // Connect wallet and initialize ethers provider and signer
  const connectWallet = async () => {
    setIsLoading(true);
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create a new ethers provider and signer
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newSigner = newProvider.getSigner();
        const accounts = await newSigner.getAddress();
        
        setProvider(newProvider);
        setSigner(newSigner);
        setAccounts([accounts]);
        fetchBalance(newProvider, accounts);
        const chainId = await newProvider.getNetwork().then(network => network.chainId);
        if (chainId !== 991) {
          alert("Please switch to the OP BNB Testnet");
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  };

  // Fetch the balance of the connected account
  const fetchBalance = async (provider, account) => {
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  };

  // Handle contract interactions
  const loadContract = async () => {
    if (!contractAddress) {
      alert("Please enter a contract address");
      return;
    }

    try {
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      setContract(contractInstance);
      
      // Fetch contract functions from the ABI
      const functions = Object.keys(contractInstance.interface.functions);
      setContractFunctions(functions);
      console.log("Contract functions loaded:", functions);
    } catch (error) {
      console.error("Failed to load contract:", error);
    }
  };

  useEffect(() => {
    if (accounts.length > 0 && provider) {
      fetchBalance(provider, accounts[0]);
    }
  }, [accounts]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Contract Connection</h1>
      
      <button
        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={connectWallet}
        disabled={isLoading}
      >
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </button>

      {accounts.length > 0 && (
        <div>
          <p>Connected Account: {accounts[0]}</p>
          <p>Balance: {balance} {symbol || "ETH"}</p>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter contract address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={loadContract}
        >
          Load Contract
        </button>
      </div>

      {contractFunctions.length > 0 && (
        <div>
          <h3>Available Contract Functions:</h3>
          <ul>
            {contractFunctions.map((func, index) => (
              <li key={index} className="py-1">
                {func}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContractConnection;
