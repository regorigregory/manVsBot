//The Bot class is a subclass of player. 
//It implements the functionalities a bot has to fulfill with regards to BlackJack

class Bot extends Player{
	
	constructor(numberOfDecks)
	{
		//The superclass's (player) constructor is called
		
		super("bot");
		
		//The displayname is overwritten
		
		this.displayName = "Bot";
		
		//The following two attributes play an important role in card counting
		
		this.realCount = 0;
		this.runningCount = 0;

		this.logging = true;
		
		//by defaut the minimum bet is 25 pouns
		
		this.minimumBet = 25;
		
		//The deckCount is relevant when calculating the realcount (the running count divided by the number of remaining cards)
		
		this.deckCount = numberOfDecks*52;
		
		//This is the betting strategy used to determine the multiplier of the minimum bet based on the realCount
		
		this.bettingStrategy = new Array();
		this.bettingStrategy[1] =1;
		this.bettingStrategy[2] =2;
		this.bettingStrategy[3] =4;
		this.bettingStrategy[4] =8;
		this.bettingStrategy[5] =12;
		
		//Initialising the first dimension of the basic and softhand strategy arrays
		//The dealer's upcard is the first index and the player's cards value in hand is the second index
		//It will have a significance in the "makesDecision" function
		
		this.basicStrategy = new Array();
		this.softHandStrategy = new Array();
		
		//Initialising the second dimension with a loop, otherwise adding the second dimension's indices wouldn't work
		
		for(var i = 2; i<12; i++)
		{
			this.basicStrategy[i]=new Array();
			this.softHandStrategy[i]=new Array();
		}
		
		//Populating the basic strategy table...it will be long
		
		this.basicStrategy[2][3]= "h";
		this.basicStrategy[2][4]= "h";
		this.basicStrategy[2][5]= "h";
		this.basicStrategy[2][6]= "h";
		this.basicStrategy[2][7]= "h";
		this.basicStrategy[2][8]= "h";
		
		//Depending on the number of decks, the value of this index varies
		
		this.basicStrategy[2][9]= (numberOfDecks==4)? "h": "dh";
		this.basicStrategy[2][10]= "dh";
		this.basicStrategy[2][11]= "dh";
		this.basicStrategy[2][12]= "h";
		this.basicStrategy[2][13]= "s";
		this.basicStrategy[2][14]= "s";
		this.basicStrategy[2][15]= "s";
		this.basicStrategy[2][16]= "s";
		this.basicStrategy[2][17]= "s";
		this.basicStrategy[2][18]= "s";
		this.basicStrategy[2][19]= "s";
		this.basicStrategy[2][20]= "s";
		this.basicStrategy[2][21]= "s";
		
		//dealer has 3
		
		this.basicStrategy[3][3]= "h";
		this.basicStrategy[3][4]= "h";
		this.basicStrategy[3][5]= "h";
		this.basicStrategy[3][6]= "h";
		this.basicStrategy[3][7]= "h";
		this.basicStrategy[3][8]= "h";
		this.basicStrategy[3][9]= "dh";
		this.basicStrategy[3][10]= "dh";
		this.basicStrategy[3][11]= "dh";
		this.basicStrategy[3][12]= "h";
		this.basicStrategy[3][13]= "s";
		this.basicStrategy[3][14]= "s";
		this.basicStrategy[3][15]= "s";
		this.basicStrategy[3][16]= "s";
		this.basicStrategy[3][17]= "s";
		this.basicStrategy[3][18]= "s";
		this.basicStrategy[3][19]= "s";
		this.basicStrategy[3][20]= "s";
		this.basicStrategy[3][21]= "s";
		
		//dealer has 4,5 or 6
		
		this.basicStrategy[4][3]= "h";
		this.basicStrategy[4][4]= "h";
		this.basicStrategy[4][5]= "h";
		this.basicStrategy[4][6]= "h";
		this.basicStrategy[4][7]= "h";
		this.basicStrategy[4][8]= "h";
		this.basicStrategy[4][9]= "dh";
		this.basicStrategy[4][10]= "dh";
		this.basicStrategy[4][11]= "dh";
		this.basicStrategy[4][12]= "s";
		this.basicStrategy[4][13]= "s";
		this.basicStrategy[4][14]= "s";
		this.basicStrategy[4][15]= "s";
		this.basicStrategy[4][16]= "s";
		this.basicStrategy[4][17]= "s";
		this.basicStrategy[4][18]= "s";
		this.basicStrategy[4][19]= "s";
		this.basicStrategy[4][20]= "s";
		this.basicStrategy[4][21]= "s";
		
		//dealer has 5
		
		this.basicStrategy[5][3]= "h";
		this.basicStrategy[5][4]= "h";
		this.basicStrategy[5][5]= "h";
		this.basicStrategy[5][6]= "h";
		this.basicStrategy[5][7]= "h";
		
		//Depending on the number of decks, the value of this index varies
		
		this.basicStrategy[5][8]= (numberOfDecks==1)?"dh":"h";//dh for 1
		this.basicStrategy[5][9]= "dh";
		this.basicStrategy[5][10]= "dh";
		this.basicStrategy[5][11]= "dh";
		this.basicStrategy[5][12]= "s";
		this.basicStrategy[5][13]= "s";
		this.basicStrategy[5][14]= "s";
		this.basicStrategy[5][15]= "s";
		this.basicStrategy[5][16]= "s";
		this.basicStrategy[5][17]= "s";
		this.basicStrategy[5][18]= "s";
		this.basicStrategy[5][19]= "s";
		this.basicStrategy[5][20]= "s";
		this.basicStrategy[5][21]= "s";
		
		//dealer has 6
		
		this.basicStrategy[6][3]= "h";
		this.basicStrategy[6][4]= "h";
		this.basicStrategy[6][5]= "h";
		this.basicStrategy[6][6]= "h";
		this.basicStrategy[6][7]= "h";

		//Depending on the number of decks, the value of this index varies
		
		this.basicStrategy[6][8]= (numberOfDecks==1)?"dh":"h";//dh for 1
		this.basicStrategy[6][9]= "dh";
		this.basicStrategy[6][10]= "dh";
		this.basicStrategy[6][11]= "dh";
		this.basicStrategy[6][12]= "s";
		this.basicStrategy[6][13]= "s";
		this.basicStrategy[6][14]= "s";
		this.basicStrategy[6][15]= "s";
		this.basicStrategy[6][16]= "s";
		this.basicStrategy[6][17]= "s";
		this.basicStrategy[6][18]= "s";
		this.basicStrategy[6][19]= "s";
		this.basicStrategy[6][20]= "s";
		this.basicStrategy[6][21]= "s";
		//dealer has 7 or 8
		this.basicStrategy[7][3]= "h";
		this.basicStrategy[7][4]= "h";
		this.basicStrategy[7][5]= "h";
		this.basicStrategy[7][6]= "h";
		this.basicStrategy[7][7]= "h";
		this.basicStrategy[7][8]= "h";
		this.basicStrategy[7][9]= "h";
		this.basicStrategy[7][10]= "dh";
		this.basicStrategy[7][11]= "dh";
		this.basicStrategy[7][12]= "h";
		this.basicStrategy[7][13]= "h";
		this.basicStrategy[7][14]= "h";
		this.basicStrategy[7][15]= "h";
		this.basicStrategy[7][16]= "h";
		this.basicStrategy[7][17]= "s";
		this.basicStrategy[7][18]= "s";
		this.basicStrategy[7][19]= "s";
		this.basicStrategy[7][20]= "s";
		this.basicStrategy[7][21]= "s";
		
		//dealer has 8
		
		this.basicStrategy[8][3]= "h";
		this.basicStrategy[8][4]= "h";
		this.basicStrategy[8][5]= "h";
		this.basicStrategy[8][6]= "h";
		this.basicStrategy[8][7]= "h";
		this.basicStrategy[8][8]= "h";
		this.basicStrategy[8][9]= "h";
		this.basicStrategy[8][10]= "dh";
		this.basicStrategy[8][11]= "dh";
		this.basicStrategy[8][12]= "h";
		this.basicStrategy[8][13]= "h";
		this.basicStrategy[8][14]= "h";
		this.basicStrategy[8][15]= "h";
		this.basicStrategy[8][16]= "h";
		this.basicStrategy[8][17]= "s";
		this.basicStrategy[8][18]= "s";
		this.basicStrategy[8][19]= "s";
		this.basicStrategy[8][20]= "s";
		this.basicStrategy[8][21]= "s";
		
		//dealer has 9
		
		this.basicStrategy[9][3]= "h";
		this.basicStrategy[9][4]= "h";
		this.basicStrategy[9][5]= "h";
		this.basicStrategy[9][6]= "h";
		this.basicStrategy[9][7]= "h";
		this.basicStrategy[9][8]= "h";
		this.basicStrategy[9][9]= "h";
		this.basicStrategy[9][10]= "dh";
		this.basicStrategy[9][11]= "dh";
		this.basicStrategy[9][12]= "h";
		this.basicStrategy[9][13]= "h";
		this.basicStrategy[9][14]= "h";
		this.basicStrategy[9][15]= "h";
		
		//Depending on the number of decks, the value of this index varies

		
		this.basicStrategy[9][16]= (numberOfDecks==4)? "rh": "dh";;
		this.basicStrategy[9][17]= "s";
		this.basicStrategy[9][18]= "s";
		this.basicStrategy[9][19]= "s";
		this.basicStrategy[9][20]= "s";
		this.basicStrategy[9][21]= "s";
		
		//dealer has 10
		
		this.basicStrategy[10][3]= "h";
		this.basicStrategy[10][4]= "h";
		this.basicStrategy[10][5]= "h";
		this.basicStrategy[10][6]= "h";
		this.basicStrategy[10][7]= "h";
		this.basicStrategy[10][8]= "h";
		this.basicStrategy[10][9]= "h";
		this.basicStrategy[10][10]= "h";
		this.basicStrategy[10][11]= "h";
		this.basicStrategy[10][12]= "h";
		this.basicStrategy[10][13]= "h";
		this.basicStrategy[10][14]= "rh";
		this.basicStrategy[10][15]= "rh";
		this.basicStrategy[10][16]= "rh";
		this.basicStrategy[10][17]= "s";
		this.basicStrategy[10][18]= "s";
		this.basicStrategy[10][19]= "s";
		this.basicStrategy[10][20]= "s";
		this.basicStrategy[10][21]= "s";
		
		//dealer has ace=11
		
		this.basicStrategy[11][3]= "rh";
		this.basicStrategy[11][4]= "rh";
		this.basicStrategy[11][5]= "rh";
		this.basicStrategy[11][6]= "rh";
		this.basicStrategy[11][7]= "rh";
		this.basicStrategy[11][8]= "h";
		this.basicStrategy[11][9]= "h";
		this.basicStrategy[11][10]= "h";
		this.basicStrategy[11][11]= "h";
		this.basicStrategy[11][12]= "rh";
		this.basicStrategy[11][13]= "rh";
		this.basicStrategy[11][14]= "rh";
		this.basicStrategy[11][15]= "rh";
		this.basicStrategy[11][16]= "rh";
		this.basicStrategy[11][17]= "rs"
		this.basicStrategy[11][18]= "s";
		this.basicStrategy[11][19]= "s";
		this.basicStrategy[11][20]= "s";
		this.basicStrategy[11][21]= "s";
		
		//Softhand strategy. This array is used when the player has at least one ace in his hand.
		
		//dealer has 2
		
		this.softHandStrategy[2][12]="h";
		this.softHandStrategy[2][13]="h";
		this.softHandStrategy[2][14]="h";
		this.softHandStrategy[2][15]="h";
		this.softHandStrategy[2][16]="h";
		
		//Depending on the number of decks, the value of this index varies
		
		this.softHandStrategy[2][17]=(numberOfDecks==1)?"dh":"h";
		this.softHandStrategy[2][18]="s";
		this.softHandStrategy[2][19]="s";
		this.softHandStrategy[2][20]="s";
		this.softHandStrategy[2][21]="s";
		
		//dealer has 3
		
		this.softHandStrategy[3][12]="h";
		this.softHandStrategy[3][13]="h";
		this.softHandStrategy[3][14]="h";
		this.softHandStrategy[3][15]="h";
		this.softHandStrategy[3][16]="h";
		this.softHandStrategy[3][17]="dh";
		this.softHandStrategy[3][18]="ds";
		this.softHandStrategy[3][19]="s";
		this.softHandStrategy[3][20]="s";
		this.softHandStrategy[3][21]="s";
		
		//dealer has 4
		
		this.softHandStrategy[4][12]=(numberOfDecks==1)?"dh":"h";
		this.softHandStrategy[4][13]=(numberOfDecks==1)?"dh":"h";
		this.softHandStrategy[4][14]="dh";
		this.softHandStrategy[4][15]="dh";
		this.softHandStrategy[4][16]="dh";
		this.softHandStrategy[4][17]="dh";
		this.softHandStrategy[4][18]="ds";
		this.softHandStrategy[4][19]="s";
		this.softHandStrategy[4][20]="s";
		this.softHandStrategy[4][21]="s";
		
		//dealer has 5
		
		this.softHandStrategy[5][12]="dh";
		this.softHandStrategy[5][13]="dh";
		this.softHandStrategy[5][14]="dh";
		this.softHandStrategy[5][15]="dh";
		this.softHandStrategy[5][16]="dh";
		this.softHandStrategy[5][17]="dh";
		this.softHandStrategy[5][18]="ds";
		this.softHandStrategy[5][19]="s";
		this.softHandStrategy[5][20]="s";
		this.softHandStrategy[5][21]="s";
		
		//dealer has 6
		
		this.softHandStrategy[6][12]="dh";
		this.softHandStrategy[6][13]="dh";
		this.softHandStrategy[6][14]="dh";
		this.softHandStrategy[6][15]="dh";
		this.softHandStrategy[6][16]="dh";
		this.softHandStrategy[6][17]="dh";
		this.softHandStrategy[6][18]="ds";
		
		//Depending on the number of decks, the value of this index varies
		
		this.softHandStrategy[6][19]=(numberOfDecks==1)?"ds":"h";
		this.softHandStrategy[6][20]="s";
		this.softHandStrategy[6][21]="s";
		
		//dealer has 7
		
		this.softHandStrategy[7][12]="h";
		this.softHandStrategy[7][13]="h";
		this.softHandStrategy[7][14]="h";
		this.softHandStrategy[7][15]="h";
		this.softHandStrategy[7][16]="h";
		this.softHandStrategy[7][17]="h";
		this.softHandStrategy[7][18]="s";
		this.softHandStrategy[7][19]="s";
		this.softHandStrategy[7][20]="s";
		this.softHandStrategy[7][21]="s";
		
		//dealer has 8
		
		this.softHandStrategy[8][12]="h";
		this.softHandStrategy[8][13]="h";
		this.softHandStrategy[8][14]="h";
		this.softHandStrategy[8][15]="h";
		this.softHandStrategy[8][16]="h";
		this.softHandStrategy[8][17]="h";
		this.softHandStrategy[8][18]="s";
		this.softHandStrategy[8][19]="s";
		this.softHandStrategy[8][20]="s";
		this.softHandStrategy[8][21]="s";
		
		//dealer has 9
		
		this.softHandStrategy[9][12]="h";
		this.softHandStrategy[9][13]="h";
		this.softHandStrategy[9][14]="h";
		this.softHandStrategy[9][15]="h";
		this.softHandStrategy[9][16]="h";
		this.softHandStrategy[9][17]="h";
		this.softHandStrategy[9][18]="h";
		this.softHandStrategy[9][19]="s";
		this.softHandStrategy[9][20]="s";
		this.softHandStrategy[9][21]="s";
		
		//dealer has 10
		
		this.softHandStrategy[10][12]="h";
		this.softHandStrategy[10][13]="h";
		this.softHandStrategy[10][14]="h";
		this.softHandStrategy[10][15]="h";
		this.softHandStrategy[10][16]="h";
		this.softHandStrategy[10][17]="h";
		this.softHandStrategy[10][18]="h";
		this.softHandStrategy[10][19]="s";
		this.softHandStrategy[10][20]="s";
		this.softHandStrategy[10][21]="s";
		
		//dealer has 11
		
		this.softHandStrategy[11][12]="h";
		this.softHandStrategy[11][13]="h";
		this.softHandStrategy[11][14]="h";
		this.softHandStrategy[11][15]="h";
		this.softHandStrategy[11][16]="h";
		this.softHandStrategy[11][17]="h";
		
		//Depending on the number of decks, the value of this index varies
		
		this.softHandStrategy[11][18]=(numberOfDecks==1)?"s":"h";
		this.softHandStrategy[11][19]="s";
		this.softHandStrategy[11][20]="s";
		this.softHandStrategy[11][21]="s";
	}
	
	countCards(card)
	{
		//The last removed card is passed to this function as a parameter
		//It's realValue, which is the numerical value of it, is used to make a decision
		
		var cardValue = card.realValue;
		
		//The bot's internal card count is decremented before the calculation
		
		this.deckCount--;
		
		//The essence of the "Hi-Lo" card counting sytem is the following 5 lines
		
		if(cardValue<7){
			this.runningCount +=1;
		} else if(cardValue>9){
			this.runningCount-=1;
		}
		
		
		//The running count has to be corected with the number of decks, thus resulting in the real count
		
		this.realCount =this.runningCount/(this.deckCount/52);
		
		//This line can be used for debugging purposes.
		//This logging is turned off as it is disturbing when running the simulation with 7 bots.
		//myLog(this.displayName+" counts: "+this.realCount, this.logging);
	}
	
	makesBet()
	{
		
		//The bot makes bet based on the running count. A rounded value is used.
		//The betting strategy can be found here:https://www.888casino.com/blog/sites/newblog.888casino.com/files/inline-images/HowMuchToBet_Table.png
		
		var roundedRealCount = Math.round(this.realCount);
		
		var multiplicator = 0;
		
		
		//The following if statement decides the bet multiplier by passing the roundded realCount to the bettingStrategy array.
		//This array corresponds to the betting strategy table linked above.
		//Each index (which is the realcount) contains the corresponding betting multiplier.
		//An if statement used to avoid calling indices which does not exist (e.g. 6).
		
		
		if (roundedRealCount<=1)
		{
			multiplicator = this.bettingStrategy[1];
		} else if(roundedRealCount>5)
		{
			multiplicator = this.bettingStrategy[5];
		} else 
		{
			multiplicator = this.bettingStrategy[roundedRealCount];
		}
		
		//Then the betAmount is determined by multiplying the minimumBet with the multiplicator determined above.
		
		var betAmount = multiplicator*this.minimumBet;
		//The bet is also removed from the balance, it is handled internally, compared to the player's balance which is handled inside the game.
		this.currentBet = betAmount;
		this.balance -=betAmount;	
	}
	
	sitsOut()
	{
		//This decides when the bot sits in or sits out...
		//Currently, it will sit out, if the realCount is -5
		//Uncomment the line below if testing...
		//return true;//for debugging purposes...
		if(this.realCount<-5){
			return true;
		} else {
			return false;
		}
	}
	
	makesDecision(myDealer)
	{
		
		//The brain of the bot.
		
		//Logging is turned of by default.
		
		myLog(this.displayName+" object's status:", this.logging);
		myLog(this, this.logging);
		
		//In order to find the appropriate action from the basic strategy (https://wizardofodds.com/games/blackjack/strategy/calculator/)
		//The dealer's upcard and the value of the cards of the player is needed.
		
		var dealerCardValue = myDealer.cards[0].realValue;
		var selfValue = this.getCardSum();
		
		//Initialising the returnDecision outside the if statement's scope.
		var returnDecision ="";
		
		
		//Do I need this anymore?
		if(selfValue>21)
		{
			this.lastAction = "busted";
			
			//The rest of the code won't be executed, therefore the return and also, a return value is needed for the nextPlayer fucntion
			
			return "busted";
		}
		
		var decision="";
		
		//The first branch of this if statement is used to determine whether the bot should go for the softHand strategy 
		//Currently, he goes for it only if he has two cards in his hands an either on of them is an ace
		//However, it would make more sense, do make him go for the softhand strategy regardless of the cards number in hand, as long as he has one ace which is counted as 11
		//It will be implemented during the next "iteration" :)
		
		if(this.cards.length ==2 && ((this.cards[0].realValue==11 && this.cards[1].realValue!=11) || (this.cards[0].realValue!=11 && this.cards[1].realValue==11)))
		{
			decision = this.softHandStrategy[dealerCardValue][selfValue];
			
			//Logging, again, for debugging purposes.
			
			myLog(this.displayName+" decides to go for the softhand strategy.", this.logging);
			myLog(this.displayName+" decision returned:"+decision, this.logging);
			myLog("Dealer's hand value:"+dealerCardValue, this.logging);
			myLog("Self hand value:"+selfValue, this.logging);
			
		} else 
		{
			decision = this.basicStrategy[dealerCardValue][selfValue];
			
			//Logging, again, for debugging purposes
			
			myLog(this.displayName+" decides to go for the normal strategy.", this.logging);
			myLog(this.displayName+" decision returned:"+decision, this.logging);

		}
		//The following if statement serves two purposes:
		//1: it converts the returned decision to a form (like "h" becomes "hit"), which can be used in the nextPlayer function
		//2: decides wether the bot can surrender or double down when 
		//rh, dh...etc. is returned. "rh" for instance, stands for "surrender or hit", but surrender is only allowed
		//straight after the first two cards are dealt.
		//The round the player is in decided by the lengths of the cards array. If it is 2, then it is the first round.
		
		if(decision == "h")
		{
			
			returnDecision = "hit";
			
		} else if (decision == "s")
		{
			
			returnDecision = "stand";
			
		} else if (decision == "dh")
		{
			//alert("dh"+this.cards.length);
			if(this.cards.length==2)
			{
				
				returnDecision = "doubleIt";
			} else 
			{
				
				returnDecision ="hit";
			}
			
		} else if (decision == "ds")
		{
			//alert("dh"+this.cards.length);
			if(this.cards.length==2)
			{
				
				returnDecision = "doubleIt";
			} else 
			{
				
				returnDecision ="stand";
			}
			
		} else if (decision =="rh")
		{
			//alert("rh"+this.cards.length);
			if(this.cards.length==2)
			{
				returnDecision ="surrender";
			} else 
			{
				returnDecision ="hit";
			}
		}  else if (decision =="rs")
		{
			
			if(this.cards.length==2)
			{
				returnDecision ="surrender";
			} else 
			{
				returnDecision ="stand";
			}
		}	
		return returnDecision;	
	}	
}
