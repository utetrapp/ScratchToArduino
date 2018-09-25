String data1, data2;
const char END_TAG = '>';
const char START_TAG = '<';
const char DELIMITER = '|';
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("connected to arduino");
}

void loop() {
  if (Serial.available() > 0) {
    handleSerial();
  }  
  sendSerial(String(random(300)), String(random(300)));
  delay(100); //ten is too fast for scratch, 100 works well, 50 works most of the time
}

void sendSerial(String val1, String val2) {
  Serial.print(START_TAG);
  Serial.print(val1);
  Serial.print(DELIMITER);
  Serial.print(val2); 
  Serial.println(END_TAG);
}
void handleSerial() {  
  String message = Serial.readStringUntil('\n');
  int pos = message.indexOf(DELIMITER);
  data1 = "undefined"; 
  data2= "undefined";
  if (pos > 0) {
    data1 = message.substring(0, pos);
    if (pos + 1 < message.length())
      data2 = message.substring(pos+1);
  }
  //you transform to int or float with data1.toInt() or data1.toFloat(), we are fine with the strings
  if (data1=="on")
    digitalWrite(LED_BUILTIN, HIGH);
  else
    digitalWrite(LED_BUILTIN, LOW); 
}

