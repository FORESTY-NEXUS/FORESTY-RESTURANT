const socketIO = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    io = socketIO(server, {
      cors: {
        origin: '*', // Adjust this in production
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Users can join their own room
      socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      });

      // Role-based rooms (admin, delivery)
      socket.on('join_role', (role) => {
        socket.join(role);
        console.log(`User joined role room: ${role}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
