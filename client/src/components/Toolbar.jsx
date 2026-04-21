function Toolbar({
  startGame,
  sendGuess,
  clearCanvas,
  undoDraw,
  room,
  canDraw,
  gameStarted,
  players,
  isHost,
  color,
  setColor,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4 flex flex-col gap-3">

      <button
        onClick={() => startGame(room)}
        disabled={players.length < 2 || !isHost}
        className="rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Start Game
      </button>

      <p className="text-xs text-slate-500">
        {!isHost
          ? "Only the host can start the game"
          : players.length < 2
            ? "Need at least 2 players to start"
            : "Ready to start"}
      </p>


      <div className="flex gap-2">
        <input
          id="guess-input"
          placeholder="Type your guess..."
          disabled={!gameStarted || canDraw}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendGuess(room, e.target.value);
              e.target.value = "";
            }
          }}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
        <button
          type="button"
          disabled={!gameStarted || canDraw}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          onClick={() => {
            const input = document.getElementById('guess-input');
            if (input && input.value.trim()) {
              sendGuess(room, input.value);
              input.value = '';
            }
          }}
        >
          Send
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Brush Color</label>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-9 w-14 cursor-pointer rounded border border-slate-300 bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => undoDraw(room)}
          disabled={!canDraw}
          className="rounded-lg border border-slate-300 bg-white py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          Undo
        </button>

        <button
          onClick={() => clearCanvas(room)}
          disabled={!canDraw}
          className="rounded-lg bg-rose-500 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Clear
        </button>
      </div>

    </div>
  );
}

export default Toolbar;