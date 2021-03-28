//This js file holds the functions used by the game, the "engine" of it.
//The functions creating, drawing and manipulating the SVG elements in the game and the sleep function can be found in Output.js.

function game(numberOfDecks)
{
	//The number of decks can be 1 or 2 - restricted by the select element in the UI.
	var numberOfDecks = numberOfDecks;
	var myPlayer = new Player("player");
	
	//The number of decks is passed as a parameter to the dealer's constructor
	//He uses it to create cards (the shoe) with the equivalent amount to the deck's number
	//and additionally, checks if the decks is about to run out of cards so that he can open a new "deck".
	
	var myDealer = new Dealer(numberOfDecks);
	
	//The bot needs it too, so that it can count the realcount (running count divided by the number of decks).
	
	var myBot = new Bot(numberOfDecks);
	
	//This object (graphicalElements) is used to save the ID of each created SVG element for later reference in order to be able to manipulate them.
	
	var graphicalElements = new Object();
	
	//The currentPlayer and currentPlayerIndex is used to keep track of which player's turn it is in the nextPlayer function.
	
	var currentPlayer = new Array();
	var currentPlayerIndex = 0;
	var botSitsOut = false;

	//Updating the standings from the database with the functions below...
	
	requestFromDB(1);
	requestFromDB(2);
	
	//Initialising the board (frames and background colour is drawn)...
	
	initialiseBoard(numberOfDecks);

	//Showing the first round's control elements: the betting circles
	//After the player has made the appropriate amount of bet (25), the game begins.
	showFirstRound();

	/* **********************************************************************************
		Functions below
	************************************************************************************/

	async function firstRound()
	{
		
		//The message variable is used to output messages to the message feed (the box on the right side of the game area).
		var message = "";
		
		//Checking whether the player's bet amount is between the minimum and maximum.
		
		if (myPlayer.currentBet >= 25 && myPlayer.currentBet <= 300)
		{
			
			//Hides the betting circles.
			hideFirstRound();

			//Bot decides whether to sit out or not.
			
			botSitsOut = myBot.sitsOut();

			//Outputting message...
			
			var message = "Player has made his final bet. Waiting for bot to decide the bet amount.";
			newMessageFeed(message);
			//await sleep(700);

			//If the bot decided not to sit out...
			
			if (!botSitsOut)
			{
				//currentPlayer initialised, bot makes his bet.
				//end is a fake player, used to determine the end of the game.
				currentPlayer = ["player", "bot", "dealer", "end"];
				myBot.makesBet();
				
				//Outputting message with delay (always): otherwise the whole game would end in miliseconds after the player has finished his turn...
				
				message = "Bot is thinking about the amount of bet...";
				await sleep(1300);
				newMessageFeed(message);
				
				message = "Bot makes a bet of £" + myBot.currentBet + ".";
				await sleep(1300);
				newMessageFeed(message, "red");

				message = "Dealer starts dealing the cards...";
				newMessageFeed(message);
				
				await sleep(1000);
				
				//Dealing two cards to each player...
				//It is delayed too, because of the reason mentioned above...
				//Dealing player cards...
				
				await deal(myPlayer);
				await deal(myPlayer);
				
				//Dealing bot cards...
				
				await deal(myBot);
				await deal(myBot);
				
				//Dealing dealer cards...
				
				await deal(myDealer);
				await deal(myDealer);

				message = "Cards are dealt. Waiting for Player's action.";
				newMessageFeed(message);
			}
			
			//If the bot decided to sit out...
			else
			{
				//There is one player less.
				currentPlayer = ["player", "dealer", "end"];
				message = "Bot decided to sit out for this round.";
				newMessageFeed(message, "red");

				message = "Dealer starts dealing the cards.";
				newMessageFeed(message);

				deal(myPlayer);
				await deal(myPlayer);
				await deal(myDealer);
				await deal(myDealer);

				message = "Cards are dealt. Waiting for Player's action.";
				newMessageFeed(message);
			}
			
			//After a little break, the second round's control elements are shown (hit,stand,surrender,double).
			await sleep(300);
			//As long as it is the user's turn, the control elements (buttons) trigger the next step in the flow.
			
			showSecondRound();
		}
		
		//Outputting the appropriate message depending on whether the player is under or over the bet range.
		//The control elements (in this case the "deal" button is used to step forward in the flow).
		
		else if (myPlayer.currentBet < 25)
		{
			message = "The minimum bet is £25. You can't start the game without betting the minimum amount."
			newMessageFeed(message, "red");
		}
		else if (myPlayer.currentBet > 300)
		{
			message = "Congratulations! You have found the maximum bet amount which is £300. Please lower your bet."
			newMessageFeed(message, "red");
		}
	}
	
	//This function turns on the visibility of the third round's control elements (hit or stand)
	//As each control element in the third round has been created during the second round, there's no need for creating new elements.
	
	function showThirdRound()
	{
		//A loop is used to turn on the first two elements visibiity in the graphicalElements.e_secondRoundElements object. 
		//These tow elements are the hit and the stand buttons.
		for (var i = 0; i < 2; i++)
		{
			var object = graphicalElements.e_secondRoundElements[i];
			
			//An inner for each loop is used so that this complex object's attributes don't have to be referenced by name from the loop.
			for (var prop in object)
			{
				//Making sure that inherited properties are not taken into account
				if (object.hasOwnProperty(prop))
				{
					//This is where the element gets hidden ->its attribute "visibility" is changed to "hidden".
					
					document.getElementById(object[prop]).setAttribute("visibility", "hidden");
				}
			}
		}
	}
	
	//The function below hides the second round's control elements
	function hideSecondRound()
	{
		for (var i = 0; i < 4; i++)
		{
			var object = graphicalElements.e_secondRoundElements[i];
			for (var prop in object)
			{
				//making sure that inherited properties are not taken into account
				if (object.hasOwnProperty(prop))
				{
					document.getElementById(object[prop]).setAttribute("visibility", "hidden");
				}
			}
		}
	}
	//This function creates the second round's control elements and adds their ids to the graphicalElements object
	function showSecondRound()
	{
		graphicalElements.e_secondRoundElements = new Array();
		
		//An array is used to define the label for each button so that a loop can be used to create each button
		
		var secondRoundActions = ["Surrender", "Double", "Stand", "Hit"];
		var secondRoundFunctions = [surrender, doubleIt, stand, hit];
		
		//The variable below is used to position the buttons 
		
		var startX = 90;

		//A loop is used to go through each second round action. 
		
		for (var i = 0; i < secondRoundActions.length; i++)
		{
			//A circle is created, and its id is stored in the variable below,
			var tempIDs = actionCircle(secondRoundActions[i], startX, 35);
			
			//actions are bound to the text and circle component of the button as well.
			
			document.getElementById(tempIDs.circle_main).onclick = secondRoundFunctions[i];
			document.getElementById(tempIDs.text_main).onclick = secondRoundFunctions[i];
			
			//The IDs, in this case an array, is pushed to the graphicalElements object.
			
			graphicalElements.e_secondRoundElements.push(tempIDs); //35
			//The startX is added 80, so that the buttons won't cover each other.
			startX += 80;
		}
	}
	
	
	//This funciton is used to hide each betting circle.
	function hideFirstRound()
	{
		for (var i = 0; i < 5; i++)
		{
			var object = graphicalElements.e_bettingCircles[i];
			for (var prop in object)
			{
				//making sure that inherited properties are not taken into account
				if (object.hasOwnProperty(prop))
				{
					document.getElementById(object[prop]).setAttribute("visibility", "hidden");
				}
			}
		}
		document.getElementById(graphicalElements.e_dealCircle["circle_main"]).setAttribute("visibility", "hidden");
		document.getElementById(graphicalElements.e_dealCircle["text_main"]).setAttribute("visibility", "hidden");
	}
	
	//This function creates and draws the betting circles, also binds the function the user can trigger with his interaction
	function showFirstRound()
	{
		
		//The betting circles are drawn
		graphicalElements.e_bettingCircles = bettingCircles();
		
		//The deal circle is drawn
		
		graphicalElements.e_dealCircle = actionCircle("Deal", 490, 35);
		
		//Each player's details are drawn to the "canvas" next to the card frame (such as name, current bet...etc.)
		//The id of eachnewly created element is added to the graphicalElements object for later reference.
		
		graphicalElements.e_playerDetails = new Object();

		graphicalElements.e_playerDetails[myPlayer.name] = new Array();
		graphicalElements.e_playerDetails[myPlayer.name][0] = drawDetails(capitalizeFirstLetter(myPlayer.name), 0, "player");
		graphicalElements.e_playerDetails[myPlayer.name][1] = drawDetails("Bet: £" + myPlayer.currentBet, 2, "player");
		graphicalElements.e_playerDetails[myPlayer.name][2] = drawDetails("Balance: £" + myPlayer.balance, 1, "player");

		graphicalElements.e_playerDetails[myBot.name] = new Array();
		graphicalElements.e_playerDetails[myBot.name][0] = drawDetails(capitalizeFirstLetter(myBot.name), 0, "bot");
		graphicalElements.e_playerDetails[myBot.name][1] = drawDetails("Bet: £" + myBot.currentBet, 2, "bot");
		graphicalElements.e_playerDetails[myBot.name][2] = drawDetails("Balance: £" + myBot.balance, 1, "bot");

		graphicalElements.e_playerDetails[myDealer.name] = new Array();
		graphicalElements.e_playerDetails[myDealer.name][0] = drawDetails(capitalizeFirstLetter(myDealer.name), 0, "dealer");
		graphicalElements.e_playerDetails[myDealer.name][1] = drawDetails("Bet: £" + myDealer.currentBet, 2, "dealer");
		graphicalElements.e_playerDetails[myDealer.name][2] = drawDetails("Balance: £" + myDealer.balance, 1, "dealer");
		
		//Binding the appropriate function to each element (both textual and graphical)
		
		for (var i = 0; i < 5; i++)
		{
			var circles = graphicalElements.e_bettingCircles[i];
			
			document.getElementById(circles.circle_top).onclick = bet;

			document.getElementById(circles.circle_bottom).onclick = bet;
			document.getElementById(circles.text_top).onclick = bet;
			document.getElementById(circles.text_bottom).onclick = bet;
		}
		document.getElementById(graphicalElements.e_dealCircle.circle_main).onclick = firstRound;
		document.getElementById(graphicalElements.e_dealCircle.text_main).onclick = firstRound;
	}

	function bet()
	{
		//as these are SVG elements, the SVG namespace and getAttributeNS is used to manipulate or get access to attributes
		//The data-value is stores the bet amount for each betting circle's "+" or "-"
		var amount = this.getAttributeNS("http://www.w3.org/2000/svg", "data-value");
		//only the user's balance is handles here, the bot handles his own balance when he bets
		myPlayer.balance -= parseInt(amount, 10);
		myPlayer.currentBet += parseInt(amount, 10);
		
		//new messagefeed
		
		var message = "Player decides to bet £" + amount + ". The total bet amounts to £" + myPlayer.currentBet + ".";
		newMessageFeed(message, "red");
		
		//updating the player's balance and bet
		
		myPlayerUpdateFinance(myPlayer);
	}
	
	//This function is declared async, as the sleep function is called inside in it, which is async as well, and has to be waited for
	//The sleep funciton is responsible for delaying the game's flow
	//As cards can be dealt to any player, the player is passed as a parameter to it
	
	async function deal(player)
	{
		await sleep(500);
		
		
		myPlayerUpdateFinance(player);
		
		var message = "";
			
			//the dealer removes one random card from the deck
			
			var tempCard = myDealer.dealCard()[0];
			//The bot needs to count it
			//However, as the cardcounting has relevance only at the beginning of each round, the dealer's second card is counted as well
			
			myBot.countCards(tempCard);
			
			//The card is added to the players cards
			
			player.addCard(tempCard);
			
			//The little grey rectangles displaying the player's hand value is updated
			
			outputHandValue(player.getCardSum(), player.name, player.round);
			
			//If the player is the dealer, then the second card is drawn upside down, so that the player won't know about it
			
			if (player.name == "dealer" && player.round == 1)
			{
				drawCard("back", "back", player.name, player.round);
				message = "A card facing down was dealt to the dealer...";
				newMessageFeed(message, "orange");

			}
			else
			{
				//The player.round is used here
				
				drawCard(tempCard.rank, tempCard.suit, player.name, player.round);
				message = tempCard.rank + " of " + tempCard.suit + " was dealt to " + capitalizeFirstLetter(player.name) + ".";
				newMessageFeed(message, "orange");
			}
			//don't dare to delete it, Tomorrow Myself!
			//The player's round is incremented
			//It is used to avoid cards covering each other perfectly
			//It is used above, in the drawcard function
			player.round++;


		
		//return canGoAhead;
	}
	
	//async (delayed) surrender function
	//The floor is given to the next player, the current player gets back the half of his bet amount
	
	async function surrender(player)
	{
		//Determining whether it is the site's visitor or other player with the if statement above.
		//If the function is called by clicking on a button, than the player's toString value will be "[object MouseEvent]".
		if (player.toString() == "[object MouseEvent]")
		{
			player = myPlayer;
			
			//hiding the second round's control elements
			
			hideSecondRound();
			myPlayerUpdateFinance(player);
		}
		
		//clickedInThisRound is used to prevent double actions
		//If the player has clicked in this round, it will be ignored until it has ended (cards are dealt and control elements are shown)
		//It's not relevant to check whether it is the visitor or not.
		
		if (!player.clickedInThisRound)
		{
			player.clickedInThisRound = true;

			//Game ends, player gets back half of his money.
			player.lastAction = "surrender";
			var message = capitalizeFirstLetter(player.name) + " decides to surrender. Half of the bet amount is added to the dealer's balance, the other half is given back to the player";

			newMessageFeed(message);

			await sleep(1200);
			temp = player.currentBet / 2;
			player.currentBet = temp;
			player.balance += temp;
			myDealer.balance += temp;
			//updating the new balance and bet which will be lost.
			myPlayerUpdateFinance(player);
			//Incrementing the currentPlayer index, so when the nextPlayer is called, it will be the next player's turn.
			
			currentPlayerIndex++;
			//Checking whether the game is over in order to avoid outputting the fake player's name ("end") to the messageFeed.
			if (currentPlayer[currentPlayerIndex] != "end")
			{
				message = "The next player is " + capitalizeFirstLetter(currentPlayer[currentPlayerIndex]) + ".";
				newMessageFeed(message);
			}
			

			await sleep(1200);
			//Unlocking the clicking restraint, as the control elements have already been hidden.
			
			player.clickedInThisRound = false;
			//nextPlayer is called!
			nextPlayer(currentPlayer[currentPlayerIndex]);
		}
		else
		{
			//showing off in the console, that the player clicked twice
			console.log("Multiple player inputs. The second action has been ignored.")
		}
	}
	
	//The same coding logic as discussed above.
	//This time, one card is dealt to the player, then the floor is given to the next player.
	
	async function doubleIt(player)
	{

		if (player.toString() == "[object MouseEvent]")
		{
			player = myPlayer;
			hideSecondRound();
		}

		if (!player.clickedInThisRound)
		{
			player.clickedInThisRound = true;

			myPlayerUpdateFinance(player);

			//Player doubles the bet and gets one more card.
			var message = player.name + " decides to double the bet.";
			newMessageFeed(message);
			await sleep(1200);
			player.lastAction = "doubleIt";

			temp = player.currentBet;
			player.currentBet += temp;
			player.balance -= temp;

			await deal(player);

			currentPlayerIndex++;

			if (currentPlayer[currentPlayerIndex] != "end")
			{
				message = "The next player is " + capitalizeFirstLetter(currentPlayer[currentPlayerIndex]) + ".";
				newMessageFeed(message);
			}

			await sleep(1200);
			player.clickedInThisRound = false;
			nextPlayer(currentPlayer[currentPlayerIndex]);
		}
		else
		{
			console.log("Multiple player inputs. The second action has been ignored.")
		}
	}
	
	//Same programming logic as discussed in the previous action functions.
	//This time one card is dealt to the player, and if he doesn't get busted, it is still his turn
	async function hit(player)
	{
		if (player.toString() == "[object MouseEvent]")
		{
			player = myPlayer;
			showThirdRound();
		}
		if (!player.clickedInThisRound)
		{
			player.clickedInThisRound = true;

			var message = capitalizeFirstLetter(player.name) + " decides to hit.";
			newMessageFeed(message);
			player.lastAction = "hit";
			
			//dealing the card
			
			await deal(player);
			cardSum = player.getCardSum();
			
			//Checking whether the player is busted...
			
			if (cardSum > 21)
			{

				
				//Hiding second round if player is the user and gets busted...
				if (player.name == "player")
				{
					hideSecondRound();
				}

				player.lastAction = "busted";
				currentPlayerIndex++;
				message = capitalizeFirstLetter(player.name) + " has " + player.getCardSum() + ", he's got busted.";
				newMessageFeed(message, "red");
				await sleep(1200);

				if (currentPlayer[currentPlayerIndex] == "end")
				{
					message = "The game is over. Declaring winners and loosers..."
					newMessageFeed(message, "red");
				}
				else
				{
					message = capitalizeFirstLetter(currentPlayer[currentPlayerIndex]) + " is deciding the next step..."
					newMessageFeed(message, "normal");
				}

				await sleep(1200);
				player.clickedInThisRound = false;
				await nextPlayer(currentPlayer[currentPlayerIndex]);

			}
			else
			{
				message = "Card is dealt. Waiting for " + capitalizeFirstLetter(player.name) + "'s action";
				newMessageFeed(message, "normal");
				player.clickedInThisRound = false;
				
				//nextPlayer is called!
				//If it is still the user, the nextPlayer below won't do anything
				await nextPlayer(currentPlayer[currentPlayerIndex]);
			}

		}
		else
		{
			console.log("Multiple player input in one round. The second action has been ignored.")
		}
	}
	//Same programming logic as discussed in the previous action functions.
	//It is the next player's turn after it.
	async function stand(player)
	{
		if (player.toString() == "[object MouseEvent]")
		{
			player = myPlayer;
			hideSecondRound();
		}
		if (!player.clickedInThisRound)
		{
			player.clickedInThisRound = true;
			var message = capitalizeFirstLetter(player.name) + " decides to stand. No more cards will be dealt.";
			await sleep(1200);
			newMessageFeed(message);
			player.lastAction = "stand";
			currentPlayerIndex++;
			await sleep(1200);

			if (currentPlayer[currentPlayerIndex] == "end")
			{
				message = "The game is over. Declaring winners and loosers...";
				newMessageFeed(message, "red");
			}
			else
			{
				message = "The next player is " + capitalizeFirstLetter(currentPlayer[currentPlayerIndex]) + ".";
				newMessageFeed(message);
			}
			clickedInThisRound = false;
			nextPlayer(currentPlayer[currentPlayerIndex]);

		}
		else
		{
			console.log("Multiple player inputs. The second action has been ignored.")
		}
	}

	
	//The following function is async as sleep is called several times to slow down the game
	
	async function nextPlayer(playerName)
	{

		var message = "";
		
		//If the player is the bot
		
		if (playerName == "bot")
		{
			
			//First, he makes a decision
			
			var botDecision = await myBot.makesDecision(myDealer);

			await sleep(1000);
			
			//Depending on the bot's decision, the appropriate function is called (hit, stand, surrender, double).
			//Then, from that fucntion, the next player is called again, but it might be another player passed as a parameter
			//depending on the outcome of that action.
			
			if (botDecision == "surrender")
			{
				await surrender(myBot);
			}
			else if (botDecision == "doubleIt")
			{
				await doubleIt(myBot);
			}
			else if (botDecision == "stand")
			{
				await stand(myBot);
			}
			else if (botDecision == "hit")
			{
				await hit(myBot);
			}
			else if (botDecision == "busted")
			{
				//If the bot is busted, it is the next player's turn, currentPlayer is incremented.
				currentPlayerIndex++;
							
				message = "The next player is " + capitalizeFirstLetter(currentPlayer[currentPlayerIndex]) + ".";
				newMessageFeed(message);
				//Recursive call to the funciton itself.
				nextPlayer(currentPlayer[currentPlayerIndex]);
			}
			else
			{
				alert("Error in nextPlayer in the bot's branch. Bot's decision:" + botDecision);
			}

		}
		else if (playerName == "dealer")
		{
			//Revealing the second card, if it is the second round
			console.log("dealer's round:" + myDealer.round);
			if (myDealer.round == 2)
			{
				outputHandValue(myDealer.getCardSum(), myDealer.name, myDealer.round);
				var hiddenCard = myDealer.cards[1];
				drawCard(hiddenCard.rank, hiddenCard.suit, "dealer", 1);
				message = "The Dealer has revealed his second card.";
				newMessageFeed(message, "red");
			}
			
			//The dealer has 3 options: hit, stand or bust.
			
			var dealerDecision = myDealer.makesDecision();


			await sleep(1000);
			if (dealerDecision == "stand")
			{

				await stand(myDealer);
			}
			else if (dealerDecision == "hit")
			{

				await hit(myDealer);
			}
			else if (dealerDecision == "busted")
			{

				nextPlayer("end");
			}
		}
		
		//If it is the last, fake player, who serves as the limit of this giant loop.
		else if (playerName == "end")
		{

			declareWinner();

		}
	}

	
	//This funciton and its helper funcitons (decideStatus, decideAmount and outputConclusion) 
	//are responsible for deciding who the winners are and updating their balance both to the game area and to the database.
	function declareWinner()
	{

		var declareStatus = new Object();
		
		//Deciding winners and loosers.
		
		decideStatus(myPlayer, declareStatus);
		//The bot's status is only decided if it is in game.
		//The same condition is used below a several times to avoid errors in the output (messagefeed) and update to the database.
		
		
		if(!botSitsOut) decideStatus(myBot, declareStatus);
		
		var saveToDb = new Object();
			saveToDb.numberOfDecks = numberOfDecks;
			
			//Initialising saveToDb, which will be passed to decideAmount....
			
			saveToDb["player"] = 0;
			if(!botSitsOut) saveToDb["bot"] = 0;
			saveToDb["dealer"] = 0;
		
		//Deciding the amount of lost and won money...
		
		decideAmount(myPlayer, declareStatus, saveToDb);
		if(!botSitsOut) decideAmount(myBot, declareStatus, saveToDb);
		
		if(botSitsOut) saveToDb["bot"] = 0;
		
		//Building the message for ajax.php...
		
		var xhrMessage = "player=" + saveToDb["player"] + "&bot=" + saveToDb["bot"] + "&dealer=" + saveToDb["dealer"] + "&numberOfDecks=" + numberOfDecks;
		
		//Updating the standing...
		updateToDB(xhrMessage);

		//Updating UI (eahc player's balance)...
		myPlayerUpdateFinance(myPlayer);
		if(!botSitsOut) myPlayerUpdateFinance(myBot);
		myPlayerUpdateFinance(myDealer);
		//Creating and showing the "play again button"...
		graphicalElements.restart = actionCircle("Play again", 100, 40);
		var buttonCircle = document.getElementById(graphicalElements.restart.circle_main);
		var buttonText = document.getElementById(graphicalElements.restart.text_main);
		
		//Binding function to the button...
		
		buttonCircle.onclick = newHands;
		buttonText.onclick = newHands;
		//outputting the results
		outputConclusion(declareStatus);
		//console.log(declareStatus);
	}
	//The following function's role is to decide whether a player has won, pushed, lost...
	function decideStatus(player, declareStatus)
	{

		//the conclusion of the game to one player is decided based on the cardSum 
		//Also, if the player has blackjack, that is taken into account, as it pays 3:2
		//The conclusion is saved to the object declareStatus, which was passed as a parameter
		var dealerSum = myDealer.getCardSum();
		var playerSum = player.getCardSum();
		//If the player surrendered...
		if(player.lastAction == "surrender"){
			declareStatus[player.name] = "lose";
		
		}
		//If both the player and dealer have blackjack...
		 else if (player.hasBlackJack() && myDealer.hasBlackJack())
		{
			declareStatus[player.name] = "push";
		}
		//just the player...
		else if (player.hasBlackJack() && dealerSum != 21)
		{
			declareStatus[player.name] = "win-blackjack";
		}
		//player wins...
		else if (playerSum < 22 && (playerSum > dealerSum || dealerSum > 21))
		{
			declareStatus[player.name] = "win";
		}
		//player pushes, even if he and the dealer are both busted...
		else if ((playerSum < 22 && playerSum == dealerSum) || (playerSum > 21 && dealerSum > 21))
		{
			declareStatus[player.name] = "push";

		}
		//the player loses if he busts or the dealer has a bigger hand...
		else if (playerSum > 21 || playerSum < dealerSum)
		{
			declareStatus[player.name] = "lose";
		}
	}

	//Function for deciding the amount won, based on the results of the function just above.
	//Not effective, code should be moved to decideStatus, though...
	
	function decideAmount(player, declareStatus, saveToDb)
	{
		//Updating the player's balance and saving the changes to saveToDB in order to return it and insert it into the database.
		var playerBet = player.currentBet;

		player.currentBet = 0;
		if (declareStatus[player.name] == "win-blackjack")
		{
		
			//Updating balance.
			//It is 2.5 (instead of 1.5), because the bet amount is always deducted from the player's balance at the time of making the bet.
			player.balance += playerBet * 2.5;
			myDealer.balance -= playerBet * 1.5;
			//This logic does not apply to saving to the database.
			saveToDb[player.name] += playerBet * 1.5;
			saveToDb["dealer"] += playerBet * (-1.5);

		}
		else if (declareStatus[player.name] == "win")
		{
			//Player gets back his bet and won money, therefore the multiplier is 2.
			player.balance += playerBet * 2;
			myDealer.balance -= playerBet;
			saveToDb[player.name] += playerBet;
			saveToDb["dealer"] += playerBet * (-1);
		}
		else if (declareStatus[player.name] == "push")
		{
			//Player gets back his bet, no change in balance.
			player.balance += playerBet;
		}
		else if (declareStatus[player.name] == "lose")
		{
			//There's no need to update the player's balance
			//because the amount of the player's bet has already been deducted when betting...as discussed above.
			myDealer.balance += playerBet;
			saveToDb[player.name] += playerBet * (-1);
			saveToDb["dealer"] += playerBet;
		}

	}
	
	//Showing the user the conclusion of the game.
	
	function outputConclusion(declareStatus)
	{
		var message = "";
		var colour = "";
		//A loop is used to go through the declareStatus object (a conclusion is output for each player)
		//also, an if statement is used, to change the colour of the message box according to its being positive or negative.
		for (var prop in declareStatus)
		{
			var cprop = capitalizeFirstLetter(prop);
			if (declareStatus[prop] == "win-blackjack")
			{
				colour = "green";

				message = cprop + " has won  with black jack. It pays 3:2.";
			}
			else if (declareStatus[prop] == "win")
			{
				colour = "blue";
				message = cprop + " has won. It pays 1:1.";
			}
			else if (declareStatus[prop] == "push")
			{
				colour = "orange";
				message = cprop + " pushes. " + cprop + " gets back his bet.";
			}
			else if (declareStatus[prop] == "lose")
			{
				colour = "red";
				message = cprop + " has lost the bet. The Dealer's balance is increased with the bet amount.";

			}
			console.log("prop:" + prop + " value: " + declareStatus[prop]);
			newMessageFeed(message, colour);
		}

	}
	
	//Resetting the players of the game.
	//This function is called by clicking on the "Play again" button.
	
	function newHands()
	{
		//If the dealer is about to run out of cards, he constructs a new shoe.
		if (myDealer.cardCount < 21)
		{
			myBot.deckCount = numberOfDecks * 52;
			myBot.runningCount = 0;
			myBot.realCount = 0;
			myDealer.cardCount = numberOfDecks * 52;
			myDealer.deckCards = new Deck(numberOfDecks);
			var message = "There wasn't enough cards in the deck for the next round. A new deck will be used for this round.";
			newMessageFeed(message, "red");

		}
		//variable declared in output.js

		
		
		//resetting players

		resetPlayer(myPlayer);
		resetPlayer(myBot);
		resetPlayer(myDealer);
		//resetting the currentPlayerIndex	
		currentPlayerIndex = 0;
		//resetting the game area
		initialiseBoard(numberOfDecks);
		//showing the betting circles
		showFirstRound();
		//updating the standing from the database to be output at the bototm of the page(black bottom bar)
		requestFromDB(numberOfDecks);
	}
	
	//Fucntion for updating a player's financial details.
	
	function myPlayerUpdateFinance(player)
	{
		document.getElementById(graphicalElements.e_playerDetails[player.name][2]).innerHTML = "Balance: £" + player.balance;
		document.getElementById(graphicalElements.e_playerDetails[player.name][1]).innerHTML = "Bet: £" + player.currentBet;

	}

	//Resetting the players so that the new game can be started.
	
	function resetPlayer(player)
	{
		player.currentBet = 0;
		player.lastAction = "hit";
		player.cards = new Array();
		player.round = 0;
		player.clickedInThisRound = false;
	}
}