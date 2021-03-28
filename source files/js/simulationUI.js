//This JS file holds the functions bound to the form elements of the simulation setting



//Initialising variables which can be manipulated by the user through the form elements in the UI.
//These varuables are important as they will be passed as a parameter to the simulation.
//This js file is used at bitseverywhere.co.uk/finalProject/simulation.php.
var numberOfDecks = 1;
var numberOfPlayers = 1;
var numberOfRounds = 1;
var logSwitch = false;
var simulationType = "default";
var userDefinedStrategy;
var action = "h";

//Collecting the UI elements for later reference.

var closeItButton = document.getElementById("closeIt");
var selectNumberOfDecks = document.getElementById("numberOfDecks");
var selectNumberOfPlayers = document.getElementById("numberOfPlayers");
var selectNumberOfRounds = document.getElementById("numberOfRounds");
var selectLogSwitch = document.getElementById("logSwitch");
var selectSimulationType = document.getElementById("selectType");


//The container for the user defined basic strategy table. It is selected, so that it could be hidden and shown.
var tableContainer = document.getElementById("simulationSettings");

//The select element with which the user can select the action (hit, stand...etc.) to be inserted into the strategy tables.

var selectAction = document.getElementById("selectAction");

var tableCells = document.getElementsByClassName("editable");
var simulationTrigger = document.getElementById("simulationTrigger");

//Binding the functions to UI elements below...
//There might be no need for for all of them now, though, since I updated the runSimulation (these functions are called in there as well)
// to solve the error, when the user hits "refresh page", and the form elements are not reseted.

/*selectNumberOfDecks.onchange = updateNumberOfDecks;
selectNumberOfPlayers.onchange = updateNumberOfPlayers;
selectNumberOfRounds.onchange = updateNumberOfRounds;
selectLogSwitch.onchange = updateLogSwitch;*/
selectSimulationType.onchange = updateSimulationType;
selectAction.onchange = updateAction;
closeItButton.onclick = closeIt;
simulationTrigger.onclick = runSimulation;

//...binding the insertAction function to each table cell so that it can be manipulated by the user...

for(var i = 0; i<tableCells.length; i++)
{
	tableCells[i].onclick = insertAction;
	//console.log(i);
}


//...each function is responsible for updating the variables declared at the beginning of this file based on the value of the appropriate form element...

function updateNumberOfDecks()
{
	numberOfDecks = selectNumberOfDecks.value;
	//alert(numberOfDecks);
}
function updateNumberOfPlayers()
{
	numberOfPlayers = selectNumberOfPlayers.value;
	//alert(numberOfPlayers);
}
function updateNumberOfRounds()
{
	numberOfRounds = selectNumberOfRounds.value;
	//alert(numberOfRounds);
}

function updateLogSwitch()
{
	logSwitch = selectLogSwitch.checked;
	//console.log(logSwitch);
}

//The function below also hides the basic strategy tables, if the simulation type is not "userDefined", 
//i.e. the user decided not to use his own strategy...

function updateSimulationType()
{
	simulationType = selectSimulationType.value;
	if(simulationType=="default")
	{
		tableContainer.style.display = "none";
	} else 
	{
		tableContainer.style.display = "block";
	}
	//console.log(simulationType);
}

//The action (hit, stand...etc.) to be inserted into the table...
function updateAction()
{
	action = selectAction.value;
}

//Insertinng the action into the table.
//Its background colour is also changed using classes defined in the style.css...
function insertAction()
{
	console.log("The action inserted to the cell:");
	console.log(action);
	console.log(this.innerHTML);
	this.innerHTML = action;
	this.classList = new Array();
	this.classList.add("editable");
	this.classList.add(action);
	

}

//The function below "closes" the popup div displaying the results of the simulation.

function closeIt()
{
	var e = document.getElementById("simulatioinResults");
	e.style.display="none";
}



//running the simulation

function runSimulation()
{
	//added these functions here as well, however, I no longer remember what sort of error I tried to resolve
	updateNumberOfDecks();
	updateNumberOfPlayers();
	updateNumberOfRounds();
	updateLogSwitch();
	updateSimulationType();
	
	//Letting the user know that something is happening
	//If the simulation type is "default", the first bots strategy is not updated, otherwise:
	if(simulationType!="default")
	{
		var basicStrategy = new Array();
		var softHandStrategy = new Array();
		var counter = 0;
		//populating the basicStratagy array by collecting data from each table cell
		//It was a bit tricky, as the first index of the multi dimensional array is a column, 
		//while the cells are next to each other, in a huge row (array)
		for(var i = 0; i<19; i++)
		{
			for(var k=0; k<10; k++)
			{
				if(typeof basicStrategy[k+2] == "undefined")
				{
					basicStrategy[k+2]= new Array();
				}	
			basicStrategy[k+2][i+3]	= tableCells[counter].innerHTML;
			counter++;
			}
			
		}
		
		//populating the softhand strategy table

		
		for(var i = 0; i<10; i++)
		{
			for(var k=0; k<10; k++)
			{
				if(typeof softHandStrategy[k+2] == "undefined")
				{
					softHandStrategy[k+2]= new Array();
				}	
				
			softHandStrategy[k+2][i+12]	= tableCells[counter].innerHTML;
			counter++;
			}
			
		}
	
		
		
		userDefinedStrategy = new Array();
		userDefinedStrategy[0] = basicStrategy;
		userDefinedStrategy[1] = softHandStrategy;
		//just checking on myself
		console.log("The strategy defined by the user:");
		console.log(userDefinedStrategy);
		
	}
	//running the simulation
	simulation(numberOfDecks, numberOfPlayers,  numberOfRounds, logSwitch, simulationType, userDefinedStrategy);
}


