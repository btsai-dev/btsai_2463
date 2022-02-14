let bugs = [];
let count = 10;
let hitbox = 100;
let score = 0;

function preload() {
  bug_spritesheet = loadImage("SpelunkyGuy.png");
}

function mouseClicked() {
  for (i = 0; i < count; i++) {
    bugs[i].kill();
  }
}

function mousePressed() {
  for (i = 0; i < count; i++) {
    bugs[i].squish();
  }
}

function mouseDragged() {
  for (i = 0; i < count; i++) {
    bugs[i].squish();
  }
}

function setup() {
  createCanvas(1200, 600);
  imageMode(CENTER);

  for (i=0; i<count; i++) {
    bugs[i] = new Bug(
      bug_spritesheet, 
      random(100, 1100), 
      random(100, 500), 
      5,
      random([-1, 1])
    )
  }
}

function draw() {
  background(200, 200, 200);
  for (i=0; i<count; i++) {
    bugs[i].draw();
  }
}

class Bug {
  constructor(spriteSheet, x, y, speed, move) {
    this.spriteSheet = spriteSheet;
    this.sx = 0;
    this.x = int(x);
    this.y = int(y);
    this.move = move;
    this.speed = speed;
    this.face_dir = move;
    this.dead = false;
    this.squished = false;
  }

  draw() {
    push();
    translate(this.x, this.y);
    scale (this.face_dir, 1);
    
    if (this.dead) {
      image(this.spriteSheet, 0, 0, hitbox, hitbox, 80*9, 0, 90, 80);
    }
    else if (this.squished) {
      image(this.spriteSheet, 0, 0, hitbox, hitbox, 80, 80, 80, 80);
    }
    else {
      image(this.spriteSheet, 0, 0, hitbox, hitbox, 80 * (this.sx + 1), 0, 80, 80);
    }
    if (frameCount % 8 == 0) {
      this.sx = (this.sx + 1) % 8;
    }
    this.x += this.speed * this.move;

    if (!this.squished && !this.dead)
    {
      if (this.x < hitbox/2-10) {
        this.move = 1;
        this.face_dir = 1;
      }
      else if (this.x > width-hitbox/2+10) {
        this.move = -1;
        this.face_dir = -1;
      }
    }
    pop();
  }

  go(direction) {
    this.move = direction;
    this.face_dir = direction;
    this.sx = 3;
  }

  stop() {
    this.move = 0;
  }

  squish() {
    if (!this.dead) {
      if (mouseX > this.x - hitbox/2-10 && mouseX < this.x + hitbox/2-10 && mouseY > this.y - hitbox/2-10 && mouseY < this.y + hitbox/2-10) {
        this.stop();
        this.squished = true;
      }
      else{
        this.go(this.face_dir);
        this.squished = false;
      }
    }
  }

  kill() {
    if (!this.dead) {
      if (mouseX > this.x - hitbox/2-10 && mouseX < this.x + hitbox/2-10 && mouseY > this.y - hitbox/2-10 && mouseY < this.y + hitbox/2-10) {
        this.stop();
        this.dead = true;
      }
    }
  }
}