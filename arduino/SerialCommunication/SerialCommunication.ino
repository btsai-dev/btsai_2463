/*
 * Programmer - Brian Tsai
 * Assignment - Serial Communication
 * Demo URL - https://youtu.be/dY3Q2NWqMD8
 */

#include "PDMSerial.h"

PDMSerial pdm;

int sensorPin = A0;
int sensorData = 0;
int scaledSensor;
int ledPin = 2;

int led_status = HIGH;

void setup() {
  pinMode(sensorPin, INPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, led_status);
  Serial.begin(9600);
}

void loop() {

  
  sensorData = analogRead(sensorPin);
  scaledSensor = map(sensorData, 0, 1023, 0, 255);

  pdm.transmitSensor("a0", sensorData);
  pdm.transmitSensor("end");
  //Serial.println(sensorData);

  boolean mouseData = pdm.checkSerial();
  if(mouseData) {
    if (pdm.getName().equals(String("mouseClick"))) {
      if (led_status == HIGH) {
        led_status = LOW;
      }
      else {
        led_status = HIGH;
      }
      
      digitalWrite(ledPin, led_status);
      Serial.println(led_status);
    }
  }
}
