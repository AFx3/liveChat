const users = [];

// l'utente si connette
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// utente attivo in chat
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// utente abbandona la chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// utenti attivi nella stanza
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
