//The Dealer class is a subclass of the Player class.
//The dealer is responsible for:
	// creating shoes (number of decks passed as a parameter to the constructor)
	//removing cards from the shoe
	//and keeping track of how many card are in the deck: this is used to prevent running out of cards in the game.
	//However, it would not be necessary, as the this.deckCards.length would always return the number of remaining cards in the deck.
	//The reason why it was used is to enhance readibility and facilitate understanding of the main code.
	
class Dealer extends Player
{
	constructor(numberOfDecks)
	{
		//The super class's constructor is used
		
		super("dealer");

		//subclass specific properties are declared and initialised
		
		this.displayName = "Dealer";
		
		
		
		this.deckCards = new Deck(numberOfDecks);
		this.cardCount = numberOfDecks*52;
		this.logging = false;
		
		myLog(this.cardCount, this.logging);
		
	}
		//The funciton below responsible for removing one random card from the shoe.
		
	dealCard()
	{
		this.cardCount--;
		
		myLog("There are "+this.cardCount+" cards in the deck.", this.logging);
		
		//This makes sure, that a random element is removed from the deck
		//It always checks the length of the deckCards, so it won't create a random number bigger than the deck's actual siz,
		//thus throwing an error.
		
		var randElement = Math.floor(Math.random()*this.deckCards.cards.length);
		var removedElement = this.deckCards.cards.splice(randElement, 1);
		
		//It returns the removed card.
		
		return removedElement;
	}
	
	//This 12 line function is the brain of the dealer :)
	//As long as he doesn't have at least 17, he deals a card to himself.
	//Currently, it seems justifiable as according to the standing (on the page, at the bottom of the screen), 
	//the sum of all the games have been played using this site, the dealer is winning overall.
	//If it changes, it will be cleverer.
	//As a first step, it will only deal to himself, if he has a smaller hand than the other players.
	//Or he could deal card on soft 17.
	
	makesDecision()
	{
		//As mentioned above, depending on the cardSum (the dealer's hand's total), he will decide hit or stand.
		
		var cardSum = this.getCardSum();
		
		//If this value is smaller than 17, he will return hit.
		if(cardSum<17)
		{
		return "hit";
		} else if (cardSum<22)
		{
		return "stand";
		} else {
		this.lastAction = "busted";	
		return "busted";	
		}
	}
}
