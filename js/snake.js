const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  parent: 'snake-game',
  backgroundColor: '#000000',
  pixelArt: true,
  scene: {
    preload,
    create,
    update
  }
};

new Phaser.Game(config);

let snake = [];
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let food;
let gridSize = 16;
let moveTime = 0;
let moveDelay = 100;
let score = 0;
let scoreText;

function preload() {}

function create() {
  // حدود
  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
  const border = 4;
  this.add.rectangle(160, border / 2, 320, border, colors[0]);
  this.add.rectangle(160, 240 - border / 2, 320, border, colors[1]);
  this.add.rectangle(border / 2, 120, border, 240, colors[2]);
  this.add.rectangle(320 - border / 2, 120, border, 240, colors[3]);

  // الثعبان
  snake = [
    createSegment.call(this, 10, 7),
    createSegment.call(this, 9, 7),
    createSegment.call(this, 8, 7)
  ];

  // الطعام
  food = this.add.rectangle(0, 0, gridSize, gridSize, 0xff0000).setOrigin(0);
  placeFood();

  // التحكم
  this.input.keyboard.on('keydown', (event) => {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') nextDirection = 'UP';
    else if (event.key === 'ArrowDown' && direction !== 'UP') nextDirection = 'DOWN';
    else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') nextDirection = 'LEFT';
    else if (event.key === 'ArrowRight' && direction !== 'LEFT') nextDirection = 'RIGHT';
  });

  // عداد
  score = 0;
  scoreText = this.add.text(10, 10, 'النقاط: 0', {
    fontFamily: 'Press Start 2P',
    fontSize: '8px',
    fill: '#ffffff'
  }).setDepth(2);
}

function update(time) {
  if (time >= moveTime) {
    moveTime = time + moveDelay;
    moveSnake.call(this);
  }
}

function createSegment(x, y) {
  const rect = this.add.rectangle(x * gridSize, y * gridSize, gridSize, gridSize, 0x00ff00).setOrigin(0);
  return { x, y, rect };
}

function moveSnake() {
  direction = nextDirection;
  const head = { ...snake[0] }; // clone

  if (direction === 'LEFT') head.x--;
  else if (direction === 'RIGHT') head.x++;
  else if (direction === 'UP') head.y--;
  else if (direction === 'DOWN') head.y++;

  // حدود
  if (head.x < 0 || head.x >= 320 / gridSize || head.y < 0 || head.y >= 240 / gridSize) {
    return this.scene.restart();
  }

  // تصادم مع نفسه
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return this.scene.restart();
    }
  }

  // تحريك
  const tail = snake.pop();
  tail.x = head.x;
  tail.y = head.y;
  tail.rect.setPosition(head.x * gridSize, head.y * gridSize);
  snake.unshift(tail);

  // أكل
  const foodX = food.x / gridSize;
  const foodY = food.y / gridSize;

  if (head.x === foodX && head.y === foodY) {
    const newSegment = createSegment.call(this, foodX, foodY);
    snake.push(newSegment);
    score += 1;
    scoreText.setText('النقاط: ' + score);
    placeFood();
  }
}

function placeFood() {
  const maxX = Math.floor(320 / gridSize);
  const maxY = Math.floor(240 / gridSize);
  let x, y, conflict;

  do {
    x = Phaser.Math.Between(0, maxX - 1);
    y = Phaser.Math.Between(0, maxY - 1);
    conflict = snake.some(seg => seg.x === x && seg.y === y);
  } while (conflict);

  food.setPosition(x * gridSize, y * gridSize);
}
