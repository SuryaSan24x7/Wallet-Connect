import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ContractConnection = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [referralAddress, setReferralAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const contractAddress = "0x4E997e3b5CD082b5F296fDB3C4D48dD4cAeca2BC"; // Contract address on BSC Testnet
  const usdtAddress = "0x00d07A24B715892317009E483ce0caB67e98A67d"; // USDT token address on BSC Testnet

  // ABI for the contract methods we will use
  const contractAbi = [
    {
      "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
      "name": "isUserExists",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_user", "type": "address" },
        { "internalType": "address", "name": "_referral", "type": "address" }
      ],
      "name": "registration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // USDT Contract ABI for approval
  const usdtAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // Connect wallet and initialize ethers provider and signer
  const connectWallet = async () => {
    setIsLoading(true);
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newSigner = newProvider.getSigner();
        const accounts = await newSigner.getAddress();

        setProvider(newProvider);
        setSigner(newSigner);
        setAccount(accounts);

        // Instantiate contract instance
        const newContract = new ethers.Contract(contractAddress, contractAbi, newSigner);
        setContract(newContract);

        // Check if the user is registered
        const userExists = await newContract.isUserExists(accounts);
        setIsRegistered(userExists);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please install MetaMask to use this feature.");
      setIsLoading(false);
    }
  };

  // Handle registration
  const handleRegistration = async () => {
    if (!referralAddress) {
      alert("Please enter a referral address.");
      return;
    }

    try {
      const tx = await contract.registration(account, referralAddress);
      await tx.wait(); // Wait for the transaction to be mined
      alert("Registration successful!");
      
      // Check the user's registration status again after the transaction
      const userExists = await contract.isUserExists(account);
      setIsRegistered(userExists);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Handle USDT approval
  const handleApprove = async () => {
    try {
      // USDT contract instance
      const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, signer);

      // Approve 100 USDT for spending by the contract
      const amountToApprove = ethers.utils.parseUnits('100', 18); // Approve 100 USDT
      const tx = await usdtContract.approve(contractAddress, amountToApprove);
      await tx.wait(); // Wait for the transaction to be mined
      alert("Approval successful for 100 USDT!");
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  useEffect(() => {
    if (provider && signer && account) {
      // When wallet connects, automatically check if user is registered
      const checkRegistrationStatus = async () => {
        const userExists = await contract.isUserExists(account);
        setIsRegistered(userExists);
      };
      checkRegistrationStatus();
    }
  }, [provider, signer, account]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Contract Connection</h1>
      
      {!account && (
        <button
          className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={connectWallet}
          disabled={isLoading}
        >
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </button>
      )}

      {account && (
        <div>
          <p>Connected Account: {account}</p>

          {isRegistered ? (
            <p className="text-green-500">You are already registered!</p>
          ) : (
            <div>
              <p className="text-red-500">You are not registered yet!</p>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter referral address"
                  value={referralAddress}
                  onChange={(e) => setReferralAddress(e.target.value)}
                  className="border rounded p-2 w-full"
                />
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                  onClick={handleRegistration}
                >
                  Register
                </button>
              </div>
            </div>
          )}

          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleApprove}
          >
            Approve 100 USDT
          </button>
        </div>
      )}
    </div>
  );
};

export default ContractConnection;
