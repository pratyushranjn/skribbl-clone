require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const initSocket = require('./socket')

const app = express();
app.use(cors({
    origin: "*"
}))

const server = http.createServer(app);

initSocket(server); 

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});