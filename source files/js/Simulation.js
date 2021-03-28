//This js file contains the simulation's "engine".
//...starts with functions from ajaxFunctions.js.
//They update the standing from the database and displays it at the bottom of the page.

requestFromDB(1);
requestFromDB(2);

function simulation(numberOfDecks, numberOfBots, howManyTimes, loggingOnOff, simulationType, userDefined)
{
	//debugger;
	//Initially I wasn't sure what context I wanted to call this function from so came up
	//with a solution to handle parameters which hasn't been passsed to the function when calling it, 
	//and gave each parameter a default value (of course, having checked them).
	var numberOfDecks = (isNaN(numberOfDecks) || numberOfDecks<1) ? 1 : numberOfDecks;
	var botNumber = (numberOfBots<1 || isNaN(numberOfBots))? 3 : numberOfBots;
	var HMT = (howManyTimes <1 || isNaN(howManyTimes))? 100 : howManyTimes;
	var loggingOnOff = (typeof(loggingOnOff)=="boolean")?loggingOnOff: false;
	var simulationType = (simulationType != "userDefined")? "default": "userDefined";
	
	var message = HMT+" simulated round(s) has started with "+numberOfDecks+" decks, "+botNumber+" bots. The simulation type is: "+simulationType;
	myLog(message, true);
	alert(HMT+" simulated rounds has started.");

	//This is the round counter. Used to determine when the simulation has reached the limit defined by the user.
	
	var mainI = 0;
	
	//This array will be used to store the players in it, so it can be iterated through in each round,
	//also, in this way, it can be made sure that regardless of the number of players taking part in the simulation, will get to their turn.
	
	var currentPlayer = new Array();
	
	//Adding bots to the currentPlayer...
	//A loop is used so whatever number the user set for the bots (1-7), it will be added...
	
	for (var i = 0; i < botNumber; i++)
	{
		var temp = new Bot(numberOfDecks);
		temp.displayName = "bot_" + (i + 1);
		//If the simulation type is userDefined, that means the user defined his own basic strategy.
		//In this case, the first bot will use it, and the rest of it will be constructed using the default basic strategy.
		if (simulationType == "userDefined" && i == 0)
		{
			temp.basicStrategy = userDefined[0];
			temp.softHandStrategy = userDefined[1];
			myLog("User's bot has been created:", loggingOnOff);
			myLog(temp, loggingOnOff);
		}
		
		//The new player is pushed to the array below.
		currentPlayer.push(temp);
	}
	
	//...one dealer is contructed and pushed to the end of the array...
	
	var myDealer = new Dealer(numberOfDecks);
		currentPlayer.push(myDealer);
	//A dummy player is created to determine the end of the game...	
	var endGame = new Player("end");
		currentPlayer.push(endGame);
		
	//This object will be used to keep track of the won and lost bets...
	var saveToDb = new Object();
	
	//A property is created for each player with their name...
	
	for (var i = 0; i < currentPlayer.length - 1; i++)
	{
		var name = currentPlayer[i]["displayName"];
		saveToDb[name] = 0;
	}
	
	//currentPlayerIndex is set to 0, as the first player is at the 0th index of the currentPlayer array
	
	var currentPlayerIndex = 0;
	
	/* ************************************************************************************************
	The main loop
	*************************************************************************************************/
	
	while (mainI < HMT)
	{
		myLog("Test round:" + (mainI+1), loggingOnOff);
		
		//The first round is responsible for the first round's actions and then calling 
		//the nextPlayer function, passing the first player as a parameter to it.
		//Two cards are dealt for each player in the first round...discussed later.
		//The nextPlayer function "asks" each player what they want to do.
		//Then, depending on their decision (hit, stand, surrender, double) the corresponding function is called (hit, stand, surrender, double)
		//These functions then (hit, stand, surrender, double) call the nextPlayer function again, passing the currentPlayer[currentPlayerIndex] 
		//as a parameter to it.
		
		//However, depending on the outcome of the e.g. hit function (player might busts), the currentPlayerIndex is incremented.
		//Thus, when passing the currentPlayer[currentPlayerIndex] as a parameter to nextPlayer, the next player gets to his turn.
	
		//This goes on until the last player (endGame) is reached, than the round is concluded.
		//It will be repeated until HMT (i.e. how many times) limit is reached.
		//Then an alert is thrown notifying the player about the simulation's having been done
		//and the result div is displayed to conclude the balance of each player.

		firstRound();
		//If this loop is over , the conclusion might be output to the console, based whether  the parameter "loggingOnOff".
		//is true or false.
		//This optional logging function is used throughout this file.
		myLog("*********************************************************", loggingOnOff);
		myLog("The conclusion after  " + (mainI) + " simulated rounds is:", loggingOnOff);
		myLog("*********************************************************", loggingOnOff);
		
		//Outputting the results to the temporarily visible popup div.
		
		var mainDiv = document.getElementById("simulatioinResults");
			mainDiv.style.display = "block";
			
		//This is an inner div, and its innerHTML is wiped so as to make sure that the previous simulation's results are not there.
		
		var contentDiv = document.getElementById("resultsToDelete");
			contentDiv.innerHTML = "";
			
		//Creating the heading element.
		
		var heading = document.createElement("h3");
			heading.innerHTML = "The conclusion after " + (mainI) + " simulated round(s) is:";
		var myUl = document.createElement("ul");
		
		//This loop ensures that a list element is created for each player, and their end balance is inserted into it.
		//It is "currentPlayer.length - 1", because the last player is a fake player ("endGame"), therefore there's no need for outputting him.
		
		for (var i = 0; i < currentPlayer.length - 1; i++)
		{	
			//Current player is saved to temp.
			var temp = currentPlayer[i];
			myLog(temp.displayName + "'s balance: " + temp.balance, loggingOnOff);
			myLog(temp, loggingOnOff);
			var myLi = document.createElement("li");
			//Adding the name and the balance to the corresponding li.
			myLi.innerHTML = temp.displayName + "'s balance: £" + temp.balance;
			//Appending the li to the ul element...
			myUl.appendChild(myLi);
		}
		//The heading and the list is appended to the result container...
		
		contentDiv.appendChild(heading);
		contentDiv.appendChild(myUl);
	}
	
	//...alerting the player if the test has been done...
	
	alert("The last test round (" + mainI + ") has been done.");
	
	//The first round is special for two reasons:
	//The players have to make their bets.
	//Two cards are dealt after this to each player.
	//Then they can make decision: hit, stand, surrender or double.
	//In contrast to the Game.js, the bots cannot sit out. Here it is not allowed, as each one of them may sit out at the same time
	//becuse they all count the cards, and they make this decision based on the card-count becoming unfavourable for them.
	
	function firstRound()
	{
		//The round counter is incremented at the very beginnning ...
		
		myLog("*********************************************************", loggingOnOff);
		myLog("Round " + (mainI + 1) + " has started.", loggingOnOff);
		myLog("*********************************************************", loggingOnOff);
		
		//Each time the firstRound is called, mainI is incremented...
		
		
		mainI++;
		
		//Two cards are dealt for each player, apart from the last, fake one(that is why currentPlayer.length-1)...
		
		for (var i = 0; i < currentPlayer.length - 1; i++)
		{
			deal(currentPlayer[i]);
			deal(currentPlayer[i]);
		}
		
		//The bots have to make their bet.
		//As the bots are stored in the first n-2 indices of the currentPlayer array(the last two are the dealer and the "dummy" player) 
		//and the botNumber variable holds the number of bots.
		//This loop will make sure that every bot makes its bet.
		
		for (var i = 0; i < botNumber; i++)
		{
			currentPlayer[i].makesBet();
		}
		
		//As everybody who is necessary to act in the first round (the dealer's turn comes just before the end of the game) has taken their action.
		//The nextPlayer function is called, so that the first player (bot) gets to decide .
		
		nextPlayer(currentPlayer[currentPlayerIndex]);
	}

	function deal(player)
	{
		var message = "";
		
		//Making sure that there will be cards in the deck. If not, new deck(s) will be started.
		//This is handled differently in game.js.
		//It was necessary to move this functionality here, as the number of players varies from 1-7,
		//In this way, it checks if there are enough cards in the deck before each card dealing.
		//The limit could be 1, instead of 10, I just didn't want less than 10 cards in the deck.
		
		if (myDealer.cardCount < 10)
		{
			
			//...resetting the bots properties which play an important role in card counting...
			//"currentPlayer.length - 2" and "botNumber" can be used interchangably ...
			//in loops to apply changes or actions exclusively to the bot type players of the game...
			
			for (var i = 0; i < currentPlayer.length - 2; i++)
			{
				currentPlayer[i]["deckCount"] = numberOfDecks * 52;
				currentPlayer[i]["runningCount"] = 0;
				currentPlayer[i]["realCount"] = 0;
			}
			//The dealer opens the new decks, and resets his cardCount as well...
			
			myDealer.cardCount = numberOfDecks * 52;
			myDealer.deckCards = new Deck(numberOfDecks);
			
			//Communicatiing this happening to the outside world...
			
			message = "There wasn't enough cards in the deck for the next round. A new deck has been started.";
			myLog(message, loggingOnOff);
		}
		
		//A random card is removed by the dealer from the deck...
		
		var tempCard = myDealer.dealCard()[0];
		
		//Each bot has to count the card..this loop takes care of it...
		
		for (var i = 0; i < botNumber; i++)
		{
			currentPlayer[i].countCards(tempCard);
		}
		
		//The card is added to the player's hand whose turn is on...
		
		player.addCard(tempCard);
		myLog(player.displayName+"'s current hand value is "+player.getCardSum());
		//Two cards are dealt to the dealer at the very beginning of the game.
		//Therefore, this is just "deception" for the user. 
		//The bots make their decision based on the first card of the dealer, they don't take into account the second one.
		
		if (player.name == "dealer" && player.round == 1)
		{
			message = "A card facing down was dealt to the dealer...";
			myLog(message, loggingOnOff);
		}
		//...if its not the dealer, or not his first round...
		else
		{
			message = tempCard.rank + " of " + tempCard.suit + " was dealt to " + capitalizeFirstLetter(player.displayName) + ".";
			myLog(message, loggingOnOff);
		}
		
		//...don't dare to delete it, Tomorrow Myself! Even if it doesn't make sense.
		
		player.round++;
	}
	
	//If the player decides to surrender, he gets back his bet and its the next player's turn.
	
	function surrender(player)
	{
		player.lastAction = "surrender";
		
		var message = capitalizeFirstLetter(player.displayName) + " decides to surrender. Half of the bet amount is added to the dealer's balance, the other half is given back to the player";
		myLog(message, loggingOnOff);
		
		//...settling payouts...
		
		temp = player.currentBet / 2;
		
		player.currentBet = temp;
		player.balance += temp;
		myDealer.balance += temp;
		
		//...incrementing the current  Player's index...
		
		currentPlayerIndex++;
		
		//If the next player is not the "dummy" player, it means this round has ended
		//but the roudn is not over, so the message can be output.
		
		if (currentPlayer[currentPlayerIndex]["name"] != "end")
		{
		
			message = "The next player is " + capitalizeFirstLetter(currentPlayer[currentPlayerIndex]["name"]) + ".";
			myLog(message, loggingOnOff);

		}
		
		//The next player is called with the incremented index...
		
		nextPlayer(currentPlayer[currentPlayerIndex]);
	}
	
	//The player doubles its bet.
	//One more card is dealt to him.
	//Then it is the next player's round.
	
	function doubleIt(player)
	{
		var message = player.displayName + " decides to double the bet. One more compulsory card will be dealt, then hit is allowed.";
		myLog(message, loggingOnOff);
		
		//Settling bets, first things first...
		
		player.lastAction = "doubleIt";
		temp = player.currentBet;
		player.currentBet += temp;
		player.balance -= temp;
		//...dealing the card to the player and incrementing the curretPlayerIndex...
		deal(player);
		currentPlayerIndex++;
		
		//Again, if it is not the "dummy" player, the message can be output...
		
		if (currentPlayer[currentPlayerIndex]["name"] != "end")
		{
		
			message = "The next player is " + capitalizeFirstLetter(currentPlayer[currentPlayerIndex]["name"]) + ".";
			myLog(message, loggingOnOff);
		}
		//...nextPlayer is called with the incremented index...
		nextPlayer(currentPlayer[currentPlayerIndex]);
	}
	
	//One card is dealt to the player, and if he doesn't get busted, he can decide to hit or stand, it stays his turn...
	
	function hit(player)
	{
		var message = capitalizeFirstLetter(player.displayName) + " decides to hit. One more card will be dealt.";
		myLog(message, loggingOnOff);
		
		player.lastAction = "hit";
		
		deal(player);
		
		cardSum = player.getCardSum();
		
		//Checking whether the player got busted
		//If so, it will be the next player's turn...
		if (cardSum > 21)
		{
			player.lastAction = "busted";
			
			//The index is incremented, as it is the next player's turn, if this palyer has got busted...
			
			currentPlayerIndex++;
			
			//Letting the "world" know about what happened...
			
			message = capitalizeFirstLetter(player.displayName) + " has " + player.getCardSum() + ", he's got busted.";
			myLog(message, loggingOnOff);
			
			if (currentPlayer[currentPlayerIndex]["name"] != "end")
			{
				message = capitalizeFirstLetter(currentPlayer[currentPlayerIndex]["name"]) + " is deciding the next step..."
				myLog(message, loggingOnOff);
			}
			
			
		}
		else
		{
			//If he is not busted, i.e. the cardSum is not bigger than 21, the currentPlayerIndex is not incremented...
			message = "Card is dealt. Waiting for " + capitalizeFirstLetter(player.displayName) + "'s action";
			myLog(message, loggingOnOff);
			
		}
		nextPlayer(currentPlayer[currentPlayerIndex]);
	}
	
	
	//The player gives the floor to the next player, no more cards are dealt for him...
	
	function stand(player)
	{
		var message = capitalizeFirstLetter(player.displayName) + " decides to stand. No more cards will be dealt.";
		myLog(message, loggingOnOff);
		
		player.lastAction = "stand";
		
		//...currentPlayerIndex is incremented...
		
		currentPlayerIndex++;
		
		//Same logic applied here as in hit...
		
		if (currentPlayer[currentPlayerIndex]["name"] != "end")
		{
	
			message = "The next player is " + capitalizeFirstLetter(currentPlayer[currentPlayerIndex]["displayName"]) + ".";
			myLog(message, loggingOnOff);
		}
		
		//It is the next player's turn, nextPlayer is called passing the next player to it as a parameter...
		
		nextPlayer(currentPlayer[currentPlayerIndex]);
	}
	
	
	
	function nextPlayer(player)
	{
		var message = "";
		
		//In reality, it means type, rather than name...
		//It is used to determine whether it is a bot or a dealer, as the bot has more freedom...
		
		if (player.name == "bot")
		{
			//The myDealer is passed as a parameter as the bot needs to check the cards of the dealer to make his decision...
			var botDecision = player.makesDecision(myDealer);
			
			if (botDecision == "surrender")
			{
				surrender(player);
			}
			else if (botDecision == "doubleIt")
			{
				doubleIt(player);
			}
			else if (botDecision == "stand")
			{
				stand(player);
			}
			else if (botDecision == "hit")
			{
				hit(player);
			}
			else if (botDecision == "busted")
			{
				//If the bot busts, then it is without question, it is the next player's turn...
				currentPlayerIndex++;
				nextPlayer(currentPlayer[currentPlayerIndex]);
			}
			else
			{
				//This should not happen, if this is output, I probably messed up something...
				//Just letting myself know about it....
				alert("Error in nextPlayer in the bot's branch. Bot's decision:" + botDecision);
				myLog("The details for the error:", loggingOnOff);
				myLog(myDealer, loggingOnOff);
				myLog(player, loggingOnOff);
				//debugger;
			}
		}
		//...if the player type is dealer...
		
		else if (player.name == "dealer")
		{
			//...revealing the second card...
			//Again, it doesn't really have significance, it is output to make it look like as if it was a real game...
			//The bots don't take into account the second card of the dealer when making their decision, 
			//therefore there's no need for hiding and revealing the second card...
			
			myLog("dealer's round:" + player.round, loggingOnOff);
			if (player.round == 2)
			{
				message = "The Dealer has revealed his second card.";
				myLog(message, loggingOnOff);
			}
			var dealerDecision = player.makesDecision();
			
			//...depending the dealer's decision returned, the appropriate function is called...
			
			if (dealerDecision == "stand")
			{
				stand(player);
			}
			else if (dealerDecision == "hit")
			{
				hit(player);
			}
			else if (dealerDecision == "busted")
			{
				//...if he's got busted, the nextplayer is called passing the last, "dummy" palyer to it as a parameter...
				currentPlayerIndex++;
				nextPlayer(currentPlayer[currentPlayerIndex]);
			}
		}
		else if (player.name == "end")
		{
			//Concluding this turn...
			message = "The game is over. Declaring winners and loosers...";
			myLog(message, loggingOnOff);
			declareWinner();
		}
	}

	
	//This funtion is used to iterate through the player array (currentPlayer)...
	//First, it is decided whether each player has won, pushed...etc.
	//Then, according to the conclusion of this, each player's balance is updated...
	
	function declareWinner()
	{
		//This object is used to store the declared status (win, lose...etc) for each player...
		var declareStatus = new Object();
		
		
		//...each bot's status is declared using this loop...
		for (var i = 0; i < currentPlayer.length - 2; i++)
		{
			decideStatus(currentPlayer[i], declareStatus);
			myLog(currentPlayer[i].displayName + "'s bet amount: " + currentPlayer[i].currentBet, loggingOnOff);
		}
		myLog(declareStatus, loggingOnOff);
		
		//...not each player's balance is updated using this loop and calling the decideAmount passing each bot to it as a parameter...
		
		for (var i = 0; i < currentPlayer.length - 2; i++)
		{
			
			//Here, the saveToDb variable used declared in the global scope, so each round is updated into it
			//thus making it possible that, without having to actually save it to the database,
			//it can be decided how much each player has won or lost at the end of the simulation.
			decideAmount(currentPlayer[i], declareStatus, saveToDb);
		}
		//The players are reseted here so that they can start the next simulation round.
		newHands();
	}

	function decideStatus(player, declareStatus)
	{
		//In order to decide whether the player has won or lost, the player's and the dealer's cardSum is needed...
		var dealerSum = myDealer.getCardSum();
		var playerSum = player.getCardSum();
		
		//If both the player and dealer have blackjack...
		if(player.lastAction == "surrender"){
			declareStatus[player.name] = "lose";
		
		}
		else if (player.hasBlackJack() && myDealer.hasBlackJack())
		{
			declareStatus[player.displayName] = "push";
		}

		//...just the player...

		else if (player.hasBlackJack() && dealerSum != 21)
		{
			declareStatus[player.displayName] = "win-blackjack";
		}
		
		//...player wins, either because he has a bigger hand or the dealer busts...
		
		else if (playerSum < 22 && (playerSum > dealerSum || dealerSum > 21))
		{
			declareStatus[player.displayName] = "win";
		}
		
		//...player pushes, even if he and the dealer are both bust...
		
		else if ((playerSum < 22 && playerSum == dealerSum) || (playerSum > 21 && dealerSum > 21))
		{
			declareStatus[player.displayName] = "push";
		}
		
		//...the player loses if he busts or the dealer has a bigger hand.
		
		else if (playerSum > 21 || playerSum < dealerSum)
		{
			declareStatus[player.displayName] = "lose";
		}
	}
	
	//This function decides the amount won or lost and updates the player's balance
	//based on his status.
	
	function decideAmount(player, declareStatus, saveToDb)
	{
		
		var playerBet = player.currentBet;
		player.currentBet = 0;
		
		if (declareStatus[player.displayName] == "win-blackjack")
		{
			//...updating balance...
			//It is 2.5 (instead of 1.5), because the bet amount is always deducted from the player's balance at the time of making the bet
			//so now, it has to be given back...
			player.balance += playerBet * 2.5;
			myDealer.balance -= playerBet * 1.5;
			//This logic does not apply to the cumulative balance...
			saveToDb[player.displayName] += playerBet * 1.5;
			saveToDb["dealer"] -= playerBet * 1.5;
		}
		else if (declareStatus[player.displayName] == "win")
		{
			
			//...player gets back his bet and won money, therefore the multiplier is 2...
			player.balance += playerBet * 2;
			myDealer.balance -= playerBet;
			saveToDb[player.displayName] += playerBet;
			saveToDb["dealer"] -= playerBet;
		}
		else if (declareStatus[player.displayName] == "push")
		{
			//...player gets back his bet, no change in balance...
			player.balance += playerBet;
		}
		else if (declareStatus[player.displayName] == "lose")
		{
			
			//There's no need to update the player's balance
			//because the amount of the player's bet has already been deducted when betting...as discussed above...
						
			myDealer.balance += playerBet;
			
			//This is used to keep track of the most negative balance of each player...
			//It can give a hint about how much investment one would need,
			//in order to make sure that this profession is profitable....
			if (player.balance < player.mostNegativeBalance)
			{
				player.mostNegativeBalance = player.balance;
			}
			saveToDb[player.displayName] -= playerBet;
			saveToDb["dealer"] += playerBet;
		}
	}
	//This function used to loop through the player array and reset them so that they can start the next round...
	
	function newHands()
	{
		for (var i = 0; i < (currentPlayer.length - 1); i++)
		{
			resetPlayer(currentPlayer[i]);
		}
		currentPlayerIndex = 0;
	}
	
	//This funciton is used in the function above to reset the relevant attributes of each player so that they can start a new game...
	
	function resetPlayer(player)
	{
		player.currentBet = 0;
		player.lastAction = "hit";
		//making the hands empty
		player.cards = new Array();
		player.round = 0;
	}
}