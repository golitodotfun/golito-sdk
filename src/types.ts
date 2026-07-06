export interface MatchPools {
  homePool: number;
  awayPool: number;
  drawPool: number;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  matchTime: string;
  status: string;
  homeScore?: number;
  awayScore?: number;
}

export interface Prediction {
  id: number;
  wallet_address: string;
  match_id: string;
  prediction_type: 'pemenang' | 'gol' | 'kartu';
  prediction_value: string;
  stake_amount: number;
  status: 'PENDING' | 'WON' | 'LOST';
  double_multiplier_used: number;
  actual_result?: string;
  created_at: string;
}

export interface UserPowerups {
  wallet_address: string;
  streak_shields: number;
  double_multipliers: number;
}

export interface FaucetClaimResponse {
  success: boolean;
  message?: string;
  txSignature?: string;
  nextClaimAvailableAt?: string;
}

export interface SpinStatusResponse {
  canFreeSpin: boolean;
  nextFreeSpinAt?: string;
}

export interface SpinResultResponse {
  success: boolean;
  prize: {
    name: string;
    label: string;
    amount: number;
    powerup?: string;
  };
  payoutTx?: string;
  burnedAmount: number;
}

export interface LeaderboardEntry {
  wallet_address: string;
  score: number;
  rank: number;
}

export interface TikiTakaMatch {
  matchId: string;
  walletAddress: string;
  status: string;
  created_at: string;
}

export interface TikiTakaLeaderboardEntry {
  wallet_address: string;
  high_score: number;
  rank: number;
}

export interface BurnStatsResponse {
  totalBurned: number;
  burnCount: number;
  recentBurns: Array<{
    id: number;
    wallet_address: string;
    burn_amount: number;
    source: string;
    tx_signature: string;
    created_at: string;
  }>;
}

export interface CopyConnection {
  id: number;
  follower_wallet: string;
  predictor_wallet: string;
  stake_amount: number;
  commission_pct: number;
  active: number;
  created_at: string;
}
