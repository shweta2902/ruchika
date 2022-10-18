var cloud1, cloud2, cloud, cloudsGroup
var ground, groundImg;
var mario, marioAni;
var obstacle1, obstacle2, obstaclesGroup;
var coinImage, coinGroup, coin;
var bullet, bulletImg, bulletGroup;
var start, startImg;

var jumpSound, dieSound, bgSound, coinSound, shootSound;

var score = 0;
var gameState = 0;
var lives = 3;
var slide = 1;

 function preload() {


  jumpSound = loadSound("sounds/jump.mp3");
 // bgSound = loadSound("sounds/mario.mp3");
  dieSound = loadSound("sounds/die.mp3");
  coinSound = loadSound("sounds/coin.mp3");
  cloud1 = loadImage("assets/cloud1.png")
  cloud2 = loadImage("assets/cloud2.png")
  obstacle1 = loadImage("assets/obstacle1.png")
  obstacle2 = loadImage("assets/obstacle2.png")
  groundImg = loadImage("assets/ground.png")
  coinImage = loadImage("assets/coin.png");
  bulletImg = loadImage("assets/bullet.png");
  startImg = loadImage("assets/start.png");
  
  //shootSound = loadSound("assets/sounds/shoot.mp3");


  marioAni = loadAnimation("assets/mario/mario1.png", "assets/mario/mario2.png", "assets/mario/mario3.png", "assets/mario/mario4.png", "assets/mario/mario5.png", "assets/mario/mario6.png", "assets/mario/mario7.png", "assets/mario/mario8.png", "assets/mario/mario9.png", "assets/mario/mario10.png", "assets/mario/mario11.png", "assets/mario/mario12.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight)
  ground = createSprite(width / 2, height - 100, width, 60)
  ground.addImage(groundImg);

  mario = createSprite(100, height - 300);
  mario.addAnimation("running", marioAni);
  mario.scale = 0.25;
  mario.visible = false;

  start = createSprite(width / 2 + 50, height / 2 - 50);
  start.addImage(startImg);
  start.scale = 0.6;
  start.visible = false;

  cloudsGroup = new Group();
  coinGroup = new Group();
  obstaclesGroup = new Group()
  bulletGroup = new Group()
   //bgSound.play();
   //bgSound.loop();
  // bgSound.setVolume(0.5)
}

function draw() {
  background("#5a8ff3");
  textSize(40);
  fill("white");
  stroke("black");
  strokeWeight(2)
  if (gameState === 0) {

    text("Press Space to continue", width / 2 - 175, height / 2 + 100)
    if (slide == 1) {

      text("Welcome To The World of Mario!!!!!!!!", width / 2 - 300, height / 2 - 200)


    }
    if (slide == 2) {

      text("Kill the Monsters and Collect the Coins", width / 2 - 300, height / 2 - 200)
    }
    if (slide == 3) {

      text("Press t to shoot and space to jump", width / 2 - 300, height / 2 - 200);
      start.visible = true;
      if (mousePressedOver(start)) {
        gameState = 1;
        slide = 0;
        start.visible = false;
        mario.visible = true;
      }
    }

  }

  if (gameState == 1) {
    ground.velocityX = -3;
    if (ground.x < width / 3 + 120) {
      ground.x = width / 2;
    }
    if (keyDown("space") && mario.y > height / 2) {
      mario.velocityY = -15;
      jumpSound.play();
    }
    mario.velocityY += 0.8;

    for (var i = 0; i < coinGroup.length; i++) {
      if (coinGroup.get(i).isTouching(mario)) {
        coinSound.play();
        coinGroup.get(i).destroy();
        score++;
      }
    }
    if (keyDown("t")) {
      throwBullet();
    }
    for (var i = 0; i < bulletGroup.length; i++) {
      for (var j = 0; j < obstaclesGroup.length; j++) {
        if (bulletGroup.get(i).isTouching(obstaclesGroup.get(j))) {
          bulletGroup.get(i).destroy();
          obstaclesGroup.get(j).destroy();
          score += 2;
        }
      }
    }
    for (var j = 0; j < obstaclesGroup.length; j++) {
      if (obstaclesGroup.get(j).isTouching(mario)) {

        obstaclesGroup.get(j).destroy();

        lifeOver();
        dieSound.play();
      }
    }


    spawnClouds();
    spawnObstacle1();
    spawnCoins();
    mario.collide(ground);

  }
  if (gameState === 2) {

    textSize(40);
    fill("white");
    stroke("black");
    strokeWeight(2)
    text("GAME OVER!!!!!!", width / 2 - 175, height / 2 + 100)

    mario.velocityY = 0;
    mario.destroy();

    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);

    coinGroup.setVelocityXEach(0);
    coinGroup.setLifetimeEach(-1);

    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);

    ground.velocityX = 0;
  }
  if (gameState === 4) {
    text("Press r to continue", width / 2 - 175, height / 2 + 100)
  }

  drawSprites();

  textSize(40);
  fill("white");
  stroke("black");
  strokeWeight(2)
  text("Coins: " + score, width - 300, 100);
  text("Lives: " + lives, width - 300, 150);

}


function spawnClouds() {
  if (frameCount % 120 === 0) {
    cloud = createSprite(width, 100)
    cloud.y = Math.round(random(50, 300))
    var x = Math.round(random(0, 1))
    if (x == 0) {
      cloud.addImage(cloud1)
    }
    else {
      cloud.addImage(cloud2)
    }
    cloud.scale = 0.5
    cloud.velocityX = -3
    cloud.lifetime = 800
    mario.depth = cloud.depth + 1
    cloudsGroup.add(cloud)
  }
}


function spawnObstacle1() {
  if (frameCount % (Math.round(random(120, 250))) === 0) {
    obstacle = createSprite(width, height - 260);

    obstacle.addImage(obstacle1)
    obstacle.scale = 0.2
    obstacle.velocityX = -3
    obstacle.lifetime = 800

    obstaclesGroup.add(obstacle)
  }
}



function throwBullet() {
  bullet = createSprite(70, 240, 10, 40);
  bullet.addImage(bulletImg);
  bullet.rotation = -30;
  bullet.scale = 0.1;
  bullet.velocityY = 1;
  bullet.x = mario.x;
  bullet.y = mario.y;
  bullet.velocityX = 6;
  bullet.lifetime = 80;
  bulletGroup.add(bullet);
}


function spawnCoins() {
  if (frameCount % (Math.round(random(50, 250))) === 0) {

    coin = createSprite(width, height - 400, 50, 50)
    coin.addAnimation("coin", coinImage);
    coin.y = Math.round(random(height - 600, height - 200));
    coin.scale = 0.1;
    coin.velocityX = -(3 + score * 1.9 / 100);
    coin.lifetime = 800;
    coinGroup.add(coin);



  }



}

function keyReleased() {
  if (gameState === 0 && slide < 3) {
    if (keyDown("space")) {
      slide++;
    }
  }

  if (keyDown("r") && gameState == 4) {

    gameState = 1;
    obstaclesGroup.destroyEach();
    coinGroup.destroyEach();
    cloudsGroup.destroyEach();
  }
}

function lifeOver() {
  lives--;
  if (lives <= 0) {
    gameState = 2;
  }
  else {
    gameState = 4;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setVelocityXEach(0);
    coinGroup.setLifetimeEach(-1);
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    ground.velocityX = 0;
    textSize(40);
    fill("white");
    stroke("black");
    strokeWeight(2);
   
  }
}
