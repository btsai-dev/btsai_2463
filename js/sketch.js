let bugs = [];
let count = 4;
let hitbox = 100;
let score = 0;
let speed = 5;
let time = 30;
let game_ended = false;

let serialPDM;
let portName = "COM5";

let _cursor;
let canvas_WMAX = 1200
let canvas_HMAX = 600

let melodyPlaybackRate = 1;

const sounds = new Tone.Players({
  'smack': 'media/smack.wav',
  'squish': 'media/squish.wav',
  'skitter': 'media/skitter.wav'
})

const mainChords = [
  {time: 0, note: ["D4", "E4", "F4"]},
  {time: "0:0.5", note: ["D4", "E4", "F4"]},
  {time: "0:1", note: ["G4", "B4", "D4"]}, 
  {time: "0:2", note: ["F4", "A4", "C4"]}, 
  {time: "0:3", note: ["E4", "G3", "B4"]}, 
];

const endChords = [
  {time: 0, note: ["D2", "E2", "F2"]},
  {time: "0:0.5", note: ["D2", "E2", "F2"]},
  {time: "0:1", note: ["G2", "B2", "D2"]}, 
  {time: "0:2", note: ["F2", "A2", "C2"]}, 
  {time: "0:3", note: ["E2", "G1", "B2"]}, 
];

let synthChord;
let endChord;
let chordInstrument;
let endInstrument;
let mainMelodyPart;
let endMelodyPart;

let _mouseX = 300;
let _mouseY = 150;

// Setup preloading and the music
function preload() {
  bug_spritesheet = loadImage("media/Bug.png");

  // Setup music for general playing
  chordInstrument = new Tone.PolySynth(Tone.Synth)
  synthChord = {
    volume: -3,
    oscillator : {
      type : "triangle"
    }
  };
  chordInstrument.set(synthChord);
  chordInstrument.connect(Tone.Destination);

  mainMelodyPart = new Tone.Part(
    (time, chord) => {
      chordInstrument.triggerAttackRelease(chord.note, "8n", time);
    }, mainChords);

  mainMelodyPart.loop = true;
  mainMelodyPart.playbackRate = melodyPlaybackRate;
  mainMelodyPart.probability = 1;

  mainMelodyPart.start();

  // Setup music for end screen
  endInstrument = new Tone.PolySynth(Tone.Synth);
  endChord = {
    volume: 20,
    oscillator : {
      type : "sawtooth"
    }
  };
  endInstrument.set(endChord);
  endInstrument.connect(Tone.Destination);

  endMelodyPart = new Tone.Part(
    (time, chord) => {
      chordInstrument.triggerAttackRelease(chord.note, "8n", time);
    }, endChords);

  endMelodyPart.loop = true;
  endMelodyPart.playbackRate = 2;
  endMelodyPart.probability = 1;

  // Start up everything
  Tone.start();
  Tone.Transport.start();
}

// Check for kills on release
function _mouseReleased() {
  for (i = 0; i < count; i++) {
    bugs[i].kill();
  }
}

// Check for squishes on press
function _mousePressed() {
  for (i = 0; i < count; i++) {
    bugs[i].squish_press();
  }
  sounds.player("smack").start();
}

// Check for any dragging
function _mouseDragged() {
  for (i = 0; i < count; i++) {
    bugs[i].squish_drag();
  }
}

function setup() {
  serialPDM = new PDMSerial(portName);
  sensor = serialPDM.sensorData;

  createCanvas(canvas_WMAX, canvas_HMAX);
  imageMode(CENTER);

  sounds.connect(Tone.Destination);

  _cursor = new MouseCursor(
    null,
    300,
    150
  )

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
    // Process arduino info only if game is playing
    click_data = sensor.click;
    x_data = sensor.xData;
    y_data = sensor.yData;
    _cursor.xMove = sensor.xData;
    _cursor.yMove = sensor.yData;
    _cursor.status = sensor.click;
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Time left: " + time, width/2, 50);
    text("Score: " + score, width/2, height-50);
    for (i=0; i<count; i++) {
      bugs[i].draw();
    }
    _cursor.draw();
    if (frameCount % 60 == 0 && time > 0)
    {
      time --;
    }
    if (time == 0){
      game_ended = true;

      // This will be executed only once
      mainMelodyPart.stop();
      endMelodyPart.start();
      sounds.disconnect();
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

class MouseCursor {
  constructor(spriteSheet, x, y) {
    this.spriteSheet = spriteSheet;
    this.x = int(x);
    this.y = int(y);
    this.xMove = 0;
    this.yMove = 0;
    this.speed = 5;
    this.status = 1;  // If status = 1, then not pressed. 0 if pressed.
    this.prior_status = 1;  // Prior status, check if release
  }

  draw() {
    push();
    //translate(this.x, this.y);
    circle(this.x, this.y, 10);
    // If mouse is unpressed and you're justing moving
    if (this.status == 1)
    {
      // Check if prior status was pressed
      if (this.prior_status == 0)
      {
        // Execute a release
        _mouseReleased();
      }
      else{
        let futureX = this.x + int(this.xMove / 20 * 1);
        let futureY = this.y + int(this.yMove / 20 * 1)
        // make sure not out of bounds
        if (futureX >= 0 && futureX <= width)
          this.x = futureX;
        if (futureY >= 0 && futureY <= height)
          this.y = futureY
      }
    }
    // Check if mouse is pressed
    else if (this.status == 0) {
      // Check if cursor is still
      if (this.xMove == 0 && this.yMove == 0) {
        // Use mouse pressed only on first press:
        if (this.prior_status == 1){
          _mousePressed();
        }
      }
      else{
        if (this.prior_status == 1)
          _mouseDragged();
      }
    }
    //image(this.spriteSheet, 0, 0, hitbox, hitbox, 80, 80, 90, 80);
    pop();
    _mouseX = this.x;
    _mouseY = this.y;
    this.prior_status = this.status
    
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
      if (_mouseX > this.x - hitbox/2-10 && _mouseX < this.x + hitbox/2-10 && _mouseY > this.y - hitbox/2-10 && _mouseY < this.y + hitbox/2-10) {
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
      if (_mouseX > this.x - hitbox/2-10 && _mouseX < this.x + hitbox/2-10 && _mouseY > this.y - hitbox/2-10 && _mouseY < this.y + hitbox/2-10) {
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
      if (_mouseX > this.x - hitbox/2-10 && _mouseX < this.x + hitbox/2-10 && _mouseY > this.y - hitbox/2-10 && _mouseY < this.y + hitbox/2-10) {
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
        mainMelodyPart.playbackRate += 0.2;
        count += 1;
        serialPDM.transmit("bug_kill");
        try
        {
          sounds.player("squish").start(Tone.now(), 0.2);
          sounds.player("skitter").start(Tone.now()+1, 0.5);
        } catch(ex)
        {
          console.log("Minor Audio Error from simultaneous bug deaths.");
        }
      }
    }
  }
}