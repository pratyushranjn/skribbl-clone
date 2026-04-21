const { Server } = require("socket.io");
const { getRandomWords } = require("../data/words");
const { registerChatEvents } = require("./chatEvents");
const {
  buildHint,
  createRoomSettings,
  emitRoomState,
  getDrawer,
} = require("./roomUtils");

const rooms = {};

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join_room", (payload) => {
      if (!payload || typeof payload !== "object") return;

      const { roomId, username, settings } = payload;
      if (typeof roomId !== "string" || typeof username !== "string") return;

      const trimmedRoomId = roomId.trim();
      const trimmedUsername = username.trim();

      if (!trimmedRoomId || !trimmedUsername || !/^[A-Za-z ]+$/.test(trimmedUsername)) return;

      socket.join(trimmedRoomId);

      if (!rooms[trimmedRoomId]) {
        rooms[trimmedRoomId] = {
          players: [],
          word: "",
          scores: {},
          currentDrawerIndex: 0,
          started: false,
          rounds: 0,
          hostId: socket.id,
          settings: createRoomSettings(settings),
        };
      }

      const room = rooms[trimmedRoomId];
      if (!room.hostId) room.hostId = socket.id;

      if (!room.players.some((player) => player.id === socket.id)) {
        room.players.push({ id: socket.id, username: trimmedUsername });
      }

      if (room.scores[socket.id] == null) {
        room.scores[socket.id] = 0;
      }

      emitRoomState(io, trimmedRoomId, room);
    });

    socket.on("startDrawing", (payload) => {
      if (!payload || typeof payload !== "object") return;

      const { x, y, roomId, color, size } = payload;
      if (typeof roomId !== "string" || typeof x !== "number" || typeof y !== "number") return;

      const room = rooms[roomId];
      const drawer = room && getDrawer(room);
      if (!drawer || socket.id !== drawer.id) return;

      socket.to(roomId).emit("startDrawing", {
        x,
        y,
        color: typeof color === "string" ? color : "#000000",
        size: typeof size === "number" ? size : 2,
      });
    });

    socket.on("draw", (payload) => {
      if (!payload || typeof payload !== "object") return;

      const { x, y, roomId, color, size } = payload;
      if (typeof roomId !== "string" || typeof x !== "number" || typeof y !== "number") return;

      const room = rooms[roomId];
      const drawer = room && getDrawer(room);
      if (!drawer || socket.id !== drawer.id) return;

      socket.to(roomId).emit("draw", {
        x,
        y,
        color: typeof color === "string" ? color : "#000000",
        size: typeof size === "number" ? size : 2,
      });
    });

    socket.on("stopDrawing", ({ roomId }) => {
      const room = rooms[roomId];
      const drawer = room && getDrawer(room);
      if (!drawer || socket.id !== drawer.id) return;

      socket.to(roomId).emit("stopDrawing");
    });

    socket.on("start_game", ({ roomId }) => {
      const room = rooms[roomId];
      if (!room || room.players.length < 2 || socket.id !== room.hostId) return;

      room.currentDrawerIndex = 0;
      room.rounds = 0;
      room.started = false;

      io.to(room.players[0].id).emit("choose_word", {
        words: getRandomWords(room.settings?.wordCount || 3),
      })
    });

    socket.on("clear_canvas", ({ roomId }) => {
      const room = rooms[roomId];
      const drawer = room && getDrawer(room);
      if (!drawer || socket.id !== drawer.id) return;

      io.to(roomId).emit("clear_canvas");
    });

    socket.on("undo_draw", ({ roomId }) => {
      const room = rooms[roomId];
      const drawer = room && getDrawer(room);
      if (!drawer || socket.id !== drawer.id) return;

      io.to(roomId).emit("undo_draw");
    });

    socket.on("word_chosen", ({ roomId, word }) => {
      const room = rooms[roomId];
      const drawer = room && getDrawer(room);
      if (!drawer || socket.id !== drawer.id || typeof word !== "string" || !word.trim()) return;

      room.word = word.trim();
      room.correctGuessers = [];

      // Clear any previous timer
      if (room.roundTimer) {
        clearTimeout(room.roundTimer);
        room.roundTimer = null;
      }

      // Set round time (seconds), default 60s if not set
      const roundTime = (room.settings?.drawTime || 60) * 1000;
      room.roundTimer = setTimeout(() => {
        // When time is up, move to next round
        room.rounds += 1;
        io.to(roomId).emit("round_ended", {
          word: room.word,
          scores: room.scores,
        });
        if (room.rounds >= (room.settings?.rounds || 5)) {
          const winner = Object.entries(room.scores).sort((a, b) => b[1] - a[1])[0];
          io.to(roomId).emit("game_over", {
            winnerId: winner ? winner[0] : null,
            scores: room.scores,
          });

          // Reset all player scores to zero for next game
          Object.keys(room.scores).forEach((id) => {
            room.scores[id] = 0;
          });
          room.started = false;
          return;
        }
        
        room.currentDrawerIndex = (room.currentDrawerIndex + 1) % room.players.length;
        room.correctGuessers = [];
        room.word = "";
        io.to(room.players[room.currentDrawerIndex].id).emit("choose_word", {
          words: getRandomWords(room.settings?.wordCount || 3),
        });
      }, roundTime);

      const payload = {
        drawerId: drawer.id,
        wordLength: word.length,
        hint: buildHint(room.word),
      };

      io.to(roomId).emit(room.started ? "next_turn" : "game_started", payload);
      room.started = true;
    });

    socket.on("guess", (payload) => {
      if (!payload || typeof payload !== "object") return;

      const { roomId, guess } = payload;
      if (typeof roomId !== "string" || typeof guess !== "string") return;

      const cleanRoomId = roomId.trim();
      const cleanGuess = guess.trim();
      if (!cleanRoomId || !cleanGuess) return;

      const room = rooms[cleanRoomId];
      const drawer = room && getDrawer(room);
      if (!room || !drawer || !room.word || socket.id === drawer.id) return;

      // Track correct guessers for this round
      if (!room.correctGuessers) {
        room.correctGuessers = [];
      }

      // If already guessed, ignore
      if (room.correctGuessers.includes(socket.id)) return;

      if (cleanGuess.toLowerCase() !== room.word.toLowerCase()) {
        io.to(cleanRoomId).emit("wrong_guess", { playerId: socket.id, guess: cleanGuess });
        return;
      }

      // Mark as correct guesser and give points
      room.correctGuessers.push(socket.id);
      const guesser = room.players.find((player) => player.id === socket.id);
      room.scores[socket.id] += 10;

      io.to(cleanRoomId).emit("correct_guess", {
        playerId: socket.id,
        playerName: guesser ? guesser.username : "Unknown",
        scores: room.scores,
      });

      // Check if all guessers (not drawer) have guessed
      const totalGuessers = room.players.filter((p) => p.id !== drawer.id).length;
      if (room.correctGuessers.length >= totalGuessers) {
        // End round early: clear timer and move to next round
        if (room.roundTimer) {
          clearTimeout(room.roundTimer);
          room.roundTimer = null;
        }
        room.rounds += 1;
        io.to(cleanRoomId).emit("round_ended", {
          word: room.word,
          scores: room.scores,
        });
        if (room.rounds >= (room.settings?.rounds || 5)) {
          const winner = Object.entries(room.scores).sort((a, b) => b[1] - a[1])[0];
          io.to(cleanRoomId).emit("game_over", {
            winnerId: winner ? winner[0] : null,
            scores: room.scores,
          });
          room.started = false;
          return;
        }
        room.currentDrawerIndex = (room.currentDrawerIndex + 1) % room.players.length;
        room.correctGuessers = [];
        room.word = "";
        io.to(room.players[room.currentDrawerIndex].id).emit("choose_word", {
          words: getRandomWords(room.settings?.wordCount || 3),
        });
      }
    });

    registerChatEvents(io, socket, rooms);

    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        const room = rooms[roomId];
        room.players = room.players.filter((player) => player.id !== socket.id);
        delete room.scores[socket.id];

        if (room.hostId === socket.id) room.hostId = room.players[0]?.id || null;
        if (room.currentDrawerIndex >= room.players.length) room.currentDrawerIndex = 0;

        emitRoomState(io, roomId, room);

        if (room.players.length === 0) delete rooms[roomId];
      }
    });
  });
};
