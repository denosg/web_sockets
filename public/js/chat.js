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

// socket.on('countUpdated', (count) => {
//     console.log(`The count has been updated. Count: ${count}`);
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log(`click`);
//     socket.emit('increment')
// })