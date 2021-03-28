//Functions for updating and requesting data to and from the database.


function updateToDB(messageInABottle)
{
	//console.log("updateToDB ajax function has been called");
	
	//constructing the XMLHttpRequest object
	var xhr = new XMLHttpRequest();
	var phpFeedback ="";
	
	//This function is called whenever there's a change in the readyState (1-4).
	xhr.onreadystatechange = function() 
	{
		//If it is 4 (https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState)
		//and the status is 200, than it means that the request has been processed
		if (this.readyState == 4 && this.status == 200) 
		{
			//Whatever message is "echoed" by the php file, that is logged to the js console
			phpFeedback = this.responseText;
			console.log(phpFeedback);
		}
    }
	
	xhr.open("POST", "ajax.php", true);
	//Why setRequestHeader: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//the type determines which function is called by the PHP file
	xhr.send(messageInABottle+"&type=update");
}
//Requesting data from the dataBase
function requestFromDB(numberOfDecks)
{
	//console.log("ajax request function has been called");
	 
	var xhr = new XMLHttpRequest();
	var phpFeedback ="";
	
	xhr.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			console.log(phpFeedback);
			//JSON.parse used, as the ajax.php, in this case will output a JSON formatted string
			//Which, if parsed, can be converted into a JS variable
			phpFeedback = JSON.parse(this.responseText);
			updateStanding(phpFeedback, numberOfDecks);	
		}
    }
	
	xhr.open("POST", "ajax.php", true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//the type determines which function is called by the PHP file
	xhr.send("numberOfDecks="+numberOfDecks+"&type=request");
}