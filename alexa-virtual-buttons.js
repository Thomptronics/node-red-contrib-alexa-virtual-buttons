/**
 * Copyright 2022 Thomptronics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
module.exports = function(RED) {
  "use strict";
  let request = require("request");

  function AlexaVirtualButtonsNode(config) {
    RED.nodes.createNode(this, config);
    this.virtualButton = config.virtualButton;
    let node = this;

    
    // Use the timeout specified in the settings.js file, or a default of 120 seconds
    if (RED.settings.httpRequestTimeout) { 
      this.reqTimeout = parseInt(RED.settings.httpRequestTimeout) || 120000; 
    } else {
      this.reqTimeout = 120000; 
    }

    this.on("input",function(msg) {

      // check access code
      let accessCode = msg.accessCode ? msg.accessCode : node.credentials.accessCode;
      // see if there is an access code - if not bug out with an error message
      if (!accessCode) {
         node.warn(RED._("No Access Code has been specified in properties tab or msg.accessCode"));
         node.status({fill:"red", shape:"ring", text:"no Access Code"});
         return;
      }

      // check button number
      let virtualButton = msg.payload ? msg.payload : node.virtualButton;
      let errmsg = "";
      if (virtualButton) {
        switch(typeof virtualButton) {
          case "number":
            break;
          case "string":
            if (isNaN(Number(virtualButton))) {
              errmsg = "msg.payload must contain a valid a number between 1 and 99. It cannot be a letter, symbol, or empty string.";
            }
            break;
          case "boolean":
            errmsg = "You cannot use a Boolean as a Virtual Button number";
            break;
          case "object":
            errmsg = "You cannot use JSON or Buffers as a Virtual Button number";
            break;
          default: 
            errmsg = "Unsupported payload type (try a number or a string)";
        }
      } else {
        errmsg = "You must specify a Virtual Button number in msg.payload or in the node's Parameter tab"
      }

      // if there was an error show it otherwise clear the status
      if (!errmsg) {
        node.status({});
      } else {
        node.warn(RED._(errmsg));
        node.status({fill:"red",shape:"ring",text: errmsg});
        return;
      }


      // ok everything looks good, build the URL
      let opts = {};
      opts.url = "https://api.virtualbuttons.com/v1";
      opts.timeout = node.reqTimeout;
      opts.method = "POST";
      
      // Set up the URL parameters
      opts.body = JSON.stringify({
        "virtualButton": virtualButton,
        "accessCode": accessCode
      });

      opts.headers = {};
      opts.headers["Content-Type"] = "application/json";
      opts.headers["Content-Length"] = opts.body.length;

      // Send the notification request to the Alexa service
      request(opts, function(err, res, body) {
        if (err) {
          if(err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT') {
            node.error("no response from Virtual Buttons service within timeout interval", msg);
            node.status({fill:"red", shape:"ring", text:"no response"});
          }
          else{
            node.error(err,msg);
            node.status({fill:"red", shape:"ring", text:err.code});
          }
          msg.payload = err.toString() + " : " + url;
          msg.statusCode = err.code;
        } else {
          msg.statusCode = res.statusCode;
          msg.headers = res.headers;
          msg.responseUrl = res.request.uri.href;
          msg.body = body;
          let response;
          try {response = JSON.parse(msg.body);} catch(e) {}
          if (msg.statusCode>299 || msg.statusCode<200) {
            node.status({fill:"red", shape:"ring", text:response.message});
          } else {
            if (response.hasOwnProperty("pressed")) {
              node.status({
                fill: "green",
                shape: "dot",
                text: "Last pushed " + response.pressed + " on " + response.timeStamp
              });
            } else {
              node.status({});
            }
          }
        }
        node.send(msg);
      });
    });

    this.on("close",function() {
      node.status({});
    });
  }

  RED.nodes.registerType("virtual-buttons", AlexaVirtualButtonsNode,{
    credentials: {
      accessCode: {type: "password"}
    }
  });
}
