import { useState, useEffect } from "react";
import { ethers } from "ethers";

const Wallet = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [useZeroAddress, setUseZeroAddress] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      fetchTransactions();
    }
  }, [account]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected. Please install MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length === 0) {
        alert("No account found. Please connect your wallet.");
        return;
      }

      setAccount(accounts[0]);
      const balance = await provider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. See console for details.");
    }
  };

  const fetchTransactions = async () => {
    try {
      const url = `https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${account}&startblock=0&endblock=99999999&sort=desc&apikey=YourPolygonScanAPIKey`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "1") {
        setTransactions(data.result.slice(0, 5));
      } else {
        console.error("Failed to fetch transactions:", data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const sendAmount = async () => {
    if (!recipient || !amount) return alert("Please enter recipient address and amount.");
    
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      alert(`Transaction successful! Hash: ${tx.hash}`);

      // Refresh balance and transaction history
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));
      fetchTransactions();
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessageTransaction = async () => {
    try {
      setLoading(true);
      if (!message) {
        alert("Enter a message.");
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: useZeroAddress ? ethers.ZeroAddress : recipient,
        value: ethers.parseEther("0"),
        data: ethers.hexlify(ethers.toUtf8Bytes(message)),
      });
      await tx.wait();
      alert(`Message sent! View: https://amoy.polygonscan.com/tx/${tx.hash}`);
      fetchTransactions();
    } catch (error) {
      console.error("Message transaction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white w-[400px] mx-auto mt-10">
      <h2 className="text-xl font-bold text-center">Polygon Testnet Wallet</h2>
      {account ? (
        <>
          <div className="mt-4 p-3 border rounded bg-gray-100">
            <p className="text-sm font-medium">Connected Address:</p>
            <p className="text-xs break-all text-blue-500">{account}</p>
            <p className="mt-2 font-bold text-lg">{balance} MATIC</p>
          </div>
          <button onClick={fetchTransactions} className="w-full mt-2 p-2 bg-gray-500 text-white rounded">Refresh</button>
          <h3 className="text-md font-bold mt-4">Send Amount</h3>
          <input type="text" placeholder="Recipient Address" className="w-full p-2 border rounded mt-2" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          <input type="text" placeholder="Amount in MATIC" className="w-full p-2 border rounded mt-2" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button onClick={sendAmount} className="w-full mt-2 p-2 bg-blue-500 text-white rounded" disabled={loading}>{loading ? "Sending..." : "Send Amount"}</button>
          <h3 className="text-md font-bold mt-4">Send Message</h3>
          <textarea placeholder="Enter your message..." className="w-full p-2 border rounded mt-2" value={message} onChange={(e) => setMessage(e.target.value)} />
          <div className="flex items-center mt-2">
            <input type="checkbox" checked={useZeroAddress} onChange={() => setUseZeroAddress(!useZeroAddress)} className="mr-2" />
            <label>Send to Zero Address</label>
          </div>
          {!useZeroAddress && <input type="text" placeholder="Recipient Address" className="w-full p-2 border rounded mt-2" value={recipient} onChange={(e) => setRecipient(e.target.value)} />}
          <button onClick={sendMessageTransaction} className="w-full mt-2 p-2 bg-green-500 text-white rounded" disabled={loading}>{loading ? "Sending..." : "Send Message"}</button>
        </>
      ) : (
        <button onClick={connectWallet} className="w-full mt-4 p-3 bg-blue-500 text-white rounded">Connect Wallet</button>
      )}
    </div>
  );
};

export default Wallet;
