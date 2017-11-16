function Game(screenId) {
  var canvas = document.getElementById(screenId);
  var screen = canvas.getContext('2d');
  var gameSize = {x: canvas.width, y: canvas.height};
  var frameLength = 250;

  this.bodies = [new Snake(this, gameSize),new Apple(this, gameSize)];
  // this.snake = new Snake(this, gameSize);
  // this.apples = [new Apple(this, gameSize)];

  var self = this;
  var tick = function() {
    setInterval(function() {
    self.update();
    self.draw(screen, gameSize);
    }, frameLength);
  };

  tick();  
}

Game.prototype.update = function() {
  var bodies = this.bodies;
  for (var i = 0; i < this.bodies.length; i++) {
    this.bodies[i].update();
  };
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

function Snake(game, gameSize) {
  this.game = game;
  this.blocks = [];
  this.direction = 'up';
  this.head = {x: gameSize.x / 2, y: gameSize.y / 2};
  this.blocks.push(new SnakeBlock(game, this.head))
  this.keyboarder = new Keyboarder();
};

Snake.prototype.setDirection = function() {
  if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) && this.head.x > 15) {
    this.direction = 'left';
  } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) && this.head.x < 305) {
    this.direction = 'right';
  } else if (this.keyboarder.isDown(this.keyboarder.KEYS.UP) && this.head.y > 15) {
    this.direction = 'up';
  } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN) && this.head.y < 305) {
    this.direction = 'down';
  };
};

Snake.prototype.update = function() {
  this.setDirection();

   if (this.direction === 'left' && this.head.x > 15) {
    this.head = {x: this.head.x - 15, y: this.head.y}
    this.blocks.unshift(new SnakeBlock(this.game, this.head));
    this.blocks.pop();
  } else if (this.direction === 'right' && this.head.x < 305) {
    this.head = {x: this.head.x + 15, y: this.head.y}
    this.blocks.unshift(new SnakeBlock(this.game, this.head));
    this.blocks.pop();
  } else if (this.direction === 'up' && this.head.y > 15) {
    this.head = {x: this.head.x, y: this.head.y - 15}
    this.blocks.unshift(new SnakeBlock(this.game, this.head));
    this.blocks.pop();
  } else if (this.direction === 'down' && this.head.y < 305) {
    this.head = {x: this.head.x, y: this.head.y + 15}
    this.blocks.unshift(new SnakeBlock(this.game, this.head));
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



window.onload = function() {
  new Game('screen');
};