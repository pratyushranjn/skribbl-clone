import "./App.css";
import { useState, useEffect } from "react";
import { useSocket } from "./hooks/useSocket";
import JoinScreen from "./components/JoinScreen";
import GameScreen from "./components/GameScreen";

function App() {
  const cleanName = (value) => value.replace(/[^a-zA-Z ]/g, "");

  const [name, setName] = useState(() => localStorage.getItem("name") || "");
  const [room, setRoom] = useState(() => localStorage.getItem("room") || "");
  const [joined, setJoined] = useState(() => {
    const savedName = localStorage.getItem("name");
    const savedRoom = localStorage.getItem("room");
    return Boolean(savedName && savedRoom);
  });
  const [rounds, setRounds] = useState(5);
  const [wordCount, setWordCount] = useState(3);
  const [drawTime, setDrawTime] = useState(120);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [hints, setHints] = useState(2);
  const [isPrivate, setIsPrivate] = useState(true);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);

  const {
    myId,
    drawerId,
    joinRoom,
    scores,
    startGame,
    sendGuess,
    chooseWord,
    sendChat,
    clearCanvas,
    undoDraw,
    clearTrigger,
    gameStarted,
    wordLength,
    wordHint,
    message,
    players,
    winnerId,
    wordOptions,
    isHost,
    chatMessages,
    timeLeft,
    roundNumber,
    roomSettings,
  } = useSocket();

  const canDraw = myId && drawerId && myId === drawerId;

  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedRoom = localStorage.getItem("room");

    if (savedName && savedRoom) {
      joinRoom(savedRoom, savedName);
    }
  }, [joinRoom]);

  const handleJoin = () => {
    const safeName = cleanName(name).trim();
    const safeRoom = room.trim();
    const safeRounds = Number.parseInt(rounds, 10);
    const safeWordCount = Number.parseInt(wordCount, 10);
    const safeDrawTime = Number.parseInt(drawTime, 10);
    const safeMaxPlayers = Number.parseInt(maxPlayers, 10);
    const safeHints = Number.parseInt(hints, 10);

    if (!safeName || !safeRoom) return;

    joinRoom(safeRoom, safeName, {
      rounds: Number.isFinite(safeRounds) ? safeRounds : 5,
      wordCount: Number.isFinite(safeWordCount) ? safeWordCount : 3,
      drawTime: Number.isFinite(safeDrawTime) ? safeDrawTime : 60,
      maxPlayers: Number.isFinite(safeMaxPlayers) ? safeMaxPlayers : 8,
      hints: Number.isFinite(safeHints) ? safeHints : 2,
      isPrivate,
    });

    localStorage.setItem("name", safeName);
    localStorage.setItem("room", safeRoom);

    setJoined(true);
  };

  if (!joined) {
    return (
      <JoinScreen
        name={name}
        room={room}
        rounds={rounds}
        wordCount={wordCount}
        drawTime={drawTime}
        maxPlayers={maxPlayers}
        hints={hints}
        isPrivate={isPrivate}
        onNameChange={(value) => setName(cleanName(value))}
        onRoomChange={setRoom}
        onRoundsChange={setRounds}
        onWordCountChange={setWordCount}
        onDrawTimeChange={setDrawTime}
        onMaxPlayersChange={setMaxPlayers}
        onHintsChange={setHints}
        onPrivacyChange={setIsPrivate}
        onJoin={handleJoin}
      />
    );
  }

  return (
    <GameScreen
      room={room}
      canDraw={canDraw}
      wordLength={wordLength}
      wordHint={wordHint}
      message={message}
      wordOptions={wordOptions}
      onChooseWord={chooseWord}
      clearTrigger={clearTrigger}
      brushColor={brushColor}
      brushSize={brushSize}
      setBrushColor={setBrushColor}
      setBrushSize={setBrushSize}
      startGame={startGame}
      sendGuess={sendGuess}
      clearCanvas={clearCanvas}
      undoDraw={undoDraw}
      gameStarted={gameStarted}
      players={players}
      scores={scores}
      myId={myId}
      winnerId={winnerId}
      isHost={isHost}
      userName={name}
      sendChat={sendChat}
      chatMessages={chatMessages}
      timeLeft={timeLeft}
      roundNumber={roundNumber}
      roomSettings={roomSettings}
    />
  );
}

export default App;