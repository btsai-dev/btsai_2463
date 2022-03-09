// Brian Tsai

let pressed, unpressed, alert;
let mono, oscillation, envelope, filter, lfo, noise;
let drawThis;
let backMusic;

let loop, backosc, backgain, backamp;
let s = "Press to Sound Alarm!";

// Preload images
function preload() {
  pressed = loadImage("media/pressed.png");
  unpressed = loadImage("media/unpressed.png");
  alert = loadImage("media/alert.jpg");
}

// Setup function
function setup() {
  createCanvas(800, 400);

  // Setup background noise
  backosc = new Tone.AMOscillator(1000, 'sine', 'sine').start()
  backgain = new Tone.Gain(-5).toDestination();
  backamp = new Tone.AmplitudeEnvelope({
    attack: 0.2,
    decay: 0.2,
    sustain: 0.8,
    release: 0.8
  }).connect(backgain);
  backosc.connect(backamp);

  // Setup alert synth
  mono = new Tone.MonoSynth({
    envelope: {
      attack: 0.1
    }
  }).toDestination();

  oscillation = new Tone.FMOscillator({
    type: "square",
    spread: "triangle",
    harmonicity: 0.2,
    modulationIndex: 3
  }).start();

  envelope = new Tone.Envelope({
    attack: 0.2,
    decay: 0.01,
    sustain: 1,
    release: 1
  });

  filter = new Tone.Filter(1500, "highpass");

  lfo = new Tone.LFO({
    min: 100,
    max: 170,
    frequency: '2n'
  });

  lfo.connect(filter.frequency);

  noise = new Tone.Noise("brown").connect(filter).start();

  gain = new Tone.Gain(-5).toDestination();;
  envelope.connect(gain.gain);
  filter.connect(gain);
  oscillation.connect(gain);

  // Setup background loop
  loop = new Tone.Loop((time)=>{
    backosc.frequency.value = 1000;
    backmusic();
  }, "1n").start(0);
  Tone.Transport.start();
  
  // Draw unpressed image
  image(unpressed, 0, 0)
}

// Paste text
function draw() {
  textSize(30);
  textAlign(CENTER, CENTER);
  text(s, 50, 45, 200, 200);
}

// Function to trigger background music, one loop
function backmusic(){
  backamp.triggerAttackRelease('2n');

  backosc.frequency.linearRampTo(600, "+1");
  backamp.triggerAttackRelease('2n', "+1");
}

// Play alarm on button press
function mousePressed(){
  image(pressed, 0, 0);
  image(alert, 320, 0);
  alarm();
}

// Hide everything on release
function mouseReleased() {  
  background("white");
  image(unpressed, 0, 0)
}

// Alarm audio trigger, three times
function alarm(){
  mono.triggerAttackRelease("C4", "8n");
  envelope.triggerAttackRelease('4n');
  envelope.triggerAttackRelease('4n', '+1');
  envelope.triggerAttackRelease('4n', '+2');
}

