const registerChatEvents = (io, socket, rooms) => {
  socket.on("chat", (payload) => {
    if (!payload || typeof payload !== "object") return;

    const { roomId, playerName, text } = payload;
    if (
      typeof roomId !== "string" ||
      typeof playerName !== "string" ||
      typeof text !== "string"
    ) {
      return;
    }

    const trimmedRoomId = roomId.trim();
    const trimmedName = playerName.trim();
    const trimmedText = text.trim();

    if (!trimmedRoomId || !trimmedName || !trimmedText) return;

    const room = rooms[trimmedRoomId];
    if (!room) return;

    io.to(trimmedRoomId).emit("chat_message", {
      playerName: trimmedName,
      text: trimmedText,
    });
  });
};

module.exports = { registerChatEvents };