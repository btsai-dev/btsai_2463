let serialPDM;
let portName = "COM5";

let canvas_WMAX = 1000;
let canvas_HMAX = 500;

let score = 0;

/**
 * game_status values:
 * 0 - Game starter menu
 * 1 - Game in progress
 * 2 - Game ended
 */
let game_status = 0;

let missiles = [];
let nukes = [];

// Spritesheets for missiles and AA
let AA_spritesheet;
let missile_spritesheet;
let nuke_spritesheet;
let explosion_spritesheet;

let AA_truck;

let shoot_frame = 0;
let fire_time = 15;

let drop_frame = 0;
let drop_interval = 60;
let min_droprate = 40

// Increase rate every 10 seconds
let rate_increase_frame = 0;
let rate_delta = 5;
let drop_rate_increase_interval = 300;

let death_nuke_x;

// Game Start Menu music:
let startMenuMelody;
let gameMenuMelody;
let endMenuMelody;

let vol = new Tone.Volume(9).toDestination();
const startChords = [
  {time: "0:0.5", note: ["D6", "E6", "F6"]},
  {time: "0:1", note: ["G4", "B4", "D4"]}, 
  {time: "0:1.5", note: ["F6", "A6", "C6"]}, 
  {time: "0:2", note: ["F6", "A6", "C6"]}, 
  {time: "0:2.5", note: ["F6", "A6", "C6"]}, 
  {time: "0:3", note: ["E6", "G6", "B6"]}, 
  {time: "0:3.5", note: ["E6", "G6", "B6"]}, 
];

const gameChords = [
  {time: "0:0.5", note: ["C6", "E6", "G6"]},
  {time: "0:1", note: ["F6", "Ab6", "C6"]}, 
  {time: "0:1.5", note: ["Bb6", "D6", "F6"]}, 
  {time: "0:2", note: ["C6", "E6", "G6"]},
  {time: "0:2.5", note: ["C6", "E6", "G6"]},
  {time: "0:3", note: ["F6", "Ab6", "C6"]}, 
  {time: "0:3.5", note: ["Bb6", "D6", "F6"]}
]

const endChords = [
  {time: "0:0.5", note: ["C3", "E3", "G3"]},
  {time: "0:1", note: ["F3", "Ab3", "C3"]}, 
  {time: "0:1.5", note: ["Bb3", "D3", "F3"]}, 
  {time: "0:2", note: ["C3", "E3", "G3"]},
  {time: "0:2.5", note: ["C3", "E3", "G3"]},
  {time: "0:3", note: ["F3", "Ab3", "C3"]}, 
  {time: "0:3.5", note: ["Bb3", "D3", "F3"]}
]

const player = new Tone.Player("media/launch.wav").toDestination();


// Setup preloading and the music
function preload() {
  AA_spritesheet = loadImage("media/antiair.png");
  nuke_spritesheet = loadImage("media/nuke.png");
  missile_spritesheet = loadImage("media/missile.png");
  explosion_spritesheet = loadImage("media/nuclear.png");

  chordInstrument = new Tone.PolySynth(Tone.Synth)
  synthChord = {
    volume: -5,
    oscillator : {
      type : "sine"
    }
  };
  chordInstrument.set(synthChord);
  chordInstrument.connect(Tone.Destination);

  
  chordInstrumentHi = new Tone.PolySynth(Tone.Synth)
  synthChordHi = {
    oscillator : {
      type : "sine"
    }
  };
  chordInstrumentHi.set(synthChordHi);
  chordInstrumentHi.connect(Tone.Destination);

  startMenuMelody = new Tone.Part(
    (time, chord) => {
      chordInstrument.triggerAttackRelease(chord.note, "8n", time);
    }, startChords
  );
  startMenuMelody.loop = true;
  startMenuMelody.playbackRate = 1;
  startMenuMelody.probability = 1;

  gameMenuMelody = new Tone.Part(
    (time, chord) => {
      chordInstrument.triggerAttackRelease(chord.note, "8n", time);
    }, gameChords
  );
  gameMenuMelody.loop = true;
  gameMenuMelody.playbackRate = 1;
  gameMenuMelody.probability = 1;

  endMenuMelody = new Tone.Part(
    (time, chord) => {
      chordInstrumentHi.connect(vol);
      chordInstrumentHi.triggerAttackRelease(chord.note, "8n", time);
    }, endChords
  );
  endMenuMelody.loop = true;
  endMenuMelody.playbackRate = 1;
  endMenuMelody.probability = 1;


  Tone.start();
  Tone.Transport.start();
}

function setup() {
  serialPDM = new PDMSerial(portName);
  sensor = serialPDM.sensorData;
  frameRate(60);
  createCanvas(canvas_WMAX, canvas_HMAX);
  imageMode(CENTER);

  // Instantiate the AA defense truck
  AA_truck = new AA(
    canvas_WMAX/2,
    canvas_HMAX-70/2
  );

  // Start up the start menu melody
  if(game_status==0){   
    startMenuMelody.start();
    serialPDM.transmit("new_game");
  }
}

function draw() {
  // Draw the background
  background(200, 200, 200);

  buttonState = sensor.buttonState;
  x_data = sensor.xData;

  if (game_status == 0) {
    textSize(50);
    stroke(255, 204, 0);
    strokeWeight(4);
    textAlign(CENTER);

    text(
      "The bombs are falling!\nShoot down as many as you can!\nPress FIRE to start.",
      canvas_WMAX/2,
      canvas_HMAX/2
    )
    if(buttonState == 1){
      game_status = 1;
      startMenuMelody.stop();
      gameMenuMelody.start();
    }
  }
  else if (game_status == 1) {
    
  // Check inputs
    if(x_data < 0){
      AA_truck.go(-2);
    } else if(x_data > 0){
      AA_truck.go(2);
    }
    else{
      AA_truck.go(0);
    }
    if(buttonState == 1){
      AA_truck.shoot();
    }

    // Check rate
    if (frameCount - rate_increase_frame > drop_rate_increase_interval){
      rate_increase_frame = frameCount;
      drop_interval -= rate_delta;
      if (drop_interval < min_droprate){
        drop_interval = min_droprate;
      }
    }
    // Compute whether to make new bomb
    if (frameCount - drop_frame > drop_interval){
      drop_frame = frameCount;
      nukes.push(new Nuke(
        random(100, canvas_WMAX-100),
        -50
      ))
    }
    // Draw the AA truck
    AA_truck.draw();

    // Draw all missiles
    for(let i=missiles.length-1; i>=0; i--){
      if(missiles[i].draw()){
        missiles.splice(i, 1);
      }
    }

    // Draw all bombs
    for (let i=nukes.length-1; i>=0;i--){
      if(nukes[i].draw()){
        // Nuke hit the ground. Kaboom!
        death_nuke_x = nukes[i].x;
        nukes.splice(i, 1);
        game_status=2;
        console.log("Done.");
        serialPDM.transmit("death");
        
        gameMenuMelody.stop();
        endMenuMelody.start();
        return;
      }
    }

    // Check for missile + bomb collisions:
    for(let i=missiles.length-1; i>=0; i--){
      let missile = missiles[i];
      for(let j=nukes.length-1; j>=0; j--){
        let nuke = nukes[j];
        // Check if missile tip is at correct width position
        if(missile.x < nuke.x+nuke.hitwidth/4 && missile.x > nuke.x-nuke.hitwidth/4){
          // Check if missile tip is at correct height position
          if(missile.y-missile.hitheight/2 < nuke.y+nuke.hitheight/4){
            missiles.splice(i, 1);
            nukes.splice(j, 1);
            score++;
          }
        }
      }
    }
  }
  else{
    // Display frozen, and end screen

    // Draw the AA truck
    AA_truck.aaspeed = 0;
    AA_truck.draw();

    // Draw all bombs
    for (let i=nukes.length-1; i>=0;i--){
      nukes[i].nukespeed = 0;
      nukes[i].draw();
    }

    // Draw all missiles
    for (let i=missiles.length-1; i>=0;i--){
      missiles[i].travelspeed = 0;
      missiles[i].draw();
    }

    // Draw an explosion
    image(
      explosion_spritesheet,
      death_nuke_x,
      canvas_HMAX-150
    )
    
    textSize(100);
    stroke(255, 204, 0);
    strokeWeight(4);
    textAlign(CENTER);
    text(
      "GAME OVER\nSCORE: " + score,
      canvas_WMAX/2,
      canvas_HMAX/2
    )
  }
}

class AA {
  constructor(horizontal_pos, vertical_pos) {
    this.hitwidth = 100;
    this.hitheight = 70;

    this.aaspeed = 3;
    this.move = 0;

    this.x = horizontal_pos;
    this.y = vertical_pos;
  }

  draw(){
    push();
    translate(this.x, this.y);
    scale(1, 1);
    image(
      AA_spritesheet, 
      0,
      0,
      this.hitwidth, 
      this.hitheight,
      0,
      0
    );
    
    // If going to the left, check if hitting wall before moving
    let next_move = this.x + this.aaspeed * this.move;
    if(next_move > 0 && next_move < canvas_WMAX)
      this.x = next_move;
    pop();
  }

  go(direction){
    this.move = direction;
  }

  shoot(){
    if(frameCount - shoot_frame > fire_time){
      shoot_frame = frameCount;
      player.start();
      missiles.push(new Missile(
        this.x,
        this.y-this.hitheight/2
      ))
    }
  }
}

class Nuke {
  constructor(horizontal_pos, vertical_pos) {
    this.hitwidth = 100;
    this.hitheight = 100;

    this.nukespeed = 2;

    this.x = horizontal_pos;
    this.y = vertical_pos;
  }

  draw(){
    push();
    translate(this.x, this.y);
    scale(1, 1);
    image(
      nuke_spritesheet, 
      0,
      0,
      this.hitwidth, 
      this.hitheight,
      0,
      0
    );
    
    // Send nuke down
    this.y += this.nukespeed
    pop();
    
    
    // return true to detonate explosion
    if (this.y > canvas_HMAX){
      return true;
    }
    return false;
  }
}

class Missile {
  constructor(horizontal_pos, vertical_pos) {
    this.hitwidth = 30;
    this.hitheight = 40;

    this.x = horizontal_pos;
    this.y = vertical_pos;

    this.travelspeed = 10;
  }

  draw(){
    push();
    translate(this.x, this.y);
    scale(1, 1);
    image(
      missile_spritesheet, 
      0,
      0,
      this.hitwidth, 
      this.hitheight,
      0,
      0
    );
    
    // Send missile up
    this.y -= this.travelspeed
    pop();
    
    // return true to remove from list if out of frame
    if (this.y + this.hitheight < 0){
      return true;
    }
    return false;
  }
}