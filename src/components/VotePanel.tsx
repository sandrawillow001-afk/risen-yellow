"use client";

import type { PollScoreState, TxStatus } from "@/types";

interface VotePanelProps {
  pollState: PollScoreState;
  hasVoted: boolean;
  txStatus: TxStatus;
  onVoteYes: () => void;
  onVoteNo: () => void;
}

export default function VotePanel({
  pollState,
  hasVoted,
  txStatus,
  onVoteYes,
  onVoteNo,
}: VotePanelProps) {
  const total = pollState.yesVotes + pollState.noVotes;
  const yesPct = total > 0 ? (pollState.yesVotes / total) * 100 : 50;
  const noPct = total > 0 ? (pollState.noVotes / total) * 100 : 50;
  const isPending = txStatus === "pending";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Live Poll Results
      </h2>

      <div className="mb-6 space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-green-700">YES</span>
            <span className="text-gray-600">
              {pollState.yesVotes} vote{pollState.yesVotes !== 1 ? "s" : ""} (
              {yesPct.toFixed(1)}%)
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${yesPct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-red-700">NO</span>
            <span className="text-gray-600">
              {pollState.noVotes} vote{pollState.noVotes !== 1 ? "s" : ""} (
              {noPct.toFixed(1)}%)
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-500"
              style={{ width: `${noPct}%` }}
            />
          </div>
        </div>

        {total === 0 && (
          <p className="text-center text-sm text-gray-400">
            No votes yet. Be the first to vote!
          </p>
        )}
      </div>

      {hasVoted ? (
        <p className="text-center text-sm font-medium text-indigo-600">
          You have already cast your vote.
        </p>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={onVoteYes}
            disabled={isPending}
            className="flex-1 rounded-lg border-2 border-green-500 bg-white px-4 py-2.5 text-sm font-semibold text-green-600 transition-colors hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Voting..." : "Vote YES"}
          </button>
          <button
            onClick={onVoteNo}
            disabled={isPending}
            className="flex-1 rounded-lg border-2 border-red-500 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Voting..." : "Vote NO"}
          </button>
        </div>
      )}
    </div>
  );
}
