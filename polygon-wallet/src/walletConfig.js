import { defineChain } from 'viem';

export const polygonAmoy = defineChain({
  id: 80002,
  name: 'Polygon Amoy',
  network: 'polygon-amoy',
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology'] },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  blockExplorers: {
    default: { name: 'Polygonscan', url: 'https://www.oklink.com/amoy' },
  },
});
