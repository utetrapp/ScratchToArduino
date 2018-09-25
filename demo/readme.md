# Demos

## Arduino
The arduino generates two random numbers and sends them every 100 ms to the serial connection using the protocol *<val1|val2>*, e.g. *<100|200>*

## Scratch
The sprite lib-serial handles the communication. Whenever data is read it is broadcasted using the message *onNewData*, the received data is stored in the list *serialDataList*. This lib-serial may be reused easyly, just right-click on it and export it and import it into any other Scratch project.
The cat reacts to the broadcasted message by going to the point defined by the two values. When you press the space bar, the sprite cat sends the message on|200\n or off|200\n to the arduino.
The arduino switches the built-in led on the board on or off accordingly.
Known problem: When you press the space bar, the movement of the cat is interrupted. Since this is not the case if you use a turn block whenever the broadcast onNewData is fired, I guess it is a problem within Scratch.
