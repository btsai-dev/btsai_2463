// Brian Tsai
let bitcrusher_knob;
let reverb_knob;
let octave_knob;

let bitcrusher_label;
let reverb_label;
let octave_label;

let notes = {
  'a': 'C',
  's': 'D',
  'd': 'E',
  'f': 'F',
  'g': 'G',
  'h': 'A',
  'j': 'B',
}

let octaves = ['0', '1','2','3','4','5','6','7','8']

let octave_level = '4';

const membrane = new Tone.MembraneSynth({
  "frequency" : 45,
  "envelope"  : {
    "attack"  : 0.001,
    "decay"   : 0.4,
    "release" : 0.2
  },
  "harmonicity" :8.5,
  "modulationIndex" : 40,
  "resonance" : 0.2,
  "octaves" : 1.5
});

let reverb, bitcrusher;

function preload(){
  reverb = new Tone.JCReverb(0.4);
  bitcrusher = new Tone.BitCrusher(12);
}

function setup() {
  createCanvas(0, 0);
  membrane.release = 0.2;
  membrane.resonance = 0.2;

  membrane.connect(reverb);
  reverb.connect(bitcrusher);
  bitcrusher.toDestination();

  octave_label = document.getElementById("octave_label");
  octave_label.innerHTML = octave_level;

  reverb_label = document.getElementById("reverb_label");
  reverb_label.innerHTML = parseFloat(0.2).toPrecision(3);

  bitcrusher_label = document.getElementById("bitcrusher_label");
  bitcrusher_label.innerHTML = parseFloat(12.0).toPrecision(3);

  reverb_knob = new Nexus.Dial('#reverb', {
    'size': [40, 40],
    'interaction': 'radial',
    'mode': 'relative',
    'min': 0,
    'max': 1,
    'step': 0.01,
    'value': 0.2
  });

  reverb_knob.on('change', (v)=>{
    reverb.roomSize.value = v;
    reverb_label.innerHTML = parseFloat(v).toPrecision(3);
  })

  octave_knob = new Nexus.Dial('#octave', {
    'size': [40, 40],
    'interaction': 'radial',
    'mode': 'relative',
    'min': 0,
    'max': 8,
    'step': 1,
    'value': 4
  });
  
  octave_knob.on('change', (v)=>{
    octave_level = octaves[v];
    octave_label.innerHTML = octave_level;
  })

  bitcrusher_knob = new Nexus.Dial('#bitcrusher', {
    'size': [40, 40],
    'interaction': 'radial',
    'mode': 'relative',
    'min': 1,
    'max': 16,
    'step': 0.01,
    'value': 12
  });

  bitcrusher_knob.on('change', (v)=>{
    bitcrusher.bits.value = v;
    bitcrusher_label.innerHTML = parseFloat(v).toPrecision(3)
  })
}

function draw() {
  background(220);
}

function keyPressed() {
  let toPlay = notes[key];
  if (toPlay){
    let note = toPlay.concat(octave_level);
    membrane.triggerAttackRelease(note, "8n");
  }
}