const socket = io()

// server (emit) -> client (receive) --acknowledgememnt --> server
// client (emit) -> server (receive) --acknowledgememnt --> client

// Elements
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const sendLocationButton = document.getElementById('sendLocation')
const messages = document.getElementById("messages")

// Templates
const messageTemplate = document.getElementById("message-template").innerHTML

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message
    })
    messages.insertAdjacentHTML('beforeend', html)
})

function disableButton(button) {
    button.disabled = true
}

function enableButton(button) {
    button.disabled = false
}

function sendMessage() {
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('sendMessage', message, (error) => {
            if (error) {
                return console.log(error);
            }
            console.log(`The message was delivered.`);
        })
        messageInput.value = '';
    }
}

chatForm.addEventListener('submit', function (event) {
    event.preventDefault();
    sendMessage()
});

sendMessageButton.addEventListener('click', function () {
    sendMessage()
});

function sendPosition(position) {
    socket.emit('sendLocation', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }, () => {
        console.log('Location shared !');
    })
    enableButton(sendLocationButton)
}

sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not suported by your browser.')
    }
    disableButton(sendLocationButton)

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