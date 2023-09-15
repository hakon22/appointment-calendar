require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const passport = require('passport');
const router = require('./src/api.js');
const { connectToDb } = require('./src/db/connect.js');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3001;

const buildPath = path.join(__dirname, 'frontend', 'build');

app.use(express.static(buildPath));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
require('./src/authentication/tokenChecker.js')(passport);
require('./src/authentication/refreshTokenChecker.js')(passport);
app.use(router);

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('soketAddNewDate', (data) => io.emit('soketAddNewDate', data));
  socket.on('soketChangeTime', (data) => io.emit('soketChangeTime', data));
  socket.on('soketAddNewTime', (data) => io.emit('soketAddNewTime', data));
  socket.on('soketRemoveTime', (data) => io.emit('soketRemoveTime', data));
  socket.on('soketRemoveDate', (data) => io.emit('soketRemoveDate', data));
  socket.on('soketRecording', (data) => io.emit('soketRecording', data));
  socket.on('soketRemoveRecord', (data) => io.emit('soketRemoveRecord', data));
  socket.on('soketRemoveRecordAdmin', (data) => io.emit('soketRemoveRecordAdmin', data));
  socket.on('soketRemoveDateAdmin', (data) => io.emit('soketRemoveDateAdmin', data));
});

server.listen(port, () => {
  console.log(`Server is online on port: ${port}`);
});

connectToDb();