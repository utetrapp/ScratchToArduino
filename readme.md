# ScratchToSerialServer
This node servers enables communication between Scratch (2.0 offline editor) and an Arduino - or any other serial enabled device.


## Install

Clone or download this repository and install the dependencies with: ```npm install``` and start the server with: ```node index.js``` or ```npm start```

Alternatively, you can install the server globally via npm with ```npm install -g scratchtoserialserver```  and then run it with ```scratchtoserialserver``` or locally with ```npm install scratchtoserialserver``` and run it from the node_modules directory with ```node index.js```


## Usage

Connect an Arduino or other serial device to your computer. Start the node sever as desribed above (```scratchtoserialserver```).
Start Scratch 2.0 offline editor. Press Shift and click File, choose *import experimental http extension*, load the file *ext-scratchtoserialserver-description.txt* (provided in this repository in the subfolder demo). Check *more blocks*, there should be an entry with *Serial* and it should be marked green at the right side.

Start the arduino IDE and choose Tools->port to know, which port your arduino is connected to. Program the arduino to send or receive data, you will find an examples in the demo folder
Upload your program to your arduino. The node server as it is, focuses on a simple string based protocol, i.e. <100|200> will send the two values 100 and 200 to Scratch -- the endtag > is essential.

Within Scratch: Start with *connect to port* and enter the port as shown in your arduino IDE, e.g. *COM4*. Use *send serial message* to send a message and use *get data* to access received data. An example may be found in the subfolder demo.

You may send anything from Sratch to arduino using the send *serial message* block. 
Tests showed, that we get a relative robust communication if we use a strong protocol to send data from arduino to Scratch, e.g. ```Serial.println("<10|20>")``` will work and needs to be validaded and splitted within Scratch. 
Whitespaces except space, i.e. ascii less than 31 will be swallowed and not passed to Scratch.


## API
```localhost:3000/connect/com4``` establishes a connection to arduino at com4

```localhost:3000/poll``` receive all data since last poll-call

```localhost:3000/reset_all``` reset the connection

### Advanced
Within the file index.js you will find three constants, modify them as you like (SERVER_PORT, SERIAL_END_TAG, SERIAL_START_TAG). However, we strongly recommend to stick to these constants, the results were satisfying. 

## Troubleshooting

### Problems during installation
See https://www.npmjs.com/package/serialport#installation-instructions -- you might need to install Python 2 (not 3) and run ```npm install serialport --build-from-source```

### When you start the server you get an error message
Check if the port 3000 is used otherwise or your anti virus is blocking it somehow.

### No data within Scratch
Check your node server using e.g. postman and sending the requests as given in the subsection API.



