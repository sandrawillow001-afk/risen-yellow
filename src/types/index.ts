export type TxStatus = "idle" | "pending" | "success" | "failure";

export interface PollScoreState {
  yesVotes: number;
  noVotes: number;
}
