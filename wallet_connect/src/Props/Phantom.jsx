import React, { useState, useEffect } from 'react';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-10">
        {pubKey ? (
          <>
            <p className="text-lg">Connected Public Key: {pubKey}</p>
            <p className="text-lg">Balance: {balance} SOL</p>
            <button onClick={disconnectWallet} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">
              Disconnect
            </button>
          </>
        ) : (
          <>
            <button onClick={() => connectWallet('mainnet-beta')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
              Connect Wallet to Mainnet
            </button>
            <button onClick={() => connectWallet('devnet')} className="mt-4 ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
              Connect Wallet to Devnet
            </button>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Phantom;
