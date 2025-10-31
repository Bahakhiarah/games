const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  parent: 'runner-game',
  backgroundColor: '#000000',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

new Phaser.Game(config);

let player;
let cursors;
let obstacles;
let ground;
let gameSpeed = 200;
let jumpAllowed = true;

// 🧮 عداد النقاط
let score = 0;
let scoreText;

function preload() {
  // يمكن تحميل الخط أو الصوت هنا إن رغبت
}

function create() {
  // الأرض
  ground = this.add.rectangle(160, 230, 320, 20, 0x444444);
  this.physics.add.existing(ground, true);

  // اللاعب
  player = this.add.rectangle(40, 200, 16, 16, 0x00ff00);
  this.physics.add.existing(player);
  player.body.setCollideWorldBounds(true);

  this.physics.add.collider(player, ground);

  // التحكم
  cursors = this.input.keyboard.createCursorKeys();
  this.input.keyboard.on('keydown-SPACE', jump, this);
  this.input.on('pointerdown', jump, this);

  // العقبات
  obstacles = this.physics.add.group();
  this.physics.add.collider(obstacles, ground);
  this.physics.add.overlap(player, obstacles, hitObstacle, null, this);

  this.time.addEvent({
    delay: 1500,
    callback: spawnObstacle,
    callbackScope: this,
    loop: true
  });

  // 🧾 إنشاء عداد النقاط
  score = 0;
  scoreText = this.add.text(10, 10, 'النقاط: 0', {
    fontFamily: 'Press Start 2P',
    fontSize: '8px',
    fill: '#ffffff'
  }).setScrollFactor(0);
}

function update() {
  obstacles.children.iterate(obstacle => {
    if (obstacle) {
      obstacle.x -= 2;

      // ✅ عد النقاط عندما يتجاوز اللاعب العقبة
      if (obstacle.x + 16 < player.x && !obstacle.passed) {
        obstacle.passed = true;
        score += 1;
        scoreText.setText('النقاط: ' + score);
      }

      if (obstacle.x < -20) {
        obstacle.destroy();
      }
    }
  });
}

function jump() {
  if (player.body.touching.down && jumpAllowed) {
    player.body.setVelocityY(-300);
    jumpAllowed = false;
    setTimeout(() => jumpAllowed = true, 500);
  }
}

function spawnObstacle() {
  const obs = this.add.rectangle(340, 210, 16, 16, 0xff0000);
  this.physics.add.existing(obs);
  obs.body.setImmovable(true);
  obs.body.setVelocityX(-gameSpeed);
  obstacles.add(obs);
}

function hitObstacle() {
  this.scene.restart();
}
