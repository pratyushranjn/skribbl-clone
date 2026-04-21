require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const initSocket = require('./socket')

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://pratyush-skribbl-clone.vercel.app",
    ],
}))

const server = http.createServer(app);

initSocket(server); 

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is healthy' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});