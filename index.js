'use strict';

const SERVER_PORT = 3000;
const SERIAL_END_TAG = ">";
const SERIAL_START_TAG = "<";

const Express = require('express');
const SerialPort = require("serialport");

const app = Express();

let lastMessageReceived = [];
let serialConnection = null;


app.get('/', (request, response) => {
    console.log('received /');
    response.send('This server connects the serial interface with scratch, following routes are available: /poll /reset_all /connect/:port /send/:message')
});

function extractCompleteInformation() {
    let tmp = lastMessageReceived.join("");
    if (SERIAL_END_TAG.length > 0) {
        let posStart = 0;
        if (SERIAL_START_TAG.length > 0)
            posStart = tmp.indexOf(SERIAL_START_TAG);
        let info = "";
        if (posStart >= 0) {
            info = tmp.substring(posStart, tmp.lastIndexOf(SERIAL_END_TAG) + 1);
        }
        lastMessageReceived = [tmp.substring(tmp.lastIndexOf(SERIAL_END_TAG) + 1)];
        return info;
    }
    else {
        lastMessageReceived = [];
        return tmp;
    }
}


app.get('/poll', (request, response) => {
    let responseText = "";

    if (lastMessageReceived.length > 0) {
        let data = extractCompleteInformation();
        if (data.length > 0)
            responseText = "data " + data + " \
";
    }
    //console.log("return to scratch: " + responseText);
    if (responseText.length > 0)
        response.send(responseText);
    else
        response.status(204).send();
});


app.get('/reset_all', (request, response) => {
    console.log('received reset_all');
    if (serialConnection != null && serialConnection.isOpen == true) {
        serialConnection.close();
        serialConnection = null;
    }
    response.status(204).send();
});

app.get('/connect/:port', function (request, response) {
    console.log('received connect to ' + request.params.port);
    let serialPortName = request.params.port;
    if (serialConnection == null || serialConnection.isOpen == false) {
        serialConnection = new SerialPort(serialPortName, {baudRate: 9600},
            function (err) {
                if (err) {
                    console.error(err.message);
                }
            }
        );
        serialConnection.on('error', function (e) {
            console.error(e.message);
        });
        serialConnection.on('data', function (incoming) {
            if (incoming.length > 0) {
                let tmp = "";
                for (let i = 0; i < incoming.length; i++) {
                    if (typeof(incoming[i]) == 'number' && incoming[i] > 31) //ignore cr lf tab and other invisible characters, however space = 32 is supported
                        tmp += String.fromCharCode(incoming[i]);
                }
                if (tmp.length > 0)
                    lastMessageReceived.push(tmp);
            }
        });


        serialConnection.open(function (err) {
            if (err) {
                console.error(err.message);
            }
            else {
                console.log("opened serial connection");
            }
        });

    } else {
        console.log("serial connection already opened!");
    }
    response.status(204).send();
});


app.get('/send/:message', function (request, response) {
    let message = request.params.message;
    console.log('received message ' + message);
    if (serialConnection == null || serialConnection.isOpen == false) {
        console.log("error in usage: call connect first and then send");
    }
    else {
        serialConnection.write(message, function (err) {
            if (err) {
                return console.error('Error on write: ', err.message);
            }
        });
        console.log('message written');
    }
    response.status(204).send();
});

app.listen(SERVER_PORT, (err) => {
    if (err) {
        return console.error('something bad happened', err)
    }

    console.log(`server is listening on ${SERVER_PORT}`);
});

app.use((err, request, response, next) => {
    // log the error, for now just console.log
    console.error(err);
    response.status(500).send("error " + err.message);
});