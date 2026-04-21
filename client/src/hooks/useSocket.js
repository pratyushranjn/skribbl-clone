import { useEffect, useState } from "react";
import { socket } from "../socket";

const joinRoom = (roomId, username, settings) => {
    socket.emit("join_room", { roomId, username, settings });
};

const startGame = (roomId) => {
    socket.emit("start_game", { roomId });
};

const sendGuess = (roomId, guess) => {
    socket.emit("guess", { roomId, guess });
};

const clearCanvas = (roomId) => {
    socket.emit("clear_canvas", { roomId });
};

const undoDraw = (roomId) => {
    socket.emit("undo_draw", { roomId });
};

const chooseWord = (roomId, word) => {
    socket.emit("word_chosen", { roomId, word });
};

const sendChat = (roomId, playerName, text) => {
    socket.emit("chat", { roomId, playerName, text });
};

export const useSocket = () => {
    const [myId, setMyId] = useState("");
    const [drawerId, setDrawerId] = useState(null);
    const [scores, setScores] = useState({});
    const [clearTrigger, setClearTrigger] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [wordLength, setWordLength] = useState(0);
    const [wordHint, setWordHint] = useState("");
    const [message, setMessage] = useState("");
    const [players, setPlayers] = useState([]);
    const [winnerId, setWinnerId] = useState(null);
    const [wordOptions, setWordOptions] = useState([]);
    const [isHost, setIsHost] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const onConnect = () => {
            setMyId(socket.id);
        };

        const onGameStarted = ({ drawerId, wordLength, hint }) => {
            setDrawerId(drawerId);
            setGameStarted(true);
            setWordLength(wordLength || 0);
            setWordHint(hint || "");
            setWordOptions([]);
            setWinnerId(null);
            setMessage("Game Started!");
        };

        const onNextTurn = ({ drawerId, wordLength, hint }) => {
            setDrawerId(drawerId);
            setClearTrigger((prev) => prev + 1);
            setWordLength(wordLength || 0);
            setWordHint(hint || "");
            setWordOptions([]);
            setWinnerId(null);
            setMessage("Next Turn Started");
        };

        const onGameOver = ({ winnerId, scores }) => {
            setDrawerId(null);
            setGameStarted(false);
            setClearTrigger((prev) => prev + 1);
            setWordOptions([]);
            setWinnerId(winnerId || null);
            setMessage("🏆 Game Over!");
            if (scores) {
                setScores(scores);
            }
        };

        const onCorrectGuess = ({ playerId, playerName, word, scores }) => {
            setScores(scores);
            setWinnerId(playerId || null);
            setMessage(`🎉 ${playerName || "Someone"} guessed correctly! Word was "${word}"`);
        };

        const onPlayers = (payload) => {
            if (!payload) return;

            const roomPlayers = payload.players || [];
            setPlayers(roomPlayers);
            setIsHost(payload.hostId === socket.id);
        };

        const onChooseWord = ({ words }) => {
            setWordOptions(words || []);
        };

        const onChat = (message) => {
            if (!message) return;

            setChatMessages((prev) => [...prev, message].slice(-20));
        };

        socket.on("connect", onConnect);
        socket.on("choose_word", onChooseWord);
        socket.on("game_started", onGameStarted);
        socket.on("next_turn", onNextTurn);
        const onRoundEnded = ({ word, scores }) => {
            setScores(scores);
            setMessage(`⏰ Round ended! Word was "${word}"`);
        };

        socket.on("game_over", onGameOver);
        socket.on("correct_guess", onCorrectGuess);
        socket.on("round_ended", onRoundEnded);
        socket.on("room_players", onPlayers);
        socket.on("chat_message", onChat);

        // cleanup function
        return () => {
            socket.off("connect", onConnect);
            socket.off("choose_word", onChooseWord);
            socket.off("game_started", onGameStarted);
            socket.off("next_turn", onNextTurn);
            socket.off("game_over", onGameOver);
            socket.off("correct_guess", onCorrectGuess);
            socket.off("round_ended", onRoundEnded);
            socket.off("room_players", onPlayers);
            socket.off("chat_message", onChat);
        };
    }, []);

    return {
        myId,
        drawerId,
        scores,
        joinRoom,
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
        setWordOptions,
        isHost,
        chatMessages,
    };
};
