function Leaderboard({ players, scores, myId, winnerId }) {
  const rankedPlayers = [...players].sort(
    (a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)
  );

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Leaderboard
        </h3>
        <span className="text-xs text-slate-500">{rankedPlayers.length} players</span>
      </div>

      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {rankedPlayers.map((p, index) => {
          const score = scores[p.id] || 0;
          const isWinner = p.id === winnerId;
          const isYou = p.id === myId;

          return (
            <div
              key={p.id}
              className={`flex items-center justify-between rounded-md px-2.5 py-2 text-sm ${
                isWinner ? "bg-amber-50" : "bg-slate-50"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="w-5 text-xs font-semibold text-slate-500">
                  {index + 1}
                </span>

                <p className={`truncate ${isWinner ? "font-bold text-amber-700" : "font-medium text-slate-700"}`}>
                  {isWinner && <span className="mr-1" aria-hidden="true">🏆</span>}
                  {p.username}
                  {isYou && <span className="ml-1 text-xs text-cyan-600">(You)</span>}
                </p>
              </div>

              <span className={`ml-3 shrink-0 text-sm font-semibold ${isWinner ? "text-amber-700" : "text-slate-900"}`}>
                {score} pts
              </span>
            </div>
          );
        })}

        {rankedPlayers.length === 0 && (
          <p className="py-3 text-center text-sm text-slate-500">
            No players yet
          </p>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;