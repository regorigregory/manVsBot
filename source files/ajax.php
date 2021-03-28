<?php

$host = "localhost";
$userName = "bitse_blackjack";
$password = "fDt5s!16";
$dbName = "bitsever_blackjack";
$c = mysqli_connect($host, $userName, $password, $dbName);

//checking whether the connection has been established.
if(!$c){
	  die("Connection failed: " . mysqli_connect_error());
	
}
//deciding which function to call based on the post variable "type"
if(isset($_POST["type"]) && $_POST["type"]=="update"){
//updating the database, if the type is "update"	
	updateStanding();
}
if(isset($_POST["type"]) && $_POST["type"]=="request"){
//getting data from the database, if the type is "request"	
	getStanding($_POST["numberOfDecks"]);
}

//closing the connection

mysqli_close($c);

//function for updating the database
function updateStanding(){
	global $c;
//assigning and escaping post variables for shorter variables	
	$numberOfDecks = mysqli_real_escape_string($c, $_POST["numberOfDecks"]);
	$playerUpdate = mysqli_real_escape_string($c,$_POST["player"]);
	$botUpdate = mysqli_real_escape_string($c,$_POST["bot"]);
	$dealerUpdate = mysqli_real_escape_string($c,$_POST["dealer"]);

//creating the queries...It is insert, so each game can be distinguished for later use...
	$updateQueries[] = "INSERT INTO standing(name, balance, numberOfDecks) VALUES('player', '".$playerUpdate."','".$numberOfDecks."')";
	$updateQueries[] = "INSERT INTO standing(name, balance, numberOfDecks) VALUES('bot', '".$botUpdate."','".$numberOfDecks."')";
	$updateQueries[] = "INSERT INTO standing(name, balance, numberOfDecks) VALUES('dealer', '".$dealerUpdate."','".$numberOfDecks."')";
	//executing the queries
	foreach($updateQueries as $v){
		if (mysqli_query($c, $v)) {
			echo "Record has been updated successfully.";
		} else {
			echo "Error updating record: " . mysqli_error($c);
		}
	}
}

//Function for requesting the standing from the database
function getStanding($numberOfDecks){
	global $c;	
	$requestQueries["player"] = "SELECT balance FROM standing where name='player' AND numberOfDecks=".$numberOfDecks;
	$requestQueries["bot"] = "SELECT balance FROM standing where name='bot' AND numberOfDecks=".$numberOfDecks;
	$requestQueries["dealer"] = "SELECT balance FROM standing where name='dealer' AND numberOfDecks=".$numberOfDecks;
	//initialising associative array keys and values
	$realBalance["player"]=0;
	$realBalance["bot"]=0;
	$realBalance["dealer"]=0;
	//requesting data from the database
	foreach($requestQueries as $k=>$v){
		$result = mysqli_query($c, $v);
		//updating the balance for each player
		while($row = mysqli_fetch_assoc($result))
		{
			$realBalance[$k]+=$row["balance"];
		}
	}
	echo json_encode($realBalance);
}

?>