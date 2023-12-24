const express = require('express');
const path = require('path')
const http = require('http')
const appRoute = require('./routers/app_router')
const socketio = require('socket.io')

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

    socket.emit('message', message)

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
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