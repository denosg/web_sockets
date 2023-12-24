const socket = io()

socket.on('countUpdated', (count) => {
    console.log(`The count has been updated. Count: ${count}`);
})

document.querySelector('#increment').addEventListener('click', () => {
    console.log(`click`);
    socket.emit('increment')
})