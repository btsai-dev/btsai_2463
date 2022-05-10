/*
 * Programmer - Brian Tsai
 * Assignment - Final Project
 * Demo URL - https://youtu.be/U885wDuunWk
 */

#include "PDMSerial.h"

PDMSerial pdm;

const int X_pin = 0;
const int button_pin = 4;
const int led_pin = 2;

int scaledXmap;
int scaledYmap;

int round10(int in) {
 static signed char round10delta[10] = {0, -1, -2, -3, -4, 5, 4, 3, 2, 1};  // Round to nearest 10th value difference
 return in + round10delta[in%10];
}

void setup() {
  Serial.begin(9600);
  pinMode(led_pin, OUTPUT);
  pinMode(button_pin, INPUT);
  digitalWrite(led_pin, LOW);
  Serial.begin(9600);
}

void loop() {
  int xData = analogRead(X_pin);
  int buttonState = digitalRead(button_pin);
  scaledXmap = map(round10(map(xData, 0, 1023, 0, 100)), 0, 100, -100, 100);

  pdm.transmitSensor("buttonState", buttonState);
  pdm.transmitSensor("xData", scaledXmap);
  pdm.transmitSensor("end");

  boolean serialData = pdm.checkSerial();
  if (serialData) {
    if (pdm.getName().equals(String("new_game"))) {
      digitalWrite(led_pin, LOW);
    }
    if (pdm.getName().equals(String("death"))) {
      digitalWrite(led_pin, HIGH);
    }
  }
}
