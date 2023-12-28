const socket = io()

// server (emit) -> client (receive) --acknowledgememnt --> server
// client (emit) -> server (receive) --acknowledgememnt --> client

// Elements
const $chatForm = document.getElementById('chatForm');
const $messageInput = document.getElementById('messageInput');
const $sendMessageButton = document.getElementById('sendMessage');
const $sendLocationButton = document.getElementById('sendLocation')
const $messages = document.getElementById("messages")
const $sidebar = document.getElementById("sidebar")

// Templates
const messageTemplate = document.getElementById("message-template").innerHTML
const locationLinkTemplate = document.getElementById("location-template").innerHTML
const sidebarTemplate = document.getElementById("sidebar-template").innerHTML

// Options
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

function formatDate(date) {
    return moment(date).format('h:mm a')
}

function insertMessage(message) {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        messageText: message.text,
        createdAt: formatDate(message.createdAt)
    })
    $messages.insertAdjacentHTML('beforeend', html)
}

function insertLocationLink(linkOjb) {
    const html = Mustache.render(locationLinkTemplate, {
        username: linkOjb.username,
        link: linkOjb.url,
        createdAt: formatDate(linkOjb.createdAt)
    })
    $messages.insertAdjacentHTML('beforeend', html)
}

function inserRoomAndList(room, userList) {
    const html = Mustache.render(sidebarTemplate, {
        userList,
        room
    })
    $sidebar.innerHTML = html
}

function autoScroll() {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessagesStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessagesStyles.marginBottom)
    const newMessageHeight = $newMessage.clientHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message);
    insertMessage(message)
    autoScroll()
})

socket.on('locationMessage', (locMessage) => {
    console.log(locMessage);
    insertLocationLink(locMessage)
    autoScroll()
})

socket.on('roomData', ({ room, userList }) => {
    console.log(`room: ${room}`);
    console.log(`userList: ${userList}`);
    inserRoomAndList(room, userList)
})

function disableButton(button) {
    button.disabled = true
}

function enableButton(button) {
    button.disabled = false
}

function sendMessage() {
    const message = $messageInput.value;
    if (message.trim() !== '') {
        socket.emit('sendMessage', message, (error) => {
            if (error) {
                return console.log(error);
            }
            console.log(`The message was delivered.`);
        })
        $messageInput.value = '';
    }
}

$chatForm.addEventListener('submit', function (event) {
    event.preventDefault();
    sendMessage()
});

$sendMessageButton.addEventListener('click', function () {
    sendMessage()
});

function sendPosition(position) {
    socket.emit('sendLocation', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }, () => {
        console.log('Location shared !');
    })
    enableButton($sendLocationButton)
}

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not suported by your browser.')
    }
    disableButton($sendLocationButton)

    navigator.geolocation.getCurrentPosition((position) => {
        sendPosition(position)
    })
})

socket.emit('join', {
    username,
    room
}, (error) => {
    if (error) {
        location.href = '/'
        alert(error)
    }
})

// socket.on('countUpdated', (count) => {
//     console.log(`The count has been updated. Count: ${count}`);
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log(`click`);
//     socket.emit('increment')
// })