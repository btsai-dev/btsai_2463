let bugs = [];
let count = 4;
let hitbox = 100;
let score = 0;
let speed = 5;
let time = 30;
let game_ended = false;

function preload() {
  bug_spritesheet = loadImage("Bug.png");
}

function mouseReleased() {
  for (i = 0; i < count; i++) {
    bugs[i].kill();
  }
}

function mousePressed() {
  for (i = 0; i < count; i++) {
    bugs[i].squish_press();
  }
}

function mouseDragged() {
  for (i = 0; i < count; i++) {
    bugs[i].squish_drag();
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
      random([-1, 1])
    )
  }
}

function draw() {
  background(200, 200, 200);
  if (!game_ended) {
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Time left: " + time, width/2, 50);
    text("Score: " + score, width/2, height-50);
    for (i=0; i<count; i++) {
      bugs[i].draw();
    }
    if (frameCount % 60 == 0 && time > 0)
    {
      time --;
    }
    if (time == 0){
      game_ended = true;
    }
  }
    
  else {
    fill('black');
    rect(width/2-300, height/2-200, 600, 400);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Game Over! Total score: " + score, width/2, height/2)
  }

}

class Bug {
  constructor(spriteSheet, x, y, move) {
    this.spriteSheet = spriteSheet;
    this.sx = 0;
    this.x = int(x);
    this.y = int(y);
    this.move = move;
    this.face_dir = move;
    this.dead = false;
    this.squished = false;
    this.viewable = true;
    this.timeOfDeath = 0;
  }

  draw() {
    push();
    translate(this.x, this.y);
    scale (this.face_dir, 1);
    
    if (this.dead) {
      if (this.viewable) {
        image(this.spriteSheet, 0, 0, hitbox, hitbox, 80, 80, 90, 80);
      }
      if (frameCount - this.timeOfDeath > 60){
        this.viewable = false;
      }
    }
    else if (this.squished) {
      image(this.spriteSheet, 0, 0, hitbox, hitbox, 0, 80, 80, 80);
    }
    else {
      image(this.spriteSheet, 0, 0, hitbox, hitbox, 80 * (this.sx + 1), 0, 80, 80);
    }
    if (frameCount % 8 == 0) {
      this.sx = (this.sx + 1) % 6;
    }
    this.x += speed * this.move;

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

  squish_press() {
    if (!this.dead && !this.squished) {
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

  squish_drag() {
    if (!this.dead && this.squished) {
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
    if (!this.dead && this.squished) {
      if (mouseX > this.x - hitbox/2-10 && mouseX < this.x + hitbox/2-10 && mouseY > this.y - hitbox/2-10 && mouseY < this.y + hitbox/2-10) {
        this.stop();
        this.dead = true;
        speed += 2;
        score += 1;
        this.timeOfDeath = frameCount;
        bugs.push(new Bug(
          bug_spritesheet, 
          random(100, 1100), 
          random(100, 500), 
          random([-1, 1])
        ))
        count += 1;
      }
    }
  }
}