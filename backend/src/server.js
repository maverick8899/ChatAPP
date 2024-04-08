const app = require('./app');
const { PORT } = process.env;

const server = app.listen(PORT, function () {
    console.log('Listening on port:'.cyan, `${PORT}`.cyan.bold);
});

console.log('socket', process.env.ALLOWED_ORIGINS);
//? watching log throw out in browser to add into allowedOrigins list
// const allowedOrigins = ['http://wsl.local:3000'];
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
const io = require('socket.io')(server, {
    pingTimeout: 60000, // sau 60p ko interact thì ngắt kết nối
    cors: {
        origin: allowedOrigins,
        // methods: ['GET', 'POST'],
        // credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('Connected to socket.io');
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User Joined Room: '.yellow + room);
    });
    socket.on('typing', (room) => socket.to(room).emit('typing'));
    socket.on('stop typing', (room) => socket.to(room).emit('stop typing'));

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit('message received', newMessageReceived);
        });
    });

    // // Hủy đăng ký lắng nghe 'setup' khi người dùng ngắt kết nối
    // socket.on('disconnect', () => {
    //     console.log('USER DISCONNECTED');
    //     socket.leave(userData._id);
    // });
});
