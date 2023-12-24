const socket = io()

socket.on('message', (message) => {
    console.log(message);
})

function sendMessage() {
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('sendMessage', message)
        messageInput.value = '';
    }
}

const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');

chatForm.addEventListener('submit', function (event) {
    event.preventDefault();
    sendMessage()
});

const sendMessageButton = document.getElementById('sendMessage');
sendMessageButton.addEventListener('click', function () {
    sendMessage()
});

function sendPosition(position) {
    socket.emit('sendLocation', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    })
}

const sendLocation = document.getElementById('sendLocation')
sendLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not suported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        sendPosition(position)
    })
})

// socket.on('countUpdated', (count) => {
//     console.log(`The count has been updated. Count: ${count}`);
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log(`click`);
//     socket.emit('increment')
// })