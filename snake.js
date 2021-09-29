function drawCanvas() {

    var canvas = document.getElementById('canvas_id');

    var ctx;
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    }
    else {
        console.log('your browser does not support canvas!');
        return;
    }

    var direction = {
        xDir: 1,
        yDir: 0
    }

    var count = 1;

    var rectWidth = 20;
    var rectHeight = 20;

    var fps = 20;

    var lastKeyPressed = "ArrowRight";

    var snake = [];
    var head;

    function drawField() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawRect(x, y, width, height) {
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, width, height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "green";
        ctx.strokeRect(x, y, width, height);
    }

    function drawRectTail(x, y, width, height) {
        ctx.fillStyle = 'green';
        ctx.fillRect(x, y, width, height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.strokeRect(x, y, width, height);
    }

    function drawApple(x, y, width, height) {
        ctx.fillStyle = 'red';
        ctx.fillRect(x, y, width, height);
    }

    /* TODO: make it more generic! */

    var positionsX = [];
    for (var i = 0; i < canvas.width - 20; i += 20) {
        positionsX.push(i);
    }

    var positionsY = [];
    for (var i = 0; i < canvas.height - 20; i += 20) {
        positionsY.push(i);
    }

    function createSnake() {
        snake = [];
        for (var i = count; i > 0; i--) {
            var k = i * 20;
            snake.push({ x: k, y: 0 });
        }
    }

    function drawSnake() {
        drawRect(head.x, head.y, rectWidth, rectHeight);
        for (i = 1; i < snake.length; i++) {
            drawRectTail(snake[i].x, snake[i].y, rectWidth, rectHeight);
        }
    }

    function moveSnake() {
        var x = snake[0].x;
        var y = snake[0].y;

        if (direction.xDir === 1) {
            x += 20;
        }
        else if (direction.xDir === -1) {
            x -= 20;
        }
        else if (direction.yDir === 1) {
            y += 20;
        }
        else if (direction.yDir === -1) {
            y -= 20;
        }

        // removes the tail and makes it the new head
        var tail = snake.pop();
        tail.x = x;
        tail.y = y;
        snake.unshift(tail);
    }

    function gameOver() {
        alert("Game over!");
        drawField();
        count = 1;
        createSnake();
        drawSnake();
        apple = randomApple();
        drawApple(apple.posX, apple.posY, 20, 20);
        lastKeyPressed = "ArrowRight";
        direction = {
            xDir: 1,
            yDir: 0
        }
        document.getElementById("score").innerText = "Score: " + count;
    }

    function checkCollision() {
        // checking collisions with walls
        if (head.x < 0 || head.x > canvas.width - 20 || head.y < 0 || head.y > canvas.height - 20) {
            console.log("The wall!");
            gameOver();
        }
        // checking for collisions with snake's body
        for (i = 1; i < snake.length; i++) {
            if (head.x == snake[i].x && head.y == snake[i].y) {
                console.log("The Body!");
                gameOver();
            }
        }
    }

    document.addEventListener('keydown', (e) => {

        if (e.key === "ArrowUp" && lastKeyPressed !== "ArrowDown") {
            direction.xDir = 0;
            direction.yDir = -1;
            lastKeyPressed = e.key;
        }
        if (e.key === "ArrowDown" && lastKeyPressed !== "ArrowUp") {
            direction.xDir = 0;
            direction.yDir = 1;
            lastKeyPressed = e.key;
        }
        if (e.key === "ArrowLeft" && lastKeyPressed !== "ArrowRight") {
            direction.xDir = -1;
            direction.yDir = 0;
            lastKeyPressed = e.key;
        }
        if (e.key === "ArrowRight" && lastKeyPressed !== "ArrowLeft") {
            direction.xDir = 1;
            direction.yDir = 0;
            lastKeyPressed = e.key;
        }

    });

    function randomApple() {

        var randomPosX = positionsX[Math.floor(Math.random() * positionsX.length)];
        var randomPosY = positionsY[Math.floor(Math.random() * positionsY.length)];
        console.log(randomPosX, randomPosY);
        for (var i = 0; i < snake.length; ++i) {
            if (randomPosX === snake[i].x && randomPosY === snake[i].y) {
                randomApple();
            }
        }
        return {
            posX: randomPosX,
            posY: randomPosY
        }
    }

    function checkEat() {
        if (head.x === apple.posX && head.y === apple.posY) {
            snake.push({ x: head.x, y: head.y });
            count++;
            apple = randomApple();
            drawApple(apple.posX, apple.posY, rectWidth, rectHeight);
            document.getElementById("score").innerText = "Score: " + count;
        }
    }

    function beginGame(timestamp) {

        setTimeout(() => {

            head = snake[0];

            checkCollision();

            checkEat();

            // ctx.beginPath();
            drawField();
            drawSnake();
            moveSnake();

            drawApple(apple.posX, apple.posY, rectWidth, rectHeight);

            window.requestAnimationFrame(beginGame);

        }, 1000 / fps);

    }

    // ctx.beginPath();
    drawField();
    createSnake();
    var apple = randomApple();
    drawApple(apple.posX, apple.posY, rectWidth, rectHeight);
    window.requestAnimationFrame(beginGame);
}
