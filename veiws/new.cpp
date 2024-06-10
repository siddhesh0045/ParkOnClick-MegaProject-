#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <Servo.h>

// Insert your network credentials
#define WIFI_SSID "realme7"
#define WIFI_PASSWORD "04082002"
// Insert Firebase project API Key
#define API_KEY "YOUR_API_KEY"
// Insert RTDB URL
#define DATABASE_URL "YOUR_DATABASE_URL"

#define ir_entry 19
#define ir_exit  18
#define servo_pin 5

#define ir_entry1 16
#define ir_exit1  17
#define servo_pin1 4

FirebaseData fbdo;

Servo gate;
Servo gate_exit;

TaskHandle_t taskEntry = NULL;
TaskHandle_t taskExit = NULL;
TaskHandle_t taskUpdateIRData = NULL;

const int irSensorPin1 = 13; // Pin 13
const int irSensorPin2 = 12; // Pin 12
const int irSensorPin3 = 14; // Pin 14
const int irSensorPin4 = 27; // Pin 27
const int irSensorPin5 = 26; // Pin 26 

const int l1 = 25;
const int l2 = 33;
const int l3 = 32;
const int l4 = 0;
const int l5 = 2;

void entryGateTask(void * parameter) {
  pinMode(ir_entry, INPUT);
  pinMode(ir_exit, INPUT);
  gate.attach(servo_pin);   
  gate.write(servo_pin, 100);

  while(1) {
    if(digitalRead(ir_entry) == 0) {
      gate.write(servo_pin, 0); 
    }
    if(digitalRead(ir_exit) == 0) {
      gate.write(servo_pin, 100);
    }
    vTaskDelay(100 / portTICK_PERIOD_MS); // Delay to avoid busy loop
  }
}

void exitGateTask(void * parameter) {
  pinMode(ir_entry1, INPUT);
  
  pinMode(ir_exit1, INPUT);
  gate_exit.attach(servo_pin1);   
  gate_exit.write(servo_pin1, 100);

  while(1) {
    if(digitalRead(ir_entry1) == 0) {
      gate_exit.write(servo_pin1, 0); 
    }
    if(digitalRead(ir_exit1) == 0) {
      gate_exit.write(servo_pin1, 100);
    }
    vTaskDelay(100 / portTICK_PERIOD_MS); // Delay to avoid busy loop
  }
}

void updateIRDataToFirebaseTask(void * parameter) {
  pinMode(irSensorPin1, INPUT);
  pinMode(irSensorPin2, INPUT);
  pinMode(irSensorPin3, INPUT);
  pinMode(irSensorPin4, INPUT);
  pinMode(irSensorPin5, INPUT);

  pinMode(l1, OUTPUT);
  pinMode(l2, OUTPUT);
  pinMode(l3, OUTPUT);
  pinMode(l4, OUTPUT);
  pinMode(l5, OUTPUT);

  while(1) {
    int ir1 = digitalRead(irSensorPin1);
    int ir2 = digitalRead(irSensorPin2);
    int ir3 = digitalRead(irSensorPin3);
    int ir4 = digitalRead(irSensorPin4);
    int ir5 = digitalRead(irSensorPin5);
    
    if (Firebase.ready()) {
      // Write IR sensor data to Firebase
      Firebase.RTDB.setInt(&fbdo, "station1/1", ir1);
      Firebase.RTDB.setInt(&fbdo, "station1/2", ir2);
      Firebase.RTDB.setInt(&fbdo, "station1/3", ir3);
      Firebase.RTDB.setInt(&fbdo, "station1/4", ir4);
      Firebase.RTDB.setInt(&fbdo, "station1/5", ir5);
    }
    vTaskDelay(5000 / portTICK_PERIOD_MS); // Delay for updating Firebase every 5 seconds
  }
}

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
  }

  // Initialize Firebase
  Firebase.begin(API_KEY, DATABASE_URL);
  
  // Create tasks
  xTaskCreatePinnedToCore(entryGateTask, "Entry Gate Task", 10000, NULL, 1, &taskEntry, 1);
  xTaskCreatePinnedToCore(exitGateTask, "Exit Gate Task", 10000, NULL, 1, &taskExit, 1);
  xTaskCreatePinnedToCore(updateIRDataToFirebaseTask, "Update IR Data Task", 10000, NULL, 1, &taskUpdateIRData, 1);
}

void loop() {
  // Nothing to do here as tasks handle all functionality
}
