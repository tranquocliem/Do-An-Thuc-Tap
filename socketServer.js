let users = [];

const SocketServer = (socket) => {
  // Connect - DisConnect
  socket.on("joinUser", (id) => {
    users.push({ id, socketId: socket.id });
  });
  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
  });

  //Heart
  socket.on("heartPost", (post) => {
    const ids = [...post.writer.followers, post.writer._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("heartPostToClient", post._id);
      });
    }
  });
  socket.on("unHeartPost", (post) => {
    const ids = [...post.writer.followers, post.writer._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("unHeartPostToClient", post._id);
      });
    }
  });

  //Comment
  socket.on("createComment", (post) => {
    const ids = [...post.writer.followers, post.writer._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("createCommentToClient", post._id);
      });
    }
  });
  socket.on("deleteComment", (post) => {
    const ids = [...post.writer.followers, post.writer._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("deleteCommentToClient", post._id);
      });
    }
  });

  // Reply Comment
  socket.on("createReplyComment", (post, reply) => {
    const ids = [...post.writer.followers, post.writer._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket
          .to(`${client.socketId}`)
          .emit("createReplyCommentToClient", post._id, reply);
      });
    }
  });

  // Follow
  socket.on("follow", (userId) => {
    const user = users.find((user) => user.id === userId);
    user && socket.to(`${user.socketId}`).emit("followToClient", userId);
  });
  socket.on("unFollow", (userId) => {
    const user = users.find((user) => user.id === userId);
    user && socket.to(`${user.socketId}`).emit("unFollowToClient", userId);
  });
};

module.exports = SocketServer;
