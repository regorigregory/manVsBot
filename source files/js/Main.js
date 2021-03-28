//Making sure that the user has the most recent standing data when loading the page...

requestFromDB(1);
requestFromDB(2);

//Setting the game area's background, so it won't be transparent before the game has been started.

mySVG.style = "background: #3C8663; border: 1px solid #bbbbbb;";

//Making sure that each section has the screen's height in order to create a more pleasing look for the eye of the visitor
//However, a lesson is it doesn't really look good on really large screens...

var sections = document.getElementsByClassName("section");
 for(var i = 0; i<sections.length; i++)
 {
	 var height = screen.height-82;
	 if(height<782) height=782;
  	 if(i==0)height=height+38;

	 sections[i].style.minHeight=height+"px";
 }
var selector = document.getElementById("numberOfDecksSelector");

//Function for starting the game. It is attaached to the button in the right hand side red circle in the html.

function startGame()
{
	window.scrollTo(0, 9000);
	var numberOfDecks=selector.value;
	
	console.log("Let's play with "+numberOfDecks);
	game(numberOfDecks);
	
}