const express = require('express');
const path = require('path')
const http = require('http')
const appRoute = require('./routers/app_router')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { getUser, getUsersInRoom, removeUser, addUser } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, '../public')

//Routes
app.use(express.static(publicDirPath))
app.use('/', appRoute);

// server (emit) -> client (receive) - countUpdated
// client (emit) -> server (receive) - increment

const message = "welcome!"

io.on('connection', (socket) => {
    console.log(`New WebSocket connection`);

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({
            id: socket.id,
            username, room
        })
        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', message))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`)) //send to everyone, but that connection

        const userList = getUsersInRoom(user.room)
        io.to(user.room).emit('roomData', { userList, room: user.room })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        const user = getUser(socket.id)

        // if (filter.isProfane(message)) {
        //     return callback('Profanity is not allowed')
        // }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))

            const userList = getUsersInRoom(user.room)
            io.to(user.room).emit('roomData', {
                userList,
                room: user.room
            })
        }
    })

    // socket.emit('countUpdated', count)
    // socket.on('increment', () => {
    //     count++
    //     // socket.emit('countUpdated', count) // for one person
    //     io.emit('countUpdated', count) // for everyone
    // })
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

module.exports = server