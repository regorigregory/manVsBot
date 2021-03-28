//This class represents Players. Players are the human players.

class Player
{
	constructor(name)
	{
		//...basic attributes are initialised here...
		//Each player's name can be set by passing a parameter.
		//However, it fulfills the "type" functionality, as the application uses it to determine what options the player should be offered.
		//It can be player, bot or dealer in the Game.
		
		this.name = name;
		//...array for the player's cards...
		this.cards = new Array();
		this.balance = 0;
		this.currentBet = 0;
		//...last action is set to hit, as it was needed at some point of the development, however, it has no relevance anymore...
		this.lastAction = "hit";
		//...counting the player's round which is used to determine the cards's position which are drawn in to the SVG element...
		
		this.round = 0;
		
		//...the property below is no longer  used...
		
		this.inGame = true;
		
		//This is the name used to output the player's name...
		
		this.displayName = "Player";
		
		//It is used to avoid duplicate user actions during the game.
		//Let's say the user clicks 2 or more times on the "hit" button by accident Before the current round has ended.
		//Then, he would get 2 more cards instead of one.
		
		this.clickedInThisRound = false;

	}
	
	//...adding one card to the player's hand...
	
	addCard(card)
	{
		this.cards.push(card);
	}
	
	//...determining whether the player has blackjack or not...
	//...used when deciding how much money the player should get, as when it is blackjack, it is 3:2, while in other cases it is just 1:1...
	
	hasBlackJack()
	{
		var cardsInHand = this.cards.length;
		var valueInHand = this.getCardSum();
		
		//The only way a player can have blackjack is having two cards in his hand and their value being 21.
		
		if (cardsInHand == 2 && valueInHand == 21)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	//The method below calulcates the numerical value (total) of the cards the player is currently holding
	//...used at various stages...
	
	getCardSum()
	{
		//...declaring the cardSum variable outside the loop so that it will exist outside the loop's scope...
		
		var cardSum = new Array(0, 0);
		
		//...aceCounter is used to make sure that aces are only counted 11 once (a+a=22, which doesn't make sense as the player would be busted)...
		
		var aceCounter = 0;

		//The for loop below goes throug every index of the player's cards, using this.cards.length as a limit.
		//It adds every card's value to the sum in every iteration.
		
		for (var i = 0; i < this.cards.length; i++)
		{
			
			//It saves the user's hand into two indices of an array, the first holds the hands value counting the first ace as 11, 
			//and the second as 1.
			//It is done in this way as it can be decided only at the end of the calculation, whether the player is busted or not.
				
			if (this.cards[i].realValue == 11 && aceCounter == 0)
			{
				cardSum[0] += 11;
				cardSum[1] += 1;
				aceCounter++;
			}
			else if (this.cards[i].realValue == 11)
			{
				cardSum[0] += 1;
				cardSum[1] += 1;
				aceCounter++;
			}
			else
			{
				cardSum[0] += this.cards[i].realValue;
				cardSum[1] += this.cards[i].realValue;
			}
		}
		
		//Depending on the more favourable outcome, the appropriate index of the array cardSum is returned. 
		//...if the user would bust counting the Ace as 11, the second index is returned.
			
		if (cardSum[0] > 21)
		{
			return cardSum[1];
		}
		else
		{
			return cardSum[0];

		}
	}
}