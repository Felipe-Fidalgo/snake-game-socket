const socket = io();

document.addEventListener("keydown", keyPush);

function keyPush(event) {
    let keyCode;
    if (event.keyCode) {
        keyCode = event.keyCode;
    } else {
        keyCode = event; // button click
    }

    const validKeys = [65, 87, 68, 83];
    if (validKeys.includes(keyCode)) {
        socket.emit("fs-share", keyCode);
        console.log("Sent command: " + keyCode);
    }
}
