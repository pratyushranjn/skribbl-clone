import Canvas from "./Canvas";
import ChatBox from "./ChatBox";
import Leaderboard from "./Leaderboard";
import Toolbar from "./Toolbar";

function GameScreen({
  room,
  canDraw,
  wordLength,
  wordHint,
  message,
  wordOptions,
  onChooseWord,
  clearTrigger,
  brushColor,
  setBrushColor,
  startGame,
  sendGuess,
  clearCanvas,
  undoDraw,
  gameStarted,
  players,
  scores,
  myId,
  winnerId,
  isHost,
  userName,
  sendChat,
  chatMessages,
}) {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-cyan-50 to-amber-50 p-3 sm:p-5 lg:h-screen lg:overflow-hidden lg:p-3">
      <div className="mx-auto flex w-full max-w-7xl flex-col rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur sm:p-6 lg:h-full lg:min-h-0">
        <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-slate-700 sm:text-lg">
            🏠 Room: <span className="font-bold text-slate-900">{room}</span>
          </h2>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="self-start rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-600"
          >
            Leave
          </button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-1 lg:min-h-0 lg:flex-row lg:items-stretch lg:gap-6">
          <div className="flex w-full shrink-0 flex-col lg:h-full lg:w-80 lg:min-h-0">
            <Leaderboard players={players} scores={scores} myId={myId} winnerId={winnerId} />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1 lg:h-full lg:min-h-0">
            <p className="text-center text-sm font-semibold text-slate-700 sm:text-base">
              {canDraw ? "✏️ You are drawing" : "🤔 Guess the word"}
            </p>

            <p className="text-center text-sm text-slate-600 sm:text-base">
              Word: {wordHint || "_ ".repeat(wordLength)}
            </p>

            {wordOptions.length > 0 && (
              <div className="mb-2 flex justify-center gap-2">
                {wordOptions.map((word) => (
                  <button
                    key={word}
                    onClick={() => onChooseWord(room, word)}
                    className="rounded bg-blue-500 px-3 py-1 text-white"
                  >
                    {word}
                  </button>
                ))}
              </div>
            )}

            {<p className="mb-2 min-h-6 text-center text-sm text-cyan-700 sm:text-base">
              {message || "Waiting for players..."}
            </p>}

            <div className="flex-1 lg:min-h-0">
              <Canvas roomId={room} canDraw={canDraw} clearTrigger={clearTrigger} color={brushColor} />
            </div>

            <Toolbar
              startGame={startGame}
              sendGuess={sendGuess}
              clearCanvas={clearCanvas}
              undoDraw={undoDraw}
              room={room}
              canDraw={canDraw}
              gameStarted={gameStarted}
              players={players}
              isHost={isHost}
              color={brushColor}
              setColor={setBrushColor}
            />
          </div>

          <div className="flex w-full shrink-0 flex-col overflow-hidden lg:h-full lg:w-72 lg:min-h-0">
            <ChatBox
              room={room}
              userName={userName}
              sendChat={sendChat}
              chatMessages={chatMessages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameScreen;