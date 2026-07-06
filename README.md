<p align="center">
  <img src="stadium_pixel_art.png" alt="Golito SDK Banner" width="600" />
</p>

# @golitodotfun/sdk

Official TypeScript/JavaScript SDK for interacting with the **Golito** P2P football predictions platform and on-chain minigames on Solana.

[![License](https://img.shields.io/github/license/golitodotfun/golito-sdk)](LICENSE)
[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet-blue)](https://explorer.solana.com/?cluster=devnet)
[![npm version](https://img.shields.io/badge/npm-1.0.0-cb3837.svg)](package.json)

---

## Features

- ⚽ **Match & Predictions API**: Fetch active football matches, match pools, and submit player predictions.
- 🎡 **Lucky Spin Minigame**: Query spin status, claim cooldowns, and resolve random spins on-chain.
- 🏃‍♂️ **Tiki-Taka Match resolve**: Initialize and resolve active retro arcade runs.
- 📈 **Daily Leaderboards**: Query leaderboard entries and stats.
- 👥 **Copy BettingEscrow system**: Manage copy connections, active predictor balances, and deposits.
- 🪙 **Solana Transaction Builders**: Build compliant GOLITO SPL token transfer transactions directly.

---

## Installation

Install the package via npm:

```bash
npm install @golitodotfun/sdk @solana/web3.js @solana/spl-token
```

Or via yarn:

```bash
yarn add @golitodotfun/sdk @solana/web3.js @solana/spl-token
```

---

## Quick Start

### Initialize Client

```typescript
import { GolitoClient } from '@golitodotfun/sdk';

// Initialize with default endpoints (Solana Devnet & Production backend)
const client = new GolitoClient();

// Or with custom URLs
const customClient = new GolitoClient({
  backendUrl: 'http://localhost:5000',
  rpcUrl: 'https://api.devnet.solana.com'
});
```

### Fetch Active Matches

```typescript
const matches = await client.getMatches();
console.log('Active Fixtures:', matches);
```

### Place a Prediction (Transaction + API)

```typescript
import { PublicKey, Connection, sendAndConfirmTransaction } from '@solana/web3.js';

const playerPublicKey = new PublicKey('USER_WALLET_PUBKEY');
const stakeAmount = 1000; // 1,000 GOLITO

// 1. Build the Solana transaction sending tokens to Escrow
const transaction = await client.buildGolitoStakingTransaction(
  playerPublicKey,
  stakeAmount
);

// 2. Sign and send the transaction using the user's wallet provider
// (Example assuming wallet adapter is available)
const signature = await wallet.sendTransaction(transaction, connection);
await connection.confirmTransaction(signature, 'confirmed');

// 3. Log the prediction to the database
const result = await client.submitPredictionRecord({
  wallet_address: playerPublicKey.toBase58(),
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
const wallet = 'USER_WALLET_PUBKEY';

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
* `buildGolitoStakingTransaction(playerPubKey, amountInGolito)`: Generates a web3 `Transaction` sending GOLITO tokens to the Escrow account.

### Matches & Pools
* `getMatches()`: Returns array of active match fixtures.
* `getMatchPools(matchId)`: Gets home/away/draw staking pools details.

### Predictions
* `getUserPredictions(walletAddress)`: Fetch predictions placed by a wallet.
* `submitPredictionRecord(params)`: Submits prediction tx logs to backend.

### Faucet & Minigames
* `claimFaucet(walletAddress)`: Claims 25,000 free testnet GOLITO.
* `getSpinStatus(walletAddress)`: Inspects Lucky Spin cooldown.
* `executeSpin(params)`: Plays Lucky Spin (Free/Paid).

### Tiki-Taka Arcade Run
* `startTikiTaka(walletAddress, txSignature)`: Logs start of Tiki-Taka run.
* `resolveTikiTaka(matchId, finalScore)`: Resolves score and high scores.
* `getTikiTakaLeaderboard()`: Fetches high-score scoreboard.

---

## Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) guide for details on our code of conduct and submitting pull requests.

## Security

If you discover any security vulnerabilities, please refer to [SECURITY.md](SECURITY.md) for reporting guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
