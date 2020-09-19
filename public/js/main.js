const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// prendo il nickname e la stanza dall'URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// partecipazione alla room
socket.emit('joinRoom', { username, room });

// Get stanza e utenti
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// messaggio dal server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // gestisco lo scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// invio messaggio
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // prendo il messaggio
  let msg = e.target.elements.msg.value;
  
  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // messaggio al server
  socket.emit('chatMessage', msg);

  // cancello l'input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// messaggio di output al dom
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// aggiungo nome della stanza
function outputRoomName(room) {
  roomName.innerText = room;
}

// aggiungo utente
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }
