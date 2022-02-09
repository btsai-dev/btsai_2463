let male_character;
let female_character;
let other_character;

let male_spritesheet;
let female_spritesheet;
let other_spritesheet;


function preload() {
  male_spritesheet = loadImage("SpelunkyGuy.png");
  female_spritesheet = loadImage("SpelunkyGirl.png");
  other_spritesheet = loadImage("SpelunkyOther.png");
}

function setup() {
  createCanvas(1200, 600);
  imageMode(CENTER);

  let random_1x = int(random(100, 1100));
  let random_1y = int(random(100, 500));
  let random_2x = int(random(100, 1100));
  let random_2y = int(random(100, 500));
  let random_3x = int(random(100, 1100));
  let random_3y = int(random(100, 500));

  male_character = new Character(male_spritesheet, random_1x, random_1y)
  female_character = new Character(female_spritesheet, random_2x, random_2y)
  other_character = new Character(other_spritesheet, random_3x, random_3y)
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    male_character.go(1);
    female_character.go(1);
    other_character.go(1);
  }
  else if (keyCode == LEFT_ARROW) {
    male_character.go(-1);
    female_character.go(-1);
    other_character.go(-1);
  }
}

function keyReleased() {
  male_character.stop();
  female_character.stop();
  other_character.stop();
}

function draw() {
  background(255, 255, 255);
  male_character.draw();
  female_character.draw();
  other_character.draw();
}

class Character {
  constructor(spriteSheet, x, y) {
    this.spriteSheet = spriteSheet;
    this.sx = 0;
    this.x = x;
    this.y = y
    this.move = 0;
    this.face_dir = 1;
  }

  draw() {
    push();
    translate(this.x, this.y);
    scale (this.face_dir, 1);
    
    if (this.move == 0) {
      image(this.spriteSheet, 0, 0, 200, 200, 0, 0, 80, 80);
    }
    else {
      image(this.spriteSheet, 0, 0, 200, 200, 80 * (this.sx + 1), 0, 80, 80);
    }
    if (frameCount % 8 == 0) {
      this.sx = (this.sx + 1) % 8;
    }
    this.x += 2 * this.move;
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
}