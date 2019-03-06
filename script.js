// *************************************
//        BALL CLASS
// *************************************

class Ball {
  constructor(x, y, radius = 10) { // defines a parameter var with a default value
    this.x = x;
    this.y = y;
    this.dx = 2;
    this.dy = -2;
    this.radius = radius;
  }

  reset() {
    this.dx = 5;
    this.dy = -5;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'lightblue';
    ctx.fill();
    ctx.closePath();
  }
}

// *************************************
//        BRICK CLASS
// *************************************

class Brick {
  constructor(x, y, color = 'pink') {
    this.x = x;
    this.y = y;
    this.status = 1;
    this.color = color;
    this.brickWidth = 75;
    this.brickHeight = 20;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.brickWidth, this.brickHeight);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

// *************************************
//         BRICKS CLASS
// *************************************

class Bricks {
  constructor() {
    this.brickRowCount = 5;
    this.brickColumnCount = 3;
    this.brickWidth = 75;
    this.brickHeight = 20;
    this.brickPadding = 10;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 30;
    this.bricks = [];
    this.createBricks();
  }

  createBricks() {
    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRowCount; r++) {
        const x = (c * (75 + this.brickPadding)) + this.brickOffsetLeft;
        const y = (r * (20 + this.brickPadding)) + this.brickOffsetTop;
        this.bricks[c][r] = new Brick(x, y);
      }
    }
  }

  render(ctx) {
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        if (this.bricks[c][r].status === 1) {
          this.bricks[c][r].render(ctx);
        }
      }
    }
  }
}

// *************************************
//        PADDLE CLASS
// *************************************

class Paddle {
  constructor( x, y, color = 'purple') {
    this.x = x;
    this.y = y;
    this.color = color;
    this.paddleHeight = 10;
    this.paddleWidth = 75;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

// *************************************
//        SCORE CLASS
// *************************************

class Score {
  constructor(score = 0) {
    this.score = score;
  }

  render(ctx) {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 8, 20);
  }
}

// *************************************
//        LIVES CLASS
// *************************************

class Lives {
  constructor(color = 'grey', font = '16px Arial') {
    this.x = 0;
    this.y = 0;
    this.color = color;
    this.lives = 3;
    this.font = font;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`Lives: ${lives}`, this.x, this.y);
  }
}

// *************************************
//      GAME CLASS
// *************************************

class Game {
  constructor() {
    // stores a reference to the <canvas> element to the canvas variable
    this.canvas = document.getElementById('myCanvas');
    // created ctx variable to store the 2D rendering content (the actual too used to paint on the canvas)
    this.ctx = canvas.getContext('2d');
    this.ball = new Ball(canvas.width / 2, canvas.height - 30);
    this.paddle = new Paddle(this.canvas.width / 2, this.canvas.height - 10);
    this.bricks = new Bricks();
    this.lives = new Life(this.canvas.width - 75);
    this.score = new Score();
    this.rightPressed = false;
    this.leftPressed = false;
    this.handlers();
  }
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.collisionDectection();
    this.drawBall();
    this.drawPaddle();
    this.drawBricks();
    this.drawScore();
    this.drawLife();
    this.paddleMove();
    this.playGame();
    requestAnimationFrame(this.draw.bind(this));
  }

  drawBall() {
    this.ball.render(this.ctx);
    this.ball.move();
  }

  drawBricks() {
    this.bricks.render(this.ctx);
  }

  drawLife() {
    this.lives.render(this.ctx);
  }

  drawPaddle() {
    this.paddle.render(this.ctx);
  }

  drawScore() {
    this.score.render(this.ctx);
  }

  paddleMove() {
    if (this.rightPressed && this.paddle.x < this.canvas.width - this.paddle.width) {
      this.paddle.x += 7;
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.x -= 7;
    }
  }

  collisionDectection() {
    for (let c = 0; c < this.bricks.brickColumnCount; c += 1) {
      for (let r = 0; r < this.bricks.brickRowCount; r += 1) {
        const b = this.bricks.bricks[c][r];
        if (b.status === 1) {
          if (this.ball.x > b.x && this.ball.x < b.x + b.width
              && this.ball.y > b.y && this.ball.y < b.y + b.height) {
            this.ball.dy = -this.ball.dy;
            b.status = 0;
            this.score.score += 1;
            if (this.score.score === this.bricks.brickRowCount * this.bricks.brickColumnCount) {
              // eslint-disable-next-line no-alert
              alert('You win! Congratulations!');
              document.location.reload();
            }
          }
        }
      }
    }
  }

  keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }

  mouseMoveHandler(e) {
    const relativeX = e.clientX - this.canvas.offsetLeft;
    if (relativeX > 0 && relativeX < this.canvas.width) {
      this.paddle.x = relativeX - this.paddle.width / 2;
    }
  }

  playGame() {
    if (this.ball.x + this.ball.dx > this.canvas.width - this.ball.radius
      || this.ball.x + this.ball.dx < this.ball.radius) {
      this.ball.dx = -this.ball.dx;
    }
    if (this.ball.y + this.ball.dy < this.ball.radius) {
      this.ball.dy = -this.ball.dy;
    } else if (this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius) {
      if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
        this.ball.dy = -this.ball.dy;
      } else {
        this.lives.lives -= 1;
        if (!this.lives.lives) {
          alert('GAME OVER');
          document.location.reload();
        } else {
          this.ball.x = this.canvas.width / 2;
          this.ball.y = this.canvas.height - 30;
          this.ball.reset();
          this.paddle.x = (this.canvas.width - this.paddle.width) / 2;
        }
      }
    }
  }

  handlers() {
    document.addEventListener('keydown', (e) => {
      this.keyDownHandler(e);
    }, false);

    document.addEventListener('keyup', (e) => {
      this.keyUpHandler(e);
    }, false);

    document.addEventListener('mousemove', (e) => {
      this.mouseMoveHandler(e);
    }, false);
  }
}

const game = new Game();
game.draw();







