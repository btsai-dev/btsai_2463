let serialPDM;
let portName = "COM5";

function setup() {
  serialPDM = new PDMSerial(portName);
  sensor = serialPDM.sensorData;

  createCanvas(800, 600);
}

function draw() {
  // Constrain values between 0 and 1023 to 0 and 255
  background([sensor.a0, sensor.a0, sensor.a0]);
}

function mouseClicked() {
  serialPDM.transmit("mouseClick");
  console.log("mouseClick")
}