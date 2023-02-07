// Board
let board
let boardWidth = 750
let boardHeight = 250
let c

// Player
let playerWidth = 88
let playerHeight = 94
let playerX = 50
let playerY = boardHeight - playerHeight 
let playerImg

let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
}

// Obstacles
let obstacleArray = []

let obstacle1Width = 34
let obstacle2Width = 69
let obstacle3Width = 102

let obstacleHeight = 70
let obstacleX = 700
let obstacleY = boardHeight - obstacleHeight

let obstacle1Img
let obstacle2Img
let obstacle3Img

// Physics
let velocityX = -8
let velocityY = 0
let gravity = .4

let gameOver = false
let score = 0


// Loading the game
window.onload = function() {
    board = document.getElementById("board")
    board.height = boardHeight
    board.width = boardWidth

    c = board.getContext("2d"); // used for drawing on the board

    // draw initial player object
    // c.fillStyle="green"
    // c.fillRect(player.x, player.y, player.width, player.height)

    // Load Player
    playerImg = new Image()
    playerImg.src = "./img/dino.png"

    playerImg.onload = function() {
        c.drawImage(playerImg, player.x, player.y, player.width, player.height)
    }

    // Load Obstacles
    obstacle1Img = new Image()
    obstacle1Img.src = "./img/cactus1.png"

    obstacle2Img = new Image()
    obstacle2Img.src = "./img/cactus2.png"

    obstacle3Img = new Image()
    obstacle3Img.src = "./img/cactus3.png"

    requestAnimationFrame(update)
    setInterval(placeObstacle, 1000); // 1000ms = 1s
    document.addEventListener("keydown", movePlayer)
}


// Drawing the game's frames
function update() {
    requestAnimationFrame(update)

    if(gameOver){
        return;
    }

    // Reset Canvas
    c.clearRect(0, 0, board.width, board.height)

    // Player
    velocityY += gravity
    player.y = Math.min(player.y + velocityY, playerY) // apply gravity to current player Y
    c.drawImage(playerImg, player.x, player.y, player.width, player.height)

    // Obstacles
    for (let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i]
        obstacle.x += velocityX
        c.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height)

        if (detectCollision(player, obstacle)) {
            gameOver = true;
            playerImg.src = "./img/dino-dead.png"
            playerImg.onload = function() {
                context.drawImage(playerImg, player.x, player.y, player.width, player.height)
            }
        }
    }

    // Score
    c.fillStyle="black";
    c.font="20px Monogram"
    score++
    c.fillText(score, 5, 20)

    // Create Running Animation
    if (score % 5 === 0) {
        playerImg.src = "./img/dino-run1.png"
    } else {
        playerImg.src = "./img/dino-run2.png"
    }
}

// Player Jump
function movePlayer(e) {

    if ((e.code == "Space" || e.code == "ArrowUp") && player.y == playerY) {
        // jump
        velocityY = -10
    }
}

// Place Obstacle
function placeObstacle() {
    
    let obstacle = {
        img: null,
        x: obstacleX,
        y: obstacleY,
        width: null,
        height: obstacleHeight
    }

    let placeObstacleChance = Math.random()

    if (placeObstacleChance > .90) {
        obstacle.img = obstacle3Img
        obstacle.width = obstacle3Width
        obstacleArray.push(obstacle)
    } else if (placeObstacleChance > .70) {
        obstacle.img = obstacle2Img
        obstacle.width = obstacle2Width
        obstacleArray.push(obstacle)
    } else if (placeObstacleChance > .50) {
        obstacle.img = obstacle1Img
        obstacle.width = obstacle1Width
        obstacleArray.push(obstacle)
    }

    if (obstacleArray.length > 5) {
        obstacleArray.shift() // remove the first element from the array
    }

}

// Collision Detection
function detectCollision(a, b) {
    return a.x < b.x + b.width &&   // a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   // a's top right corner passes b's top left corner 
           a.y < b.y + b.height &&  // a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y     // a's bottom left corner passes b's top left corner
}
