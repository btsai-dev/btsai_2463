/*
 * Programmer - Brian Tsai
 * Assignment - Controller
 * Demo URL - 
 */

#include "PDMSerial.h"

PDMSerial pdm;

const int Click_pin = 2;
const int X_pin = 0;
const int Y_pin = 1;

const int ledPin = 4;

int scaledXmap;
int scaledYmap;

int round10(int in) {
 static signed char round10delta[10] = {0, -1, -2, -3, -4, 5, 4, 3, 2, 1};  // Round to nearest 10th value difference
 return in + round10delta[in%10];
}

void setup() {
  pinMode(Click_pin, INPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(Click_pin, HIGH);
  digitalWrite(ledPin, LOW);
  Serial.begin(9600);
}

void loop() {
  int clickdata = digitalRead(Click_pin);
  int xData = analogRead(X_pin);
  scaledXmap = map(round10(map(xData, 0, 1023, 0, 100)), 0, 100, -100, 100);
  int yData = analogRead(Y_pin);
  scaledYmap = map(round10(map(yData, 0, 1023, 0, 100)), 0, 100, -100, 100);
  /*
  Serial.print("X: ");
  Serial.print(scaledXmap);
  Serial.print(" Y: ");
  Serial.print(scaledYmap);
  Serial.print("  Click: ");
  Serial.println(clickdata);
  */

  pdm.transmitSensor("click", clickdata);
  pdm.transmitSensor("xData", scaledXmap);
  pdm.transmitSensor("yData", scaledYmap);
  pdm.transmitSensor("end");

  boolean serialData = pdm.checkSerial();
  if (serialData) {
    if (pdm.getName().equals(String("bug_kill"))) {
      digitalWrite(ledPin, HIGH);
      delay(10);
      digitalWrite(ledPin, LOW);
    }
  }
}
