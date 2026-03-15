const socket = io();

window.onload = function () {
    const stage = document.getElementById("stage");
    const ctx = stage.getContext("2d");
    const menu = document.getElementById("menu");
    const scoreContainer = document.getElementById("score-container");
    const score1Elem = document.getElementById("score1");
    const score2Elem = document.getElementById("score2");
    
    document.addEventListener("keydown", keyPush);

    let gameStarted = false;
    let gameMode = 'single'; // 'single' or 'coop'

    const vel = 1;
    let vx = 0, vy = 0;
    let vx2 = 0, vy2 = 0;

    let px = 10, py = 15;
    let px2 = 15, py2 = 20;

    const tp = 10;
    const qp = 60;
    
    let ax = Math.floor(Math.random() * qp);
    let ay = Math.floor(Math.random() * qp);

    let trail = [];
    let tail = 5;

    let trail2 = [];
    let tail2 = 5;

    document.getElementById("single").onclick = () => startGame('single');
    document.getElementById("coop").onclick = () => startGame('coop');

    function startGame(mode) {
        gameMode = mode;
        gameStarted = true;
        menu.style.display = "none";
        stage.style.display = "block";
        scoreContainer.style.display = "flex";
        
        if (mode === 'coop') {
            score2Elem.style.display = "block";
        } else {
            score2Elem.style.display = "none";
        }

        setInterval(game, 60);
    }

    socket.on("fs-share", function (data) {
        pushIO(data);
    });

    function game() {
        if (!gameStarted) return;

        // Player 1 movement
        px += vx;
        py += vy;

        if (px < 0) px = qp - 1;
        if (px > qp - 1) px = 0;
        if (py < 0) py = qp - 1;
        if (py > qp - 1) py = 0;

        // Player 2 movement (only in coop)
        if (gameMode === 'coop') {
            px2 += vx2;
            py2 += vy2;

            if (px2 < 0) px2 = qp - 1;
            if (px2 > qp - 1) px2 = 0;
            if (py2 < 0) py2 = qp - 1;
            if (py2 > qp - 1) py2 = 0;
        }

        // Draw Background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, stage.width, stage.height);

        // Draw Apple
        ctx.fillStyle = "red";
        ctx.fillRect(ax * tp, ay * tp, tp, tp);

        // Draw Player 1
        ctx.fillStyle = "rgb(143, 255, 106)";
        for (let i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * tp, trail[i].y * tp, tp - 1, tp - 1);
            if (trail[i].x === px && trail[i].y === py) {
                vx = vy = 0;
                tail = 5;
            }
        }
        trail.push({ x: px, y: py });
        while (trail.length > tail) {
            trail.shift();
        }

        if (ax === px && ay === py) {
            tail++;
            ax = Math.floor(Math.random() * qp);
            ay = Math.floor(Math.random() * qp);
        }

        // Draw Player 2 (only in coop)
        if (gameMode === 'coop') {
            ctx.fillStyle = "rgb(143, 255, 206)";
            for (let i = 0; i < trail2.length; i++) {
                ctx.fillRect(trail2[i].x * tp, trail2[i].y * tp, tp - 1, tp - 1);
                if (trail2[i].x === px2 && trail2[i].y === py2) {
                    vx2 = vy2 = 0;
                    tail2 = 5;
                }
            }
            trail2.push({ x: px2, y: py2 });
            while (trail2.length > tail2) {
                trail2.shift();
            }

            if (ax === px2 && ay === py2) {
                tail2++;
                ax = Math.floor(Math.random() * qp);
                ay = Math.floor(Math.random() * qp);
            }
        }

        // Update Scores
        score1Elem.innerText = `P1 Score: ${tail - 5}`;
        if (gameMode === 'coop') {
            score2Elem.innerText = `P2 Score: ${tail2 - 5}`;
        }
    }

    function pushIO(data) {
        console.log("Remote command: " + data);
        handleInput(data);
    }

    function handleInput(keyCode) {
        switch (keyCode) {
            case 65: // Left (P1)
                vx = -vel; vy = 0; break;
            case 87: // Up (P1)
                vx = 0; vy = -vel; break;
            case 68: // Right (P1)
                vx = vel; vy = 0; break;
            case 83: // Down (P1)
                vx = 0; vy = vel; break;
            case 74: // Left (P2)
                if (gameMode === 'coop') { vx2 = -vel; vy2 = 0; } break;
            case 73: // Up (P2)
                if (gameMode === 'coop') { vx2 = 0; vy2 = -vel; } break;
            case 76: // Right (P2)
                if (gameMode === 'coop') { vx2 = vel; vy2 = 0; } break;
            case 75: // Down (P2)
                if (gameMode === 'coop') { vx2 = 0; vy2 = vel; } break;
        }
    }

    function keyPush(event) {
        if (!gameStarted) return;
        console.log("Local key: " + event.keyCode);
        const keys = [65, 87, 68, 83, 74, 73, 76, 75];
        if (keys.includes(event.keyCode)) {
            socket.emit("comand", event.keyCode);
            handleInput(event.keyCode);
        }
    }
};
