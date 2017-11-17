function Game(screenId) {
  var canvas = document.getElementById(screenId);
  var screen = canvas.getContext('2d');
  var gameSize = {x: canvas.width, y: canvas.height};
  var frameLength = 250;
  this.game0ver = false;

  this.gameSize = gameSize;
  this.bodies = [new Snake(this, gameSize), new Apple(this, gameSize)];

  var self = this;
  this.tick = setInterval(function() {
    self.update();
    self.draw(screen, gameSize);
  }, frameLength);

}

Game.prototype.update = function() {
  var bodies = this.bodies
  var snakeBlocks = this.bodies[0].blocks
  var apple = this.bodies[1]

  function hitSelf(block) {
    for (var i=0; i<snakeBlocks.length; i++) {
      if (colliding(block, snakeBlocks[i])){
        return true;
      };
    };
  };

  for (var i=0; i<snakeBlocks.length; i++) {
    if (hitSelf(snakeBlocks[i])) {
      this.loseGame();
    }
    if (colliding(snakeBlocks[i], apple)) {
      this.bodies.pop();
      this.bodies.push(new Apple(this, this.gameSize));
      this.bodies[0].appleEaten = true;
    };
  };

  if (this.bodies[0].hitWall()) {
    this.loseGame();
  }

  for (var i = 0; i < this.bodies.length; i++) {
    this.bodies[i].update();
  };

  this.bodies[0].appleEaten = false;
};

Game.prototype.draw = function(screen, gameSize) {
  screen.clearRect(0, 0, gameSize.x, gameSize.y);

  this.bodies.forEach(function(body){
    if (body instanceof Snake) {
      body.blocks.forEach(function(block) {
        drawRect(screen, block)
       });
    } else {
      drawRect(screen, body)
    };
  });
};

Game.prototype.loseGame = function() {
  console.log('whoops!')
  alert('you lose')
  this.game0ver = true;
  clearInterval(this.tick)
}

function Snake(game, gameSize) {
  this.game = game;
  this.blocks = [];
  this.appleEaten = false;
  this.direction = 'up';
  this.head = {x: gameSize.x / 2, y: gameSize.y / 2};
  this.blocks.push(new SnakeBlock(game, this.head))
  this.keyboarder = new Keyboarder();
};

Snake.prototype.hitWall = function() {
  if ( this.head.x < 15 || this.head.x > 305 || this.head.y < 15 || this.head.y > 305) {
    return true;
  } 
}

Snake.prototype.setDirection = function() {
  if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) && this.direction !== 'right') {
    this.direction = 'left';
  } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT ) && this.direction !== 'left') {
    this.direction = 'right';
  } else if (this.keyboarder.isDown(this.keyboarder.KEYS.UP) && this.direction !== 'down') {
    this.direction = 'up';
  } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN) && this.direction !== 'up') {
    this.direction = 'down';
  };
};

Snake.prototype.update = function() {
  this.setDirection();

   if (this.direction === 'left' && this.head.x > 15) {
    this.head = {x: this.head.x - 15, y: this.head.y};
    this.slither();
  } else if (this.direction === 'right' && this.head.x < 305) {
    this.head = {x: this.head.x + 15, y: this.head.y};
    this.slither();
  } else if (this.direction === 'up' && this.head.y > 15) {
    this.head = {x: this.head.x, y: this.head.y - 15};
    this.slither();
  } else if (this.direction === 'down' && this.head.y < 305) {
    this.head = {x: this.head.x, y: this.head.y + 15};
    this.slither();
  };
};

Snake.prototype.slither = function() {
  this.blocks.unshift(new SnakeBlock(this.game, this.head));
    if (!this.appleEaten){
      this.blocks.pop();
    };
};

Snake.prototype.addBlock = function(block) {
  this.blocks.push(body);
};

function SnakeBlock(game, center) {
  this.game = game;
  this.size = {x: 15, y: 15};
  this.center = center;
};

function Apple(game, gameSize) {
  this.game = game;
  this.size = {x: 15, y: 15};
  this.center = { x: gameSize.x - (Math.random() * gameSize.x), y: gameSize.y -(Math.random() * gameSize.x) };
}

Apple.prototype.update = function() {

}

function Keyboarder() {
  var keyState = {};
  window.onkeydown = function(e) {
    keyState[e.keyCode] = true;
  };
  window.onkeyup = function(e) {
    keyState[e.keyCode] = false;
  };
  this.isDown = function(keyCode) {
    return keyState[keyCode] === true;
  };
  this.KEYS = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};
};

function drawRect(screen, body) {
  screen.fillRect(body.center.x - body.size.x / 2,
                    body.center.y - body.size.y / 2,
                    body.size.x, body.size.y);
};

function drawApple(screen, body) {
  screen.fillRect(body.center.x, body.center.y, body.size.x, body.size.y);
}

function colliding(b1, b2) {
  return !(b1 === b2 || 
            b1.center.x + b1.size.x / 2 <= b2.center.x - b2.size.x / 2 ||
            b1.center.y + b1.size.y / 2 <= b2.center.y - b2.size.y / 2 ||
            b1.center.x - b1.size.x / 2 >= b2.center.x + b2.size.x / 2 ||
            b1.center.y - b1.size.y / 2 >= b2.center.y + b2.size.y / 2 );
};

function gameOverAlert() {
  alert('game over');
}

window.onload = function() {
  new Game('screen');
};