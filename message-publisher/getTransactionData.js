const { ethers } = require('ethers');

// Connect to Polygon Mumbai Testnet
const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');

const txHash = '0x5db7ff0bff297ca92dafe7d6cef295e3ffe41e4f18a1c1969647a93406d51558';

async function getTransactionData() {
  const tx = await provider.getTransaction(txHash);
  const decodedData = ethers.utils.toUtf8String(tx.data); 
  console.log('Decoded Message:', decodedData);
}

getTransactionData();
