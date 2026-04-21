# 🎨 Scribble Game

A simple skribbl.io-style multiplayer drawing game built with React, Node.js, Express, and Socket.IO.

Players join the same room, one player draws a word, and the others guess it in real time. Correct guesses give points, and the highest score wins.

---

## Live Demo

You can try the live version of the game here:

- [Frontend (Play Now)](https://pratyush-skribbl-clone.vercel.app)
- [Backend API](https://pratyush-skribbl-clone.onrender.com)
- [GitHub Repository](https://github.com/pratyushranjn/skribbl-clone)

---

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Realtime: Socket.IO
- Drawing: HTML5 Canvas

## Main Features

- Join a room with a room code
- Turn-based drawing and guessing
- Real-time canvas sync
- Word choice for the drawer
- Scoreboard and winner display
- Undo, clear, and color picker tools
- Basic room settings for rounds and word count
- Host-only game start

## How to Run Locally

### Backend

```bash
cd server
npm install
node index.js
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside `server`:

```env
CLIENT_URL=http://localhost:5173
```

Create a `.env` file inside `client` only if you want to change the API URL:

```env
VITE_BASE_URL=http://localhost:5000
```

## How It Works

- The frontend sends drawing points through Socket.IO.
- The server checks who is allowed to draw.
- The server compares guesses with the current word.
- Scores are updated on the server and sent to all players.
- The leaderboard shows the current score and the winner.
