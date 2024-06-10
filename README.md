# EasyPark System

## 1. Introduction

The EasyPark system addresses various challenges related to car parking, including controlling the number of cars inside the parking area, monitoring movements inside and outside the parking area, checking for available spaces, and ensuring a prebooking and easy revenue system. The project proposes the implementation of a microcontroller and web development-based API to provide a user-friendly tool for finding parking slots quickly and easily. This system is designed to be useful for maximum slots in overcrowded metropolitan cities, helping to minimize waiting time and redefine urban parking.

## 2. Problem Description

In crowded cities, the shortage of parking spaces and constant traffic jams are daily frustrations for residents and commuters. "ParkOnClick" steps in as a smart solution, making it easier to find parking and reducing city congestion, creating a smoother urban experience for all. This challenge necessitates an innovative solution like "ParkOnClick," which aims to revolutionize the urban parking experience. By integrating real-time data and smart technology, ParkOnClick seeks to reduce the chaos associated with parking, offering a more convenient, efficient, and stress-free solution for drivers while contributing to reduced congestion and an overall improvement in the quality of urban living.

## 3. Design Methodology

### 3.1 Overview

The "ParkOnClick" project employs a user-friendly web application powered by Node.js and Express.js for seamless server-side logic. Firebase enhances the system with real-time updates, authentication, and push notifications. Smart sensors and IoT devices, integrated with ESP32, provide accurate data on parking space occupancy. Servo motors ensure precise control of physical elements, aiding navigation. GitHub and Git manage collaborative development, enabling version control and issue tracking. The combination of these technologies creates an innovative urban parking solution, enhancing efficiency, reducing congestion, and providing a streamlined experience for users.

### 3.2 Components

#### Web Server
The web server (Firebase) acts as a central hub for storing and managing real-time parking space availability data. It also communicates with the ESP32 to update this data.
- Stores real-time data received from the ESP32 on parking space availability.
- Allows authorized users to manage parking reservations.
- Communicates with the ESP32 to send control commands or receive updates.

#### End User API
This API acts as a communication layer, allowing authorized users to interact with the ParkOnClick system through the web server.
- Provides a secure way for authorized users (e.g., parking lot managers) to interact with the system.
- Enables functionalities like viewing real-time parking data and managing parking reservations.

#### Frontend and Backend
- **Frontend**: Displays real-time parking space availability in a user-friendly format on a website or app.
- **Backend**: Processes data and controls functionalities, handling communication with the ESP32 and data storage/retrieval in the database.

#### Technology Used
- HTML, CSS, JAVASCRIPT
- NODEJS, EXPRESSJS, MYSQL, FIREBASE


## Usage
- Visit the home page
- Login/signup
- From the next page select the city you want to find the parking space
- Select the parking area
- From selected parking area, select he available slots as per requirement, select the time of booking
- confirm the booking
- logout

## Screenshots
#### ![Home Page](public/Screenshots/home)
#### ![About Page](public/Screenshots/about)
#### ![About Page](public/Screenshots/about1)
#### ![Login Page](public/Screenshots/login)
#### ![ Search city Page](public/Screenshots/selectCity)
#### ![Select slot Page](public/Screenshots/selectSlots)
#### ![Receipt Page](public/Screenshots/receipt)







##  Esp32 Code



```cpp
#include <Arduino.h> 
#include <WiFi.h>               //we are using the ESP32 
//#include <ESP8266WiFi.h>      // uncomment this line if you are using 
esp8266 and comment the line above 
#include <Firebase_ESP_Client.h> 
#include <Servo.h> //includes the servo library 
#include <Wire.h> 
#include <LiquidCrystal_I2C.h> 
int counter = 0;    
LiquidCrystal_I2C lcd(0x27, 16, 2);  
//Provide the token generation process info. 
#include "addons/TokenHelper.h" 
//Provide the RTDB payload printing info and other helper functions. 
#include "addons/RTDBHelper.h" 
 
// Insert your network credentials 
#define WIFI_SSID "realme7" 
#define WIFI_PASSWORD "04082002" 
// Insert Firebase project API Key 
#define API_KEY "AIzaSyBeyulh93rke0bCEIfJx4cxxdi3DL88aMo" 
 
// Insert RTDB URLefine the RTDB URL */ 
#define DATABASE_URL "https://testdata-1c6d3-default-rtdb.asia
southeast1.firebasedatabase.app/"  
#define ir_entry 19 
#define servo_pin 23 
//Define Firebase Data object 
Servo gate; 
 
 
FirebaseData fbdo; 
 
FirebaseAuth auth; 
FirebaseConfig config; 
 
unsigned long sendDataPrevMillis = 0; 
int count = 0; 
bool signupOK = false;     
   
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
void setup(){ 
  Serial.begin(9600); 
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
 
    pinMode(ir_entry, INPUT); 
     lcd.init();                       // Initialize the LCD 
  lcd.backlight();                  // Turn on the backlight 
  lcd.clear();  
 
    gate.attach(servo_pin);   //attach servo motor to the pin of 
respective esp    
    gate.write(servo_pin, 100); 
 
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD); 
  Serial.print("Connecting to Wi-Fi"); 
  while (WiFi.status() != WL_CONNECTED){ 
    Serial.print("."); 
    delay(300); 
  } 
  Serial.println(); 
  Serial.print("Connected with IP: "); 
  Serial.println(WiFi.localIP()); 
  Serial.println(); 
 
  /* Assign the api key (required) */ 
  config.api_key = API_KEY; 
 
  /* Assign the RTDB URL (required) */ 
  config.database_url = DATABASE_URL; 
 
  /* Sign up */ 
  if (Firebase.signUp(&config, &auth, "", ""){ 
    Serial.println("ok"); 
    signupOK = true; 
  } 
  else{ 
    Serial.printf("%s\n", config.signer.signupError.message.c_str()); 
  } 
 
  /* Assign the callback function for the long running token generation 
task */
 config.token_status_callback = tokenStatusCallback; //see 
addons/TokenHelper.h 
   
  Firebase.begin(&config, &auth); 
  Firebase.reconnectWiFi(true); 
} 
 
void ledMatrix(){ 
  if(digitalRead(irSensorPin1)==0){ 
   digitalWrite(l1, HIGH); 
  }else{ 
    digitalWrite(l1, LOW); 
  } 
 
  if(digitalRead(irSensorPin2)==0){ 
   digitalWrite(l2, HIGH); 
  }else{ 
    digitalWrite(l2, LOW); 
  } 
 
  if(digitalRead(irSensorPin3)==0){ 
   digitalWrite(l3, HIGH); 
  }else{ 
    digitalWrite(l3, LOW); 
  } 
 
  if(digitalRead(irSensorPin4)==0){ 
  digitalWrite(l4, HIGH); 
  }else{ 
    digitalWrite(l4, LOW); 
  } 
 
  if(digitalRead(irSensorPin5)==0){ 
    digitalWrite(l5, HIGH); 
  }else{ 
    digitalWrite(l5, LOW); 
  } 
} 
 
 
 
 
void loop(){ 
  // lcd.clear(); 
  lcd.setCursor(0, 0);               // Set the cursor to the first column 
and first row 
  lcd.print("ParkOnCLick");  
  int ir1 = digitalRead(irSensorPin1); 
  int eni = digitalRead(ir_entry); 
  int ir2 = digitalRead(irSensorPin2); 
  int ir3 = digitalRead(irSensorPin3); 
  int ir4 = digitalRead(irSensorPin4); 
  int ir5 = digitalRead(irSensorPin5); 
 counter = ir1 + ir2 + ir3 + ir4 + ir5; 
   lcd.setCursor(0, 1);               // Set the cursor to the first 
column and first row 
  lcd.print(counter);  
  if (eni == 0) { 
    gate.write(servo_pin, 0); 
    delay(2500); 
    gate.write(servo_pin, 100); 
    delay(100); 
  } 
  ledMatrix(); 
  
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 
5000 || sendDataPrevMillis == 0)){ 
    sendDataPrevMillis = millis(); 
    // Write an Int number on the database path test/int 
    if (Firebase.RTDB.setInt(&fbdo, "station1/1", ir1)){ 
      Serial.println("PASSED");  
      Serial.println("PATH: " + fbdo.dataPath()); 
      Serial.println("TYPE: " + fbdo.dataType()); 
    } 
    else { 
      Serial.println("FAILED"); 
      Serial.println("REASON: " + fbdo.errorReason()); 
    } 
     if (Firebase.RTDB.setInt(&fbdo, "station1/2", ir2)){ 
      Serial.println("PASSED");  
      Serial.println("PATH: " + fbdo.dataPath()); 
      Serial.println("TYPE: " + fbdo.dataType()); 
    } 
    else { 
      Serial.println("FAILED"); 
      Serial.println("REASON: " + fbdo.errorReason()); 
    } 
    if (Firebase.RTDB.setInt(&fbdo, "station1/3", ir3)){ 
      Serial.println("PASSED");  
      Serial.println("PATH: " + fbdo.dataPath()); 
      Serial.println("TYPE: " + fbdo.dataType()); 
    } 
    else { 
      Serial.println("FAILED"); 
      Serial.println("REASON: " + fbdo.errorReason()); 
    }  
     if (Firebase.RTDB.setInt(&fbdo, "station1/4", ir4)){ 
      Serial.println("PASSED");  
      Serial.println("PATH: " + fbdo.dataPath()); 
      Serial.println("TYPE: " + fbdo.dataType()); 
    } 
    else { 
      Serial.println("FAILED"); 
      Serial.println("REASON: " + fbdo.errorReason()); 
    } 
    if (Firebase.RTDB.setInt(&fbdo, "station1/5", ir5)){ 
      Serial.println("PASSED");  
      Serial.println("PATH: " + fbdo.dataPath());
       Serial.println("TYPE: " + fbdo.dataType()); 
    } 
    else { 
      Serial.println("FAILED"); 
      Serial.println("REASON: " + fbdo.errorReason()); 
    } 
    count++; 
     
     
  } 
   
} 

```

## Contributing
Contributions are welcome!

## Acknowledgements
Thanks to all the contributors and collaborators for their efforts.
Special thanks to the mentors and advisors for their guidance.

## Contact
For any queries or issues, please contact [siddhesharg4u@gmail.com]
