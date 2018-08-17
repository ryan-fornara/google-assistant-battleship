process.env.DEBUG = 'actions-on-google:*';

//include the following libraries:
const express = require('express')
const bodyParser = require('body-parser')
const { actionssdk, SimpleResponse } = require('actions-on-google')

const app = actionssdk();

function aiTurn(gb){
  var response = "";
  while(response == ""){
    var randNumb = Math.floor(Math.random()*(gb.length));
    var letters = "abcdefgh";
    var letter = letters.charAt(randNumb)
  
    var randCol = Math.floor(Math.random()*(gb[0].length));

    response = fireTorpedo(gb, letter, randCol, false);
  }

  return response;
}

function pivotPlacementCheck(gb, randRow, randCol, direction, currentShipSize){
  if(direction == 0) //Down
  {
    if(((gb.length-1)-currentShipSize)>=randRow){ //Passes & is able to be placed down
      for(var v = 0; v<currentShipSize; v++){
        if(gb[randRow+v][randCol] != 0){ //BOAT PLACEMENT FAILS!
          return false;
        }
      }
      for(var v = 0; v<currentShipSize; v++){
        gb[randRow+v][randCol] = currentShipSize;
      }
      return true;
    }
  }
  else if (direction == 1) //Right
  {
    if(((gb[0].length-1)-currentShipSize)>=randCol){ //Passes & is able to be placed right
      for(var v = 0; v<currentShipSize; v++){
        if(gb[randRow][randCol+v] != 0){ //BOAT PLACEMENT FAILS!
          return false;
        }
      }
      for(var v = 0; v<currentShipSize; v++){
        gb[randRow][randCol+v] = currentShipSize;
      }
      return true;
    }
  }
  else if (direction == 2) //Up
  {
    if(currentShipSize<=randRow){ //Passes & is able to be placed up
      for(var v = 0; v<currentShipSize; v++){
        if(gb[randRow-v][randCol] != 0){ //BOAT PLACEMENT FAILS!
          return false;
        }
      }
      for(var v = 0; v<currentShipSize; v++){
        gb[randRow-v][randCol] = currentShipSize;
      }
      return true;
    }
  }
  else if (direction == 3) //Left
  {
    if(currentShipSize<=randCol){ //Passes & is able to be placed left
      for(var v = 0; v<currentShipSize; v++){
        if(gb[randRow][randCol-v] != 0){ //BOAT PLACEMENT FAILS!
          return false;
        }
      }
      for(var v = 0; v<currentShipSize; v++){
        gb[randRow][randCol-v] = currentShipSize;
      }
      return true;
    }
  }
}



function createBoard(){
	var gb = [
     //1 2 3 4 5 6 7 8 
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ]

    var currentShip = 5;
    while(currentShip>1){
      var randRow = Math.floor(Math.random()*(gb.length));
      var randCol = Math.floor(Math.random()*(gb[0].length));
      
      var randDirection = Math.floor(Math.random()*3.99);

      for(var loopCounter = 0; loopCounter<4; loopCounter++){
        if(pivotPlacementCheck(gb, randRow, randCol, randDirection, currentShip))  //boat has been placed
        {
          currentShip--;
          break;
        }
        else
        {
          if(randDirection == 3){
            randDirection = 0;
          }else{
            randDirection++;
          }
        }
      }
    }
  
  	return gb;
}

function checkForWin(gb){
    for(var i = 0; i<gb.length;i++){
        for(var j = 0; j<gb[0].length;j++){
            if(gb[i][j]>0 && gb[i][j]<10){
                return false;
            }
        }
    }
    return true;
}

function fireTorpedo(gb, row, col, isPlayer) {
  //Convert row letter to number value
  var r;
  switch (row.toLowerCase()) {
      case 'a':
          r=0
          break
      case 'b':
          r=1
          break
      case 'c':
          r=2
          break
      case 'd':
          r=3
          break
      case 'e':
          r=4
          break
      case 'f':
          r=5
          break
      case 'g':
          r=6
          break
      case 'h':
          r=7
          break
	}  
 	console.log(r + " " + row);
  
  col-=1;
  if(gb[r][col]<10) // check to see that square has not been pinged
  {
    if(gb[r][col] != 0)  // check to make sure that we hit a boat, and not an empty tile
    {
      gb[r][col]+=10;
      return checkSunk(gb,r,row,col,isPlayer);
    }
    else
    {  // no boat was hit-- we must have hit a water tile
      gb[r][col]+=10; // mark water tile as hit
      if(isPlayer){
        return 'Miss at location ' + row.toUpperCase() + (col+1) + '.'
      }else{
        return 'The enemy missed at location ' + row.toUpperCase() + (col+1) + '.'
      }
    }
  }
  else { // user has already fired at this tile
    if(gb[r][col] == 10){
      if(isPlayer){
        return "You already missed at " + row.toUpperCase() + (col+1) + ". Try another spot."
      }else{
        return "";
      }
    } else {
      if(isPlayer){
        return "You already hit at " + row.toUpperCase() + (col+1) + ". Try another spot."
      }else{
        return "";
      }
    }
	}

  
}

function printBlank(gb){
  	var str=" _ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |\n"
      for(var i = 0; i<gb.length; i++){
        	switch (i) {
              case 0:
                str+="A";
                break;
              case 1:
                str+="B";
                break;
              case 2:
                str+="C";
                break;
              case 3:
                str+="D";
                break;
              case 4:
                str+="E";
                break;
              case 5:
                str+="F";
                break;
              case 6:
                str+="G";
                break;
              case 7:
                str+="H";
                break;
            }

           for(var j = 0; j<gb[0].length; j++){
             if(gb[i][j]<10){
                str+="| ~ "
             }else if(gb[i][j] == 10){
                str+="| o "
             }else{
                str+="| x "
             }

            }
        str+="|\n"
        }
    return str;
}

function printPlayerBoard(gb){
  var str=" _ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |\n"
    for(var i = 0; i<gb.length; i++){
        switch (i) {
            case 0:
              str+="A";
              break;
            case 1:
              str+="B";
              break;
            case 2:
              str+="C";
              break;
            case 3:
              str+="D";
              break;
            case 4:
              str+="E";
              break;
            case 5:
              str+="F";
              break;
            case 6:
              str+="G";
              break;
            case 7:
              str+="H";
              break;
          }

         for(var j = 0; j<gb[0].length; j++){
           if(gb[i][j]<10){
             if(gb[i][j]==0){
              str+="| ~ "
             }else{
              str+= "| " + gb[i][j] + " "
             }
           }else if(gb[i][j] == 10){
              str+="| o "
           }else{
              str+="| x " 
           }

          }
      str+="|\n"
      }
  return str;
}

function printGame(gb, egb){
  var str = "\n"
  str += printBlank(egb);
  str += "\n.\n.\n"
  str += printPlayerBoard(gb);
  return str;
}

function checkSunk(gb,r,row,col,isPlayer){ // search for hit tiles of equivalent numerical value. determine if boat is sunk.
  var boatID = gb[r][col] % 10;
  var instancesOfBoat = 0;
  for(var i=0;i<gb.length;i++){         // search through columns
    for(var j=0;j<gb[0].length;j++){    // search through rows in column i
      if(gb[i][j] == gb[r][col]){       // check congruency between selected cell and selected boat cell values
        instancesOfBoat++;              // we found a part of the selected boat that is damaged!
        if(instancesOfBoat >= boatID){  // have we found all the parts of the target boat?
          var boatType = "";            // the type of boat (placeholder)
          switch(boatID) {
              case 2:
                boatType = "patrol boat"
                break;
              case 3:
                var rand = Math.round(Math.random());
                if(rand==0){
                  boatType = "submarine"
                }else{
                  boatType = "destroyer"
                }
                break;
              case 4:
                boatType = "battleship"
                break;
              case 5:
                boatType = "carrier"
                break;
          }
          if(isPlayer){
              if(checkForWin(gb)){
                  return "Hit at " + row.toUpperCase() + (col+1)  + ". You sunk the enemy " + boatType + "! Game over, you are victorious!";
              }else{
                  return "Hit at " + row.toUpperCase() + (col+1)  + ". You sunk the enemy " + boatType + "!";
              }
          }else{
              if(checkForWin(gb)){
                  return "Hit at " + row.toUpperCase() + (col+1)  + ". The enemy sunk your " + boatType + "! Game over, the enemy wins. Better luck next time";
              }else{
                  return "Hit at " + row.toUpperCase() + (col+1)  + ". The enemy sunk your " + boatType + "!";
              }
          }
        }
      }
    }
  }
  if(isPlayer){
    return "Hit at " + row.toUpperCase() + (col+1) + "!"; 
  }else{
    return "Enemy hit at " + row.toUpperCase() + (col+1) + "!"; 
  }
}


// Toggleswitch for fire confirmation
function toggleFireConfirmation() {
  isConfirmationEnabled = !isConfirmationEnabled;  
}

// Welcome
app.intent('actions.intent.MAIN', (conv) => {
  		//Create gameboard:
  		var gameBoard = createBoard();
  		var playerGameBoard = createBoard(); //Enemy ai gameboard
      var isConfirmationEnabled = true;
      
      conv.data.count = {gameBoard, playerGameBoard, isConfirmationEnabled};

  	conv.ask(new SimpleResponse({
		speech: "Welcome to Battleship Commander. A new eight by eight game board has been generated. Fire a torpedo by indicating your target. For instructions, say, how do I play?",
        // NR: At some point, we should create a method that allows the user to ask for instructions, or enable/disable hit confirmation.
		text: "Welcome to Battleship Commander. \n To indicate your target, say \'A3, fire\'. \n Say \'how do I play\' for instructions."
	}));
  });

// Main method -------------------------------------------------------------------------------------------------------------------------------
app.intent('actions.intent.TEXT', (conv, input) => {

	let rawInput = input.toLowerCase();

// Exit Action
	if(rawInput.includes("goodbye") ||
       rawInput.includes("bye") ||
       rawInput.includes("all set") ||
       rawInput.includes("see you") ||
       rawInput.includes("cancel") ||
       rawInput.includes("done") ||
       rawInput.includes("quit") ||
       rawInput.includes("that's all") ||
       rawInput.includes("that's it"))
    	{
			conv.close(new SimpleResponse({
				speech: 'Thanks for playing. Goodbye!',
				text: 'Thanks for playing!',
				}));
        }
  
// Help Text
  	if(rawInput.includes("help") ||
	   rawInput.includes("how do I play") ||
	   rawInput.includes("instructions") ||
	   rawInput.includes("info"))
    	{
        conv.ask(new SimpleResponse({
          speech: 'To fire at a target, indicate the letter and number of the grid at which you wish to fire, and then say fire. For example, you might say, B three fire, or F six fire.', //You can toggle fire confirmation by saying, toggle confirmation. To end your game, say quit.
          text: 'To fire: letter \+ number \+ \"fire.\" e.g. \"D4, fire.\" \n" Toggle fire confirmation: \"toggle confirmation.\" Confirmation enabled: ' + isConfirmationEnabled + '.',
        }));
      }
    
  	if(rawInput.includes("toggle confirmation") ||
       rawInput.includes("confirmation toggle"))
      	{
          toggleFireConfirmation();
          conv.ask(new SimpleResponse({
            speech: 'Done.',
            text: 'Done. Confirmation on: ' + isConfirmationEnabled,
          }));
          
        }

  	if(rawInput.includes("fire")){
      console.log('FIRE!!!')
      var index = rawInput.search(/\d/);
      
      var letter = rawInput.charAt(index-1);
      if((letter === "a" || letter === "b" || letter === "c" || letter === "d" || letter === "e" || letter === "f" || letter === "g" || letter === "h") && (rawInput.charAt(index)>0 && rawInput.charAt(index)<9)){
        /*if(isConfirmationEnabled === true){
          
          app.intent('ask_for_confirmation', (conv) => {
            conv.ask(new Confirmation(prompt));
          });
        
          app.intent('ask_for_confirmation_detail', (conv) => {
            conv.ask(new Confirmation("Did you want to fire at " + letter + num));
          });
          
          app.intent('ask_for_confirmation_confirmation', (conv, params, confirmationGranted) => {
            return conv.ask(confirmationGranted ? 'Yeet' : 'Damn bruv');
          });
          
        }*/
        var response = fireTorpedo(conv.data.count.gameBoard, letter, rawInput.charAt(index), true);
        var botResponse = aiTurn(conv.data.count.playerGameBoard);

        conv.ask(new SimpleResponse({
          speech: response + " " + botResponse,
          text: printGame(conv.data.count.playerGameBoard, conv.data.count.gameBoard),
        }));

      }else{
        conv.ask(new SimpleResponse({
          speech: "I didn't understand those coordinates. Where did you want to fire?",
            text: "I didn't understand those coordinates. Where did you want to fire?"
        }));
      }
    }else{
      conv.ask(new SimpleResponse({
        speech: "I didn't understand those coordinates. Don't forget to say fire after listing your coordinates.",
          text: "I didn't understand those coordinates. Don't forget to say fire after listing your coordinates."
      }));
    }
		
});

express().use(bodyParser.json(), app).listen(8079);
console.log('Server running at http://localhost:8079');
