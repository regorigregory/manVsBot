//This js file holds the vast majority of functions responsible for manipulating the game area.
//It also contains the sleep, capitalizeFirstLetter functions, which were sumbled upon at stackoverflow.com.


//Setting the size of the cards and finding the SVG element from the DOM for later manupulation...

var cardWidth = 70;
var cardHeight = 101;
var mySVG = document.getElementById('gameArea');

//Selecting the cards' folder and the image pack (there is an svg option, and different sizes).
		
var cardFolder = "./deck/";
var cardImageExtension = ".png";

//The following variable is used to create unique ids for SVG elements, be it a text or graphical element.
//Whenever a new element is created, the number this variable is holding appended to the string which will serve as its ID
//Then it is incremented, so two elements won't have the same IDs.

var textIdCounter = 0;

//This is just a simple function which was created to save some space as there are plenty of SVG elements to be created.

function createSVGElement(elementType)
{
	//SVG elements are special elements.
	//In order to manipulate them with javascript, instead of createElement, createElementNS has to be used
	//Its first parameter is a reference to SVG namespace, and the second is the SVG element type.
	var svgElement = document.createElementNS("http://www.w3.org/2000/svg", elementType);
	return svgElement;
}

function initialiseBoard(numberOfDecks)
{
	//Wiping the board (SVG container) clean, in case it is not the first round (therefore it already contains cards and other elements).
	while (mySVG.lastChild)
	{
		mySVG.removeChild(mySVG.lastChild);
	}
	//Giving some background to the SVG...
	//It is also done in main.js, but in case this funciton will be used on another page as well
	//this line is kept.
	
	mySVG.style = "background: #3C8663; border: 1px solid #bbbbbb;";
	
	//Drawing card frames to the board.
	
	drawCardFrame("dealer");
	drawCardFrame("bot");
	drawCardFrame("player");
	
	newMessageFeed("You have selected to play with " + numberOfDecks + " decks.", "green")
	newMessageFeed("You can increase or decrease the bet amount by clicking on the '+' and '-' symbols.", "green")
	newMessageFeed("The minimum bet amount is £25.", "green")

}


//Drawing some text to the board:
//message: the text itself
//x,y: the coordinates on the board the text should startX
//size: i.e. font-size
//colour: font colour

function drawText(message, x, y, size, colour)
{
	//Creating the SVG text element...
	var newTextElement = createSVGElement("text");
	//Creating the text node which will be appended to the newly created SVG text element later...
	var newTextNode = document.createTextNode(message);
	
	//Configuring the position, id and style of the new text element..	
		newTextElement.setAttributeNS(null, "x", x);
		newTextElement.setAttributeNS(null, "y", y);
	var newId = "e_" + textIdCounter;
		newTextElement.setAttributeNS(null, "id", newId);
		newTextElement.setAttributeNS(null, "class", "pointer");
	textIdCounter++;
	
	//Adding colour and font size
	//just to avoid ambiguity, both the stroke and the fill colour is set to be the same.
	var style = "fill: " + colour + "; stroke: " + colour + ";font-size: " + size;
	
	newTextElement.setAttributeNS(null, "style", style);
	//textNode is appended to the SVG text element.
	newTextElement.appendChild(newTextNode);
	//SVG text element is appended to the main SVG element (the game area).
	mySVG.appendChild(newTextElement);
	//Id of the newly created element is returned for later reference.
	return newId;
}

//This funciton writes each player's hand value into the SVG element. Parameters:
//handValue: e.g. if it is a 6 and 7, then the hand value will be 13
//player: which player: it is relevant for positioning
//round: it is relevant because of the dealer. After the first round, one card dealt upside down for him
//The player shouldn't know about this card, therefore the player is dealer and it is his first round, it won't be updated

function outputHandValue(handValue, player, round)
{
	if (round == "undefined")
	{
		round = 3;
	}
	//The positioning depends on the player's person.
	var x1, y1;
	var width = 70;
	var height = 30;

	if (player == "dealer")
	{
		if (round == 1)
		{
			//If it is the second card dealt to the dealer, the card's value won't be output.
			return false;
		}
		
		x1 = 200;
		y1 = 160;
	}
	else if (player == "player")
	{
		x1 = 200;
		y1 = 500;
	}
	else
	{
		x1 = 200;
		y1 = 330;
	}

	//Drawinng the rectangle which serves as background for the handValue.
	var newRectangle = createSVGElement("rect");
	//Positioning,sizing and styling...
	
		newRectangle.setAttributeNS(null, "x", x1);
		newRectangle.setAttributeNS(null, "y", y1);
		newRectangle.setAttributeNS(null, "width", width);
		newRectangle.setAttributeNS(null, "height", height);
		newRectangle.setAttributeNS(null, "style", "fill: #333333");
		
	//The rectangle is appended to the main SVG element.	
	mySVG.appendChild(newRectangle);
	//So does the text whose position will be within the newly drawn rectangle
	drawText(handValue, x1 + 23, y1 + 20, "18px", "#ffffff");


}
//The function below is responsible for drawing cards to the canvas (i.e. in the main SVG element). Parameters:
//rank: rank of the card
//suit: suit of the card
//position: name of the player, which is used to decide the position of the card
//turn: it is used to determine the position of the card too having determined which player it is
//In each turn, the next card is moved 25% to one direction, so that it won't cover the previos card completely.

function drawCard(rank, suit, position, turn)
{

	var x, y;
	//The url the image available from is constructed
	var imgSrc = cardFolder + rank + "_of_" + suit + cardImageExtension;
	//If it is the card dealt upside down (for the dealer)
	if (rank == "back")
	{
		imgSrc = cardFolder + rank + cardImageExtension;
	}
	//The dealt cards initial position (if it is the first card dealt) 
	//is decided based on the passed "position parameter", which is the name of the player.
	
	if (position == "dealer")
	{

		x = 204 + turn * cardWidth * 0.25;
		y = 40;
	}
	else if (position == "player")
	{
		//
		x = 204 + turn * cardWidth * 0.25;
		y = 379;
		
		//-turn*cardHeight*0.25;
	}
	else if (position == "bot")
	{
		x = 204 + turn * cardWidth * 0.25;
		y = 210;
		
		//-turn*cardHeight*0.25;
	}
	else
	{
		//Unexpected error, just letting myself know, where to look for.
		
		console.log("errrror in drawCard!");
	}
	
	//Having decided which player it is, the image is drawn to the canvas.
	
	//First, the image element is created (SVG image).
	var image = createSVGElement("image");
	//SRC attribute added
		image.setAttributeNS(null, "href", imgSrc);
	//ID created and added	
	var id = "e_" + textIdCounter++;
	//Positioning and sizing
		image.setAttributeNS(null, "id", id);
		image.setAttributeNS(null, "x", x);
		image.setAttributeNS(null, "y", y);
		image.setAttributeNS(null, "width", cardWidth);
		image.setAttributeNS(null, "height", cardHeight);
	
	
	//And finally, the image is appended to the canvas.
	mySVG.appendChild(image);
	//Id is returned for later reference.
	return id;

};

//This functions draws the card frame for each player in to the main SVG element.
//The position parameter is the player's name the card frame will be drawn for.


function drawCardFrame(position)
{
	var x, y;
	
	//Setting the positions of x, y based on the player's name.
	
	if (position == "dealer")
	{
		//
		x = 204;
		y = 40;
	}
	else if (position == "player")
	{
		//
		x = 204;
		y = 379;
		//-turn*cardHeight*0.25;
	}
	else if (position == "bot")
	{
		x = 204;
		y = 210;
		//-turn*cardHeight*0.25;
	}
	//Creating a new SVG element, which is a rectangle, in this case...
	var newFrame = createSVGElement("rect");
	//...setting its coordinates...
		newFrame.setAttributeNS(null, "x", x - 5);
		newFrame.setAttributeNS(null, "y", y - 5);
	//...making it a bit rounded...	
		newFrame.setAttributeNS(null, "rx", 5);
		newFrame.setAttributeNS(null, "ry", 5);
	//...defining its height and width...	
		newFrame.setAttributeNS(null, "width", cardWidth + 10);
		newFrame.setAttributeNS(null, "height", cardHeight + 10);
	//...colouring it...
		newFrame.setAttributeNS(null, "style", "stroke-width:1; stroke: yellow; fill: green");
	//...and when it is all done, it is appended to the main SVG element.
		
	mySVG.appendChild(newFrame);
}
//The next function is used to draw the details (name, balance, current bet) in to the main SVG element. Parameters:
//message: the message to be drawn
//line: there are three lines: player name, player balance and player bet enxt ot each player's cards.
//player: it is used to select the position which belongs to the player
function drawDetails(message, line, player)
{
	var x1, y1;
	
	//...specifying dimensions...
	
	var width = 100;
	var height = 40;//This is line height
	//... a new id is created for each element...
	var textId = "e_" + textIdCounter;
	textIdCounter++;
	//...deciding position based on the player's name...
	if (player == "dealer")
	{
		x1 = 30;
		y1 = 60 + line * height;
	}
	else if (player == "player")
	{
		x1 = 30;
		y1 = 399 + line * height;
	}
	else if (player == "bot")
	{
		x1 = 30;
		y1 = 230 + line * height;
	}
	//Having decided the postion, the next text element is being created...
	
	var newTextElement = createSVGElement("text");
	//Specifing coordinates...
		newTextElement.setAttributeNS(null, "x", x1);
		newTextElement.setAttributeNS(null, "y", y1);
	//Specifying style...
		newTextElement.setAttributeNS(null, "style", "fill:white; font-size:16px");
	//Adding id	...
		newTextElement.setAttributeNS(null, "id", textId);
	//Creating the textNode...
	var newTextNode = document.createTextNode(message);
	//Appending the textNode to the SVG Text element...
		newTextElement.appendChild(newTextNode);
	//Appending te SVG text element to the main SVG element...
	mySVG.appendChild(newTextElement);
	//...returning the ID for later use.
	return textId;
}
//The following funciton's responsibility is to draw a circle having  a center at p(x,y) coordinate, 
//with r  radius, with strokeColour border and fillColour inner colour.
function drawCircle(x, y, r, strokeColour, fillColour)
{
	//New circle type SVG element is created...
	var newCircle = createSVGElement("circle");
	//New id is created...
	var newId = "e_" + textIdCounter;
		textIdCounter++;
	//Specifying its attributes (position, colours, radius)...
		newCircle.setAttributeNS(null, "cx", x);
		newCircle.setAttributeNS(null, "cy", y);
		newCircle.setAttributeNS(null, "r", r);
		newCircle.setAttributeNS(null, "id", newId);
		newCircle.setAttributeNS(null, "class", "pointer");
	var newStyle = "stroke:" + strokeColour + "; stroke-width:1; fill: " + fillColour;
	
	newCircle.setAttributeNS(null, "style", newStyle);
	//Appending the circle to the main SVG element...
	mySVG.appendChild(newCircle);
	
	//Returning the ID for later reference...
	
	return newId

}
//The fucntion below is used to create a betting circle (using the drawCircle function above).
//x1,y2,r1 parameters are the center and the radius of the cirlcle, and betamount
//can be added or removed by clicking on the appropriate betting element.
function bettingCircle(x1, y1, r1, betAmount)
{
	//As each betting circle consists of three circles (each one with one text element),
	//the returned IDs are stored in an object.
	var ids = new Object();

	var x = x1;
	var y = y1;
	var r = r1;
	
	//The main circle is drawn...
	ids.circle_main = drawCircle(x, y, r, "blue", "#999999");
	//It is the right small cirlce now...
	ids.circle_bottom = drawCircle(x + r, y, r / 2, "blue", "#7B151F");
	//It is the left small circle now...
	ids.circle_top = drawCircle(x - r, y, r / 2, "blue", "#191E58");


	//console.log(ids.circle_bottom);
	//document.getElementById(ids.circle_bottom).setAttribute("data-value", "-"+betAmount);
	//Creating the text SVG element and correcting its position based on the text's (wanted to be written in it) position.
	var textX = x - (betAmount.length * 5);
	//...drawing the text elements inside each circle...
	ids.text_main = drawText("£" + betAmount, textX, y + 4, "13px", "white");

	ids.text_bottom = drawText("+", x + r - 3, y + 3, "13px", "white");
	ids.text_top = drawText("-", x - r - 3, y + 3, "13px", "white");
	//...using the ids returned to and stored in the ids object, "data-value" attribute is added to the two circles
	//	and texts on the sides ("+" and "-")...
	document.getElementById(ids.circle_top).setAttributeNS("http://www.w3.org/2000/svg", "data-value", -betAmount);
	document.getElementById(ids.circle_bottom).setAttributeNS("http://www.w3.org/2000/svg", "data-value", betAmount);
	document.getElementById(ids.text_top).setAttributeNS("http://www.w3.org/2000/svg", "data-value", -betAmount);
	document.getElementById(ids.text_bottom).setAttributeNS("http://www.w3.org/2000/svg", "data-value", betAmount);
	//...returning the ids for later usage.
	return ids;
}
//This function draws all betting circles to the main SVG element, it uses the function declared just above (bettingCircle).
function bettingCircles()
{
	//This is the starting position for each circle, which is incremented by 80 after each drawn circle...
	var startX = 75;
	var elements = new Array();
	//These are the betting options, a group of betting circles are drawn for each one of them.
	var bettingOptions = ["1", "5", "10", "25", "100"];
	//...for each betting option, a betting circle is drawn, its id is added to the elements array...
	for (var i = 0; i < bettingOptions.length; i++)
	{
		temp = bettingCircle(600, startX, 35, bettingOptions[i].toString());
		elements.push(temp);
		startX += 80;
		//console.log(startX);
		//there's an error
	}
	//...returning the ids.
	return elements;
}
//An action circle is like "deal", "hit"...etc. They are bigger than betting circles. Parameters:
//label: the text written in it
//startX: it is now the Y coordinate of the circle, it has been changed several times
//myR: the radius of the circle
function actionCircle(label, startX, myR)
{

	var ids = new Object();
	//350 for deal
	var x = 600;
	var y = startX;
	var r = myR; //25 for normal circles, 35 for the second round circles
	var myText = label;
	//Corrections based on the length of the text...
	var textX = x - (myText.length * 3);
	//Drawing the circle...
	ids.circle_main = drawCircle(x, y, r, "blue", "#7B151F");
	//Drawing the text...
	ids.text_main = drawText(myText, textX, y + 4, "13px", "white");
	//Returning the ids of both newly created elements (circle and text within it).
	return ids;

}
//The function below draws the first round's circle to the main SVG element making use of the function declared above (actionCricle)
function cardDealtCircles()
{
	var actions = ["surrender", "double", "hit", "stand"];
	var elements = new Array();
	//...the first elements position (y axis), which is incremented after each newly drawn circle...
	var start_y = 50;
	for (var i = 0; i < actions.length; i++)
	{
		elements.push(actionCircle(actions[i], start_y, 35));
		start_y += 80;

	}
	//...returning the IDS of the newly created element.
	return elements;
}
//The function below creates and appends a box to the message feed, whcih can be found next to the game area.
//Two parameters can be passed: the message itself, and the backgroudn colour of the box.
function newMessageFeed(message, colour)
{
	//...if colour is not defined, the appended class is normal...
	if (colour == undefined)
	{
		colour = "normal"
	}
	//...a new div element is created...
	var mainDiv = document.createElement("div");
	//...classes added to it...
	mainDiv.classList.add("feedMessage");
	mainDiv.classList.add(colour);
	//...id is created and added...
	mainDiv.setAttribute("id", "feed_" + textIdCounter++);
	//The text and timestamp divs are created...
	var messageDiv = document.createElement("div");
	messageDiv.classList.add("singleMessage");
	var timeStampDiv = document.createElement("div");
	timeStampDiv.classList.add("timeStamp");
	//The message node is created...
	var message = document.createTextNode(message);
	//The timestamp is created (one digit times are prepended with a 0)...
	var date = new Date();
	var dateObj = new Object();
	dateObj.hours = date.getHours().toString();
	dateObj.minutes = date.getMinutes().toString();
	dateObj.seconds = date.getSeconds().toString();
	dateObj.day = date.getDate().toString();
	dateObj.month = (date.getMonth() + 1).toString();
	//This is where adding 0s to the one digit time elements happens...
	for (prop in dateObj)
	{
		if (dateObj.hasOwnProperty(prop) && dateObj[prop].length < 2)
		{
			dateObj[prop] = "0" + dateObj[prop];
		}
	}
	//The time is concatenated...
	var tempTime = dateObj.hours + ":" + dateObj.minutes + ":" + dateObj.seconds + " " + dateObj.day + "/" + dateObj.month;
	var timeStamp = document.createTextNode(tempTime);
	//The message and timeStamp is appended to their respective divs...
	messageDiv.appendChild(message);
	timeStampDiv.appendChild(timeStamp);
	//The two divs are appended to the main, single message feed div...
	mainDiv.appendChild(messageDiv);
	mainDiv.appendChild(timeStampDiv);
	//The container of the message feed is selected...
	var feedDiv = document.getElementById("statusFeed");
	//Finding the first element within the main container...
	var lastElement = feedDiv.firstElementChild;
	//Inserting the newly created message box before the first element in the message feed...
	feedDiv.insertBefore(mainDiv, lastElement);
}
//The function below is responsible for delaying the whole game thus making it more followable for human beings...
function sleep(ms)
{
	//The solution for this is given by Dan Dascalescu:
	//https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
	return new Promise(resolve => setTimeout(resolve, ms));
}
//The function below is used by requestFromDB() (in ajaxFunctions.js) to update the standings at the bottom of the page.
function updateStanding(results, numberOfDecks)
{
	//The results hold the current standing for each player be it an either 1 or 2 decks game.
	for (var prop in results)
	{
		var addClass = "";
		//If the value is negative, the  a class is added to make its colour orange.
		colorClass = (results[prop] > 0) ? "green" : "orange";
		//Each player's span has an id, which is selected below, so that it can be updated.
		var span = document.getElementById(prop + "Standing_" + numberOfDecks);
		//If the balance turns from negative to positive or vica verse, the classes are updated.
		if (span.classList.contains("orange") && colorClass == "green") span.classList.remove("orange");
		if (span.classList.contains("green") && colorClass == "orange") span.classList.remove("green");
		//The color is added...
		span.classList.add(colorClass);
		//The standing is updated here...
		span.innerHTML = "£" + results[prop];
	}

}

//The function below capitalises the first letter of a string
//function was found at:
//https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript

function capitalizeFirstLetter(string)
{
	return string.charAt(0).toUpperCase() + string.slice(1);
}
//myLog is used in the simulation and in some of the classes
//It is used to control globally whether messages are output to the console or not
//It has a significance, when doing a large-round simulation, as turning them on can slow it down significantly
//The computer might become unresponsive for a couple of minutes
function myLog(message, logIt)
{
	if (logIt)
	{
		console.log(message);
	}
}