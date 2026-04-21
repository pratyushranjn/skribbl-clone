function JoinScreen({ name, room, rounds, wordCount, onNameChange, onRoomChange, onRoundsChange, onWordCountChange, onJoin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-100 via-slate-100 to-amber-100 p-4">
      <div className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur">
        <h2 className="text-center text-xl font-bold text-slate-800">🎮 Join Game</h2>

        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <input
          placeholder="Room ID"
          value={room}
          onChange={(e) => onRoomChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="2"
            max="10"
            value={rounds}
            onChange={(e) => onRoundsChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Rounds"
          />

          <input
            type="number"
            min="1"
            max="5"
            value={wordCount}
            onChange={(e) => onWordCountChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Words"
          />
        </div>

        <button
          onClick={onJoin}
          className="mt-1 rounded-lg bg-cyan-600 py-2 font-medium text-white transition hover:bg-cyan-700 active:scale-[0.99]"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}

export default JoinScreen;