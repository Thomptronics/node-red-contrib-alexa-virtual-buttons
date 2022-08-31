# node-red-contrib-alexa-virtual-buttons
A Node-RED node to trigger Alexa Routines via the [Virtual Buttons skill by Thomptronics](https://amzn.to/3fNU09R). To learn more about Virtual Buttons, please visit www.virtualbuttons.com


IMPORTANT NOTE: Virtual Buttons is only available in the countries that allow English-speaking Alexa skills.

## Install
Run the following npm command in your Node-RED user directory (typically ~/.node-red):
```
npm install @thomptronics/node-red-contrib-alexa-virtual-buttons
```

## Node Configuration

### Access Code
Put your ```Access Code``` in the node's Properties tab.  The ```Access Code``` is required for communications with Alexa.

See www.virtualbuttons.com for detailed information how to get your own unique access code.


### Virtual Button
The ```Virtual Button``` field specifies the button you want to press (1 to 99). You can pass a button number in the ```msg.payload``` of the input message, or you can enter it in the node's Properties tab.

A Virtual Button number passed in ```msg.payload``` will override any value you set in the node's Properties tab. If both are blank, the virtual button number defaults to 1.

## Node Usage
The following flow is a simple example of how to use this node to trigger Alexa Routines.
```
[{"id":"66f244c7099a0e6d","type":"tab","label":"Alexa Virtual Buttons","disabled":false,"info":"","env":[]},{"id":"f0ecd3914bc2c72d","type":"debug","z":"66f244c7099a0e6d","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":490,"y":240,"wires":[]},{"id":"dec0df03465b68bd","type":"inject","z":"66f244c7099a0e6d","name":"","props":[{"p":"payload"},{"p":"accessCode","v":"","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"1","payloadType":"num","x":110,"y":200,"wires":[["65df7cd9ef19ed79"]]},{"id":"65df7cd9ef19ed79","type":"virtual-buttons","z":"66f244c7099a0e6d","name":"","virtualButton":"1","x":320,"y":240,"wires":[["f0ecd3914bc2c72d"]]},{"id":"da5a7cb9284a527f","type":"inject","z":"66f244c7099a0e6d","name":"","props":[{"p":"payload"},{"p":"accessCode","v":"","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"2","payloadType":"num","x":110,"y":240,"wires":[["65df7cd9ef19ed79"]]},{"id":"af84a37bc216a79d","type":"inject","z":"66f244c7099a0e6d","name":"","props":[{"p":"payload"},{"p":"accessCode","v":"","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"99","payloadType":"num","x":110,"y":280,"wires":[["65df7cd9ef19ed79"]]},{"id":"518b685a9932be5b","type":"comment","z":"66f244c7099a0e6d","name":"Enter your Acess Code into the virtual buttons node's Properties tab","info":"","x":280,"y":120,"wires":[]},{"id":"a144ae739a0eabe9","type":"comment","z":"66f244c7099a0e6d","name":"Press the '1' inject button below to trigger the Alexa Routine...","info":"","x":260,"y":160,"wires":[]},{"id":"1786c55597f7cc0c","type":"comment","z":"66f244c7099a0e6d","name":"Prerequisites: (1) Enable the Virtual Buttons Alexa skill; (2) Create an Alexa Routine that is triggered by Virtual Button 01","info":"","x":440,"y":40,"wires":[]},{"id":"162387450f4c3e53","type":"comment","z":"66f244c7099a0e6d","name":"(see www.virtualbuttons.com on how to do the above)","info":"","x":240,"y":80,"wires":[]},{"id":"395688354895724c","type":"comment","z":"66f244c7099a0e6d","name":"*The '2' and '99' buttons will only work if you chose to subscribe to those additional (and optional!) buttons","info":"","x":400,"y":340,"wires":[]}]
```
