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

io.on('connection', () => {
    console.log(`New WebSocket connection`);
  });

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

module.exports = server