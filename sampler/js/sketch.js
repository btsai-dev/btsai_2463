// Jesse Allison 2022

const sounds = new Tone.Players({
  'Air Raid': 'media/45933__torn-rugged-audio-35__air-raid-r.wav',
  'Smoke Alarm': 'media/170944__jan18101997__smoke-alarm-piep-piep.wav',
  'Censor Beep': 'media/460015__matrixxx__censor-beep.wav',
  'Alarm Clock': 'media/462455__shyguy014__alarm-clock-1.wav',
  'Touch Beep': 'media/550430__diicorp95__digital-button-touch.wav'
})

const distor = new Tone.Distortion(0);

let soundNames = [
  "Air Raid",
  "Smoke Alarm",
  "Censor Beep",
  "Alarm Clock",
  "Touch Beep"
]

let buttons = [];
let disto_slider;

let button_raid;
let button_smoke;
let button_censor;
let button_clock;
let button_touch;

let slider_label;

function setup() {
  createCanvas(1000, 400);
  sounds.connect(distor);
  distor.toDestination();

  disto_slider = createSlider(0., 1., 0, 0.01);
  disto_slider.position(500 - disto_slider.width/2, 300);
  disto_slider.mouseReleased( () => applyDistortion());

  soundNames.forEach((word, index) => {
    buttons[index] = createButton(word);
    buttons[index].position(index * 200 + 100 - buttons[index].width/2, 100);
    buttons[index].mousePressed( ()=>playSound(word));
  })

  textSize(20);
  textAlign(CENTER, CENTER);
}

function draw() {
  push();
  background(220);
  slider_label = text("Control Distortion [0, 1]", 500, 250);
  pop();
}

function applyDistortion() {
  distor.distortion = disto_slider.value();
  console.log(disto_slider.value());
}

function playSound(whichSound) {

  console.log(distor.distortion);
  sounds.player(whichSound).start(0, 0, 2);
}
