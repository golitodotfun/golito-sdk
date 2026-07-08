import { 
  GOLITO_MINT_ADDRESS, 
  GOLITO_ESCROW_WALLET, 
  GOLITO_DECIMALS, 
  DEFAULT_BACKEND_URL, 
  DEFAULT_RPC_URL 
} from './constants.js';
import { 
  Match, 
  MatchPools, 
  Prediction, 
  UserPowerups, 
  FaucetClaimResponse, 
  SpinStatusResponse, 
  SpinResultResponse, 
  LeaderboardEntry, 
  TikiTakaMatch, 
  TikiTakaLeaderboardEntry, 
  BurnStatsResponse, 
  CopyConnection 
} from './types.js';

export class GolitoClient {
  private backendUrl: string;
  private rpcUrl: string;
  private mintAddress: string;
  private escrowAddress: string;

  constructor(config: { backendUrl?: string; rpcUrl?: string } = {}) {
    this.backendUrl = config.backendUrl || DEFAULT_BACKEND_URL;
    this.rpcUrl = config.rpcUrl || DEFAULT_RPC_URL;
    this.mintAddress = GOLITO_MINT_ADDRESS;
    this.escrowAddress = GOLITO_ESCROW_WALLET;
  }

  // ==========================================
  // EVM Transaction Builders
  // ==========================================

  /**
   * Helper to build a transaction sending GOLITO tokens to the Escrow wallet
   */
  async buildGolitoStakingTransaction(
    playerAddress: string,
    amountInGolito: number
  ): Promise<{ to: string; from: string; data: string; value: string }> {
    const transferSelector = '0xa9059cbb'; // transfer(address,uint256) selector
    const paddedRecipient = this.escrowAddress.toLowerCase().slice(2).padStart(64, '0');
    const rawAmount = BigInt(Math.round(amountInGolito * Math.pow(10, GOLITO_DECIMALS)));
    const paddedAmount = rawAmount.toString(16).padStart(64, '0');
    const callData = transferSelector + paddedRecipient + paddedAmount;

    return {
      to: this.mintAddress,
      from: playerAddress,
      data: callData,
      value: '0x0'
    };
  }

  // ==========================================
  // REST API Endpoints: Matches & Predictions
  // ==========================================

  /**
   * Fetch active match fixtures list
   */
  async getMatches(): Promise<Match[]> {
    const res = await fetch(`${this.backendUrl}/api/matches`);
    if (!res.ok) throw new Error('Failed to fetch matches');
    return res.json();
  }

  /**
   * Fetch active prediction pools for a match
   */
  async getMatchPools(matchId: string): Promise<MatchPools> {
    const res = await fetch(`${this.backendUrl}/api/matches/${matchId}/pools`);
    if (!res.ok) throw new Error(`Failed to fetch pools for match ${matchId}`);
    return res.json();
  }

  /**
   * Fetch predictions made by a user's wallet address
   */
  async getUserPredictions(walletAddress: string): Promise<Prediction[]> {
    const res = await fetch(`${this.backendUrl}/api/predictions/user?wallet=${walletAddress}`);
    if (!res.ok) throw new Error(`Failed to fetch predictions for ${walletAddress}`);
    return res.json();
  }

  /**
   * Submit a prediction record to the database
   */
  async submitPredictionRecord(params: {
    wallet_address: string;
    match_id: string;
    prediction_type: 'pemenang' | 'gol' | 'kartu';
    prediction_value: string;
    stake_amount: number;
    tx_signature: string;
    double_multiplier_used?: boolean;
  }): Promise<{ success: boolean; predictionId: number }> {
    const res = await fetch(`${this.backendUrl}/api/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit prediction');
    }
    return res.json();
  }

  // ==========================================
  // REST API Endpoints: Faucet & Minigames
  // ==========================================

  /**
   * Claim daily faucet tokens
   */
  async claimFaucet(walletAddress: string): Promise<FaucetClaimResponse> {
    const res = await fetch(`${this.backendUrl}/api/faucet/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address: walletAddress })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Faucet claim failed');
    }
    return res.json();
  }

  /**
   * Fetch Lucky Spin free availability and cooldown status
   */
  async getSpinStatus(walletAddress: string): Promise<SpinStatusResponse> {
    const res = await fetch(`${this.backendUrl}/api/minigames/spin-status?wallet=${walletAddress}`);
    if (!res.ok) throw new Error('Failed to fetch spin status');
    return res.json();
  }

  /**
   * Execute Lucky Spin minigame
   */
  async executeSpin(params: {
    wallet_address: string;
    tx_signature?: string | null;
    is_free: boolean;
  }): Promise<SpinResultResponse> {
    const res = await fetch(`${this.backendUrl}/api/minigames/spin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || err.error || 'Spin execution failed');
    }
    return res.json();
  }

  // ==========================================
  // REST API Endpoints: Tiki-Taka Run
  // ==========================================

  /**
   * Start a new Tiki-Taka run match record
   */
  async startTikiTaka(walletAddress: string, txSignature: string): Promise<TikiTakaMatch> {
    const res = await fetch(`${this.backendUrl}/api/tikitaka/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address: walletAddress, tx_signature: txSignature })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to start Tiki-Taka');
    }
    return res.json();
  }

  /**
   * Settle and submit final run score for Tiki-Taka
   */
  async resolveTikiTaka(matchId: string, finalScore: number): Promise<{ success: boolean; newHighScore: boolean }> {
    const res = await fetch(`${this.backendUrl}/api/tikitaka/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, score: finalScore })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to settle Tiki-Taka');
    }
    return res.json();
  }

  /**
   * Fetch Tiki-Taka run scoreboard leaderboard
   */
  async getTikiTakaLeaderboard(): Promise<TikiTakaLeaderboardEntry[]> {
    const res = await fetch(`${this.backendUrl}/api/tikitaka/leaderboard`);
    if (!res.ok) throw new Error('Failed to fetch Tiki-Taka leaderboard');
    return res.json();
  }

  // ==========================================
  // REST API Endpoints: Leaderboard & CopyBetting & Burn
  // ==========================================

  /**
   * Fetch daily overall predictions leaderboard
   */
  async getDailyLeaderboard(): Promise<LeaderboardEntry[]> {
    const res = await fetch(`${this.backendUrl}/api/leaderboard/daily`);
    if (!res.ok) throw new Error('Failed to fetch daily leaderboard');
    return res.json();
  }

  /**
   * Fetch burn statistics and history
   */
  async getBurnStats(): Promise<BurnStatsResponse> {
    const res = await fetch(`${this.backendUrl}/api/burn/stats`);
    if (!res.ok) throw new Error('Failed to fetch burn stats');
    return res.json();
  }

  /**
   * Fetch copy betting connections for follower
   */
  async getCopyConnections(followerWallet: string): Promise<CopyConnection[]> {
    const res = await fetch(`${this.backendUrl}/api/copybetting/connections?follower=${followerWallet}`);
    if (!res.ok) throw new Error('Failed to fetch copy connections');
    return res.json();
  }

  /**
   * Create or update copy connection to a predictor
   */
  async toggleCopyConnection(params: {
    follower_wallet: string;
    predictor_wallet: string;
    stake_amount: number;
    commission_pct: number;
    active: boolean;
  }): Promise<{ success: boolean }> {
    const res = await fetch(`${this.backendUrl}/api/copybetting/connections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, active: params.active ? 1 : 0 })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to toggle copy connection');
    }
    return res.json();
  }

  /**
   * Fetch current copy betting escrow balance for a wallet
   */
  async getCopyEscrowBalance(walletAddress: string): Promise<{ balance: number }> {
    const res = await fetch(`${this.backendUrl}/api/copybetting/escrow/balance?wallet=${walletAddress}`);
    if (!res.ok) throw new Error('Failed to fetch escrow balance');
    return res.json();
  }
}
