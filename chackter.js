/*=================================
=            Variables            =
=================================*/

/* main character variabes */
var mario, bricks, clouds, mountains, enemyMushrooms, pipes, platforms, coins;


var control = {
    up: "UP_ARROW",
    left: 'LEFT_ARROW',
    right: 'RIGHT_ARROW',
    revive: 32
}

var gameConfig = {


    status: "start",

    initialLifes: 4,


    moveSpeed: 5,
    enemyMoveSpeed: 1,

    gravity: 1,
    gravityEnemy: 10,
    jump: -15,

    startingPointX: 500,
    startingPointY: 0,


    screenX: 1240,
    screenY: 336,


    timeScores: 0,
    scores: 0
}



noseX = "";
noseY = "";
GameStatus = "";

function game() {

    console.log("noseX = " + noseX + " ,noseY =  " + noseY);

    instializeInDraw();
    moveEnvironment(mario);
    drawSprites();

    if (gameConfig.status === 'start') {

        fill(0, 0, 0, 150);
        rect(0, 0, gameConfig.screenX, gameConfig.screenY);

        fill(255, 255, 255);
        textSize(40);
        textAlign(CENTER);
        text("Press Play Button To Start The Game ", gameConfig.screenX / 2, gameConfig.screenY / 2);
        textSize(40);

        stroke(255);
        strokeWeight(7);
        noFill();

        changeGameStatud();
    }

    if (gameConfig.status === 'play') {
        positionOfCharacter(mario);
        enemys(enemyMushrooms);
        checkStatus(mario);
        scores(mario);
        manualControl(mario);

    }

    // if game is over 
    if (gameConfig.status === 'gameover') {

        fill(0, 0, 0, 150);
        rect(0, 0, gameConfig.screenX, gameConfig.screenY);

        fill(255, 255, 255);
        textSize(40);
        textAlign(CENTER);
        text("GAME OVER", gameConfig.screenX / 2, gameConfig.screenY / 2 + 105);
        textSize(15);
        text("Press SPACE to Restart", gameConfig.screenX / 2, gameConfig.screenY / 2 + 135);
        textSize(40);
        text(round(gameConfig.scores), gameConfig.screenX / 2, gameConfig.screenY / 2 - 35);
        text("points", gameConfig.screenX / 2, gameConfig.screenY / 2);

        stroke(255);
        strokeWeight(7);
        noFill();
        ellipse(gameConfig.screenX / 2, gameConfig.screenY / 2 - 30, 160, 160)
        changeGameStatud(mario)
    }
}

function startGame() {
    GameStatus = "start";
    document.getElementById("status").innerHTML = "Game Is Loading";
}

// change game status if any key is pressed
function changeGameStatud(character) {
    if (noseX != "" && gameConfig.status === "start" && GameStatus == "start") {
        document.getElementById("status").innerHTML = "Game Is Loaded";
        world_start.play();
        initializeCharacterStatus(mario)
        gameConfig.status = "play"
    }
    if (gameConfig.status === "gameover" && keyDown(control.revive)) {
        gameConfig.status = "start"
    }
}

//initialize
function instializeInSetup(character) {
    frameRate(120);

    character.scale = 0.35;
    initializeCharacterStatus(character)

    bricks.displace(bricks);
    platforms.displace(platforms);
    coins.displace(coins);
    coins.displace(platforms);
    coins.collide(pipes);
    coins.displace(bricks);

    // change the scale of clouds
    clouds.forEach(function(element) {
        element.scale = random(1, 2);
    })
}

function initializeCharacterStatus(character) {
    // set up the initial config of character  
    character.scale = 0.35;
    character["killing"] = 0; //while is killing enemy
    character["kills"] = 0;
    character["live"] = true;
    character["liveNumber"] = gameConfig.initialLifes;
    character["status"] = 'live';
    character["coins"] = 0;
    character["dying"] = 0;
    character.position.x = gameConfig.startingPointX;
    character.position.y = gameConfig.startingPointY;
}

function instializeInDraw() {
    background(109, 143, 252);

    //while killing
    if (mario.killing > 0) {
        mario.killing -= 1;
    } else {
        mario.killing = 0;
    }

    // make objects not overlap each other.
    pipes.displace(pipes);
    enemyMushrooms.displace(enemyMushrooms);
    enemyMushrooms.collide(pipes);
    clouds.displace(clouds);

    // make character not overlap other objects
    if (mario.live) {
        bricks.displace(mario);
        pipes.displace(mario);
        enemyMushrooms.displace(mario);
        platforms.displace(mario);
    }

    // character config initialize
    mario["standOnObj"] = false;
    mario.velocity.x = 0;
    mario.maxSpeed = 20;