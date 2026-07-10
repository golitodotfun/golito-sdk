# @golitodotfun/sdk

Official TypeScript/JavaScript SDK for interacting with **Golito** — an arcade-style football prediction platform on Robinhood Chain (Rhood) featuring PvP prediction pools, leaderboards, streaks, copy betting, and minigames.

[![License](https://img.shields.io/github/license/golitodotfun/golito-sdk)](LICENSE)
[![Robinhood Mainnet](https://img.shields.io/badge/Robinhood_Chain-Mainnet-00c853)](https://explorer.chain.robinhood.com)
[![npm version](https://img.shields.io/badge/npm-1.0.0-cb3837.svg)](package.json)

---

## Features

- ⚽ **Match & Predictions API**: Fetch active football matches, match pools, and submit player predictions.
- 🎡 **Lucky Spin Minigame**: Query spin status, claim cooldowns, and resolve random spins on-chain.
- 🏃‍♂️ **Tiki-Taka Match resolve**: Initialize and resolve active retro arcade runs.
- 📈 **Daily Leaderboards**: Query leaderboard entries and stats.
- 👥 **Copy Betting Escrow system**: Manage copy connections, active predictor balances, and deposits.
- 🪙 **EVM Transaction Builders**: Build GOLITO ERC-20 token transfer transaction parameters directly for MetaMask/Rabby.

---

## Installation

Install the package via npm:

```bash
npm install @golitodotfun/sdk
```

Or via yarn:

```bash
yarn add @golitodotfun/sdk
```

---

## Quick Start

### Initialize Client

```typescript
import { GolitoClient } from '@golitodotfun/sdk';

// Initialize with default endpoints (Robinhood Chain Mainnet & Production backend)
const client = new GolitoClient();

// Or with custom URLs
const customClient = new GolitoClient({
  backendUrl: 'http://localhost:5000',
  rpcUrl: 'https://mainnet.robinhoodchain.com/rpc'
});
```

### Fetch Active Matches

```typescript
const matches = await client.getMatches();
console.log('Active Fixtures:', matches);
```

### Place a Prediction (EVM Transaction + API)

```typescript
const playerAddress = '0x1234...5678';
const stakeAmount = 1000; // 1,000 GOLITO

// 1. Build the EVM transaction parameters sending tokens to Escrow
const txParams = await client.buildGolitoStakingTransaction(
  playerAddress,
  stakeAmount
);

// 2. Send the transaction using the window.ethereum provider (e.g. MetaMask / Rabby)
const signature = await window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [txParams]
});

// 3. Log the prediction to the database
const result = await client.submitPredictionRecord({
  wallet_address: playerAddress,
  match_id: 'api-12345',
  prediction_type: 'pemenang',
  prediction_value: 'home', // 'home', 'away', or 'draw'
  stake_amount: stakeAmount,
  tx_signature: signature
});

console.log('Prediction placed successfully! ID:', result.predictionId);
```

### Check Lucky Spin & Claim Free Spin

```typescript
const wallet = '0xYourWalletAddress';

// Check if free spin is available
const status = await client.getSpinStatus(wallet);

if (status.canFreeSpin) {
  // Execute free spin
  const spinRes = await client.executeSpin({
    wallet_address: wallet,
    is_free: true
  });
  console.log('Spin Prize Won:', spinRes.prize.label);
} else {
  console.log('Free spin on cooldown. Next spin at:', status.nextFreeSpinAt);
}
```

---

## API Reference

### Staking & Transactions
* `buildGolitoStakingTransaction(playerAddress, amountInGolito)`: Generates EVM transaction parameters for an ERC-20 `transfer()` call sending GOLITO tokens to the Escrow wallet.

### Matches & Pools
* `getMatches()`: Returns array of active match fixtures.
* `getMatchPools(matchId)`: Gets home/away/draw staking pools details.

### Predictions
* `getUserPredictions(walletAddress)`: Fetch predictions placed by a wallet.
* `submitPredictionRecord(params)`: Submits prediction tx logs to backend.

### Faucet & Minigames
* `claimFaucet(walletAddress)`: Claims 25,000 free GOLITO tokens.
* `getSpinStatus(walletAddress)`: Inspects Lucky Spin cooldown.
* `executeSpin(params)`: Plays Lucky Spin (Free/Paid).

### Tiki-Taka Arcade Run
* `startTikiTaka(walletAddress, txSignature)`: Logs start of Tiki-Taka run.
* `resolveTikiTaka(matchId, finalScore)`: Resolves score and high scores.
* `getTikiTakaLeaderboard()`: Fetches high-score scoreboard.

### Copy Betting
* `getCopyConnections(followerWallet)`: Fetch copy betting connections.
* `toggleCopyConnection(params)`: Create or update copy connection.
* `getCopyEscrowBalance(walletAddress)`: Fetch copy escrow balance.

### Burn & Leaderboard
* `getDailyLeaderboard()`: Fetch daily predictions leaderboard.
* `getBurnStats()`: Fetch deflationary burn statistics and history.

---

## Network Details

| Parameter | Value |
|-----------|-------|
| **Chain** | Robinhood Chain (Mainnet) |
| **Chain ID** | 46630 |
| **RPC URL** | `https://mainnet.robinhoodchain.com/rpc` |
| **Explorer** | [explorer.chain.robinhood.com](https://explorer.chain.robinhood.com) |
| **Token** | $GOLITO (ERC-20) |
| **Token Address** | `0x07C229Dff6ed1e71AeD10323660C8795D30FE929` |
| **Escrow Wallet** | `0x6fb8403e5D113562e85728A7248f488c763E0e1A` |
| **Decimals** | 18 |

---

## Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) guide for details on our code of conduct and submitting pull requests.

## Security

If you discover any security vulnerabilities, please refer to [SECURITY.md](SECURITY.md) for reporting guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
