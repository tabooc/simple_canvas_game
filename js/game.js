/**
 * canvas 简单小游戏 - 猎捕小恶魔
 */
class Game {
  constructor() {
    this.ctx = null;
    this.canvas = null;
    this.bgReady = false;
    this.bgImage = null;
    this.heroReady = false;
    this.heroImage = null;
    this.monsterReady = false;
    this.monsterImage = null;
    // Game objects
    this.hero = {
      speed: 256, // movement in pixels per second
      width: 32,
      height: 32
    };
    this.monster = {
      width: 30,
      height: 32
    };
    this.monstersCaught = 0;
    // Handle keyboard controls
    this.keysDown = {};
    this.then = Date.now();
    this.fps = 0;
    this.status = 0;
  }

  init() {
    this.createStage();
    // Background image
    this.loadImg("bg", "images/background.png");
    // Hero image
    this.loadImg("hero", "images/hero.png");
    // Monster image
    this.loadImg("monster", "images/monster.png");
    this.initEvent();
    this.reset();
    this.run();
  }

  createStage() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 512;
    this.canvas.height = 480;
    document.body.appendChild(this.canvas);
  }

  loadImg(name, src) {
    this[`${name}Ready`] = false;
    this[`${name}Image`] = new Image();
    this[`${name}Image`].onload = () => {
      this[`${name}Ready`] = true;
    };
    this[`${name}Image`].src = src;
  }

  initEvent() {
    window.addEventListener(
      "keydown",
      (e) => {
        this.keysDown[e.key] = true;
        this.status = 2;
      },
      false
    );

    window.addEventListener(
      "keyup",
      (e) => {
        this.keysDown[e.key] = false;
        this.status = 3;
      },
      false
    );
  }

  // Reset the game when the player catches a monster
  reset() {
    this.hero.x = this.canvas.width / 2;
    this.hero.y = this.canvas.height / 2;
    // Throw the monster somewhere on the screen randomly
    this.renderMonster();
  }

  // Update game objects
  update(modifier) {
    // Player holding up
    if (this.keysDown.ArrowUp || this.keysDown.w) {
      this.hero.y -= this.hero.speed * modifier;
    }
    // Player holding down
    if (this.keysDown.ArrowDown || this.keysDown.s) {
      this.hero.y += this.hero.speed * modifier;
    }
    // Player holding left
    if (this.keysDown.ArrowLeft || this.keysDown.a) {
      this.hero.x -= this.hero.speed * modifier;
    }
    // Player holding right
    if (this.keysDown.ArrowRight || this.keysDown.d) {
      this.hero.x += this.hero.speed * modifier;
    }

    this.hero.x = this.hero.x < 0 ? 0 : this.hero.x;
    this.hero.x = this.hero.x > this.canvas.width - this.hero.width ? this.canvas.width - this.hero.width : this.hero.x;
    this.hero.y = this.hero.y < 0 ? 0 : this.hero.y;
    this.hero.y = this.hero.y > this.canvas.height - this.hero.height ? this.canvas.height - this.hero.height : this.hero.y;

    console.log(this.hero.x, this.hero.y);

    // Are they touching?
    if (this.collide()) {
      ++this.monstersCaught;
      this.renderMonster();
    }
  }

  collide() {
    if (this.hero.x <= this.monster.x + 32 && this.monster.x <= this.hero.x + 32 && this.hero.y <= this.monster.y + 32 && this.monster.y <= this.hero.y + 32) {
      return true;
    } else {
      return false;
    }
  }

  // Draw everything
  render() {
    if (this.bgReady) {
      this.ctx.drawImage(this.bgImage, 0, 0);
    }

    if (this.heroReady) {
      this.ctx.drawImage(this.heroImage, this.hero.x, this.hero.y);
    }

    if (this.monsterReady) {
      this.ctx.drawImage(this.monsterImage, this.monster.x, this.monster.y);
    }

    // Score
    this.ctx.fillStyle = "rgba(250, 250, 250, 1)";
    this.ctx.font = "16px sans-serif";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("捕猎数: " + this.monstersCaught, 32, 34);

    // fps
    this.ctx.fillStyle = "rgba(250, 255, 255, 1)";
    this.ctx.font = "12px sans-serif";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("fps: " + this.fps.toFixed(0), 440, 38);
  }

  // Throw the monster somewhere on the screen randomly
  renderMonster() {
    this.monster.x = 32 + Math.random() * (this.canvas.width - 64);
    this.monster.y = 32 + Math.random() * (this.canvas.height - 64);
  }

  // The main game loop
  run() {
    let now = Date.now();
    let delta = now - this.then;

    this.fps = 1 / (delta / 1000);

    if (!this.status) {
      this.status = 1;
      setTimeout(() => {
        this.update(delta / 1200);
        this.render();
      }, 500);
    }

    if (this.status == 2) {
      this.update(delta / 1200);
      this.render();
    }

    this.then = now;

    // Request to do this again ASAP
    window.requestAnimationFrame(() => this.run());
  }
}

let game = new Game();
game.init();
