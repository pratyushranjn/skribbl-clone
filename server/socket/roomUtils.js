const buildHint = (word) => {
  if (!word) return "";

  const chars = word.split("");
  const hintChars = chars.map((ch) => (ch === " " ? "/" : "_"));

  hintChars[0] = chars[0];
  if (chars.length >= 6) {
    hintChars[chars.length - 1] = chars[chars.length - 1];
  }

  return hintChars.join(" ");
};

const createRoomSettings = (input = {}) => {
  const rounds = Number.parseInt(input.rounds, 10);
  const wordCount = Number.parseInt(input.wordCount, 10);
  const drawTime = Number.parseInt(input.drawTime, 10);
  const maxPlayers = Number.parseInt(input.maxPlayers, 10);
  const hints = Number.parseInt(input.hints, 10);

  return {
    rounds: Number.isFinite(rounds) ? Math.min(Math.max(rounds, 2), 10) : 5,
    wordCount: Number.isFinite(wordCount) ? Math.min(Math.max(wordCount, 1), 5) : 3,
    drawTime: Number.isFinite(drawTime) ? Math.min(Math.max(drawTime, 60), 240) : 60,
    maxPlayers: Number.isFinite(maxPlayers) ? Math.min(Math.max(maxPlayers, 2), 20) : 8,
    hints: Number.isFinite(hints) ? Math.min(Math.max(hints, 0), 5) : 2,
    isPrivate: typeof input.isPrivate === "boolean" ? input.isPrivate : true,
  };
};

const emitRoomState = (io, roomId, room) => {
  io.to(roomId).emit("room_players", {
    players: room.players,
    hostId: room.hostId,
    settings: room.settings,
  });
};

const getDrawer = (room) => room.players[room.currentDrawerIndex];

module.exports = {
  buildHint,
  createRoomSettings,
  emitRoomState,
  getDrawer,
};