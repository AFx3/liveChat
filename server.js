const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const adapter = require('./controller-adapter').adaptExpress
const { testController } = require("./controller")
const makeRequestHandler = (httpController) => {
    return (req, res) => {
        try {
            const httpRequest = adapter(req);
            const response = httpController(httpRequest)
            res.status(response.code).json(response.result);
        } catch (err) {
            res.status(500).json({
                error: err
            });
        }
    }
}




// imposto static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'BOT:';

// connessione del client
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Messaggio di benvenuto
    socket.emit('message', formatMessage(botName, 'Welcome to W S C H A T!'));

    // Broadcast utente entrato in stanza
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} joined the room `)
      );

    // Invio informazioni di utente e stanza
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen della chat
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // client si disconnette
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} left the room`)
      );

      // info utenti e stanze
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;


console.log(testController);
app.get('/', makeRequestHandler(testController))



server.listen(PORT, () => console.log(`Server in esecuzione, porta: ${PORT}`));
