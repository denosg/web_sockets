const express = require('express');
const path = require('path')
const http = require('http')
const appRoute = require('./routers/app_router')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

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

    socket.on('join', ({ username, room }) => {
        socket.join(room)

        socket.emit('message', generateMessage(message))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`)) //send to everyone, but that connection
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.to('cacat').emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage("A user has left"))
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