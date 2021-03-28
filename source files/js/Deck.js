//The only purpose of this class is to create a Deck, which in real life would be called as a shoe (as it may consist of more than one decks).
//consisting of Cards which are instances of the Card class.
class Deck
{
	constructor(numberOfDecks)
	{
	//The following arrays and object contain the data needed for constructing one or more decks	
	
	//The suits are stored here.
	this.suits = ["diamonds","hearts", "clubs", "spades"];	 	 
	
	//This contains the value of each card in string format.	
		
	this.rank = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];	
	
	//Uncomment the line bleow for testing purposes only.
	//this.rank = ["6","6","6","6","6","6","6","Ace","Ace","Ace","Ace","Ace","Ace","Ace" ];	
	
	//The follwoing object contains the real, numberical value of the cards
	//The value of aces is regarded as 11, 
	//although, the favourable sum of cards is taken into account in each player's returnCardSum method.
	
	this.realRank=
	{
	//	"rank2":2, "rank3":3, "rank4":4, "rank5":5, "rank6":6, "rank7":7, "rank8":8, "rank9":9, "rank10":10, "rankJack":10,	"rankQueen":10, "rankKing":10, "rankAce":11};	 	       	  	 	        	      	   	
		"rank2":2, "rank3":3, "rank4":4, "rank5":5, "rank6":6, "rank7":7,
		"rank8":8, "rank9":9, "rank10":10, "rankjack":10,	"rankqueen":10, "rankking":10, "rankace":11
	};	
	
	//Filling up the deck (shoe) with "numberOfDecks" number of decks.	
	
	this.cards = new Array();
	
		//This loop does whatever is inside for "numberOfDecks" times (it is passed as a parameter in the constructor).
		
		for(var m = 0; m<numberOfDecks; m++)
		{	
			//This loop makes sure that each suit is done for each decks.

			for(var i = 0; i<this.suits.length; i++)
			{
				var currentSuit = this.suits[i];

				//And finally, this loop goes thorugh the rank array and creates cards with each rank, suit and the corresponding realValue
				//It basically constructs cards, using the Card class's constructor.
				
				for(var k =0; k<this.rank.length; k++)
				{
					var currentRank=this.rank[k];
					var currentRealRank = this.realRank["rank"+this.rank[k]];
					var temp = new Card(currentRank, currentRealRank, currentSuit);
					//console.log(temp);
					this.cards.push(temp);
				}
				
			}
		}
	}
}
	
	