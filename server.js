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
app.use(require('prerender-node').set('prerenderToken', 'yWWDOT9Y3rf6ivKHY7tC'));
app.use(passport.initialize());
require('./src/authentication/tokenChecker.js')(passport);
require('./src/authentication/refreshTokenChecker.js')(passport);
app.use(router);

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

/* io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('addData', (article) => io.emit('addData', article));
  socket.on('removeData', (article) => io.emit('removeData', article));
}); */

server.listen(port, () => {
  console.log(`Server is online on port: ${port}`);
});

connectToDb();