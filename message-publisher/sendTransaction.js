
const PRIVATE_KEY ='0x4c0883a69102937d6231471b5dbb6204fe512961708279f84bde865c5d63c00a'

const { ethers } = require('ethers');

async function sendTransaction() {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-amoy.polygon.technology');
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const balance = await provider.getBalance(wallet.address);
    const wallet_address = console.log(wallet.address);
    console.log("Wallet Balance (in MATIC):", ethers.utils.formatEther(balance));

    const tx = {
      to: '0x0000000000000000000000000000000000000000',
      value: ethers.utils.parseEther('0'),
      gasLimit: ethers.utils.hexlify(100000),
      maxPriorityFeePerGas: ethers.utils.parseUnits('30', 'gwei'),
      maxFeePerGas: ethers.utils.parseUnits('50', 'gwei'),
      data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes('Hello, MSQ!')),
    };

    console.log('Sending transaction...');
    const txResponse = await wallet.sendTransaction(tx);
    console.log('Transaction sent:', txResponse.hash);

    const receipt = await txResponse.wait();
    console.log('Transaction confirmed:', receipt);
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

sendTransaction();
