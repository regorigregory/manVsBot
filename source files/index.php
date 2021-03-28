<!DOCTYPE html>
<html>
	<head>
		<title>Game - Man Vs Robots in blackjack </title>
		<meta name="author" content="Gergo Endresz">
		<meta charset="UTF-8">
		<meta name="description" content="A site aiming to conduct an experiment thus educating gamblers...">
		<meta name="keywords" content="HTML, CSS, Javascript, PHP, BLackjack, Basic Strategy, Card counting">
		<link rel="stylesheet" href="./style.css" />
		<!--facebook markup-->
		<meta property="og:url"           content="http://localhost/finalProject/" />
		  <meta property="og:type"          content="website" />
		  <meta property="og:title"         content="Man vs Bot - A Blackjack experiment" />
		  <meta property="og:description"   content="This site aims to unravel whether card counting and basic strategyt can be beneficial for a player." />
		  <meta property="og:image"         content="http://localhost/finalProject/images/you.png" />

	</head>
	
	<body>
		<div id="container" class="white">
			<div id="fb-root"></div>
				<script>(function(d, s, id) {
				  var js, fjs = d.getElementsByTagName(s)[0];
				  if (d.getElementById(id)) return;
				  js = d.createElement(s); js.id = id;
				  js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12';
				  fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
				</script>
			<!--including the menu from a separete php file -->	
			<?php include ("navigation.php");?>
			<!--The main container -->
			<div id="content">
				<div class="outer blue first section" id="whatIsThis">
					<div class="inner">
						<h1>What is this site?</h1>
						<p>
						Have you ever heard about the game Blackjack?
						Well, according to mathematicians, 
						the dealer has an edge over the players and his balance will always be positive in the long run.
						As a result, playing blackjack is not a profitable activity.<br/> 
						This site aims to find it out whether it is true or not.
						</p>
						<p>
						A few tips:according to the mathematicians mentioned above, it is the best to stick to the 
						<a href="#basicStrategy">basic strategy</a>, if we don't want to lose our money asap. 
						This is a table telling the best course of action relative to the dealer's upcard in every scenario.
						</p>
						<p>
						And how about 
						<a href="#cardCounting">card-counting?</a> <br/>
						Again, according to the aforementioned scientists, card-counting can actually give a mathematical edge
						over the dealer thus making playing Blackjack a financially profitable way of earning some money.
							
						</p>
						<p>
						Or is there another way to rip off the dealer? Well, to answer the question, you have to play using your best strategy.
						This site aims to find out the truth. You will have a bot player playing along with you at the table.
						Whenever a game's been concluded, the current balance of each player (whether it is positive or negative) is saved to the database 
						thus making the progress trackable and a conclusion drawable.</br>
						The participants of this game are:<br/>	
						</p>
						<ul>
							<li>
								<a href="#theBot">The Bot</a>
							</li>				
							<li>
								<a href="#theDealer">The Dealer<a/>
							</li>				
							<li>
								<a href="#you">You</a>
							</li>	
						</ul>					
						</p>
						
					
					</div>
				</div>  <!--section end-->
				
				<div class="outer orange section" id="theDealer">
					<div class="inner">
						<div class="col-50">
							<h2>The Dealer</h2>
							<p>
							The dealer in this version of Blackjack (and as far as I know in real life as well) works in a very simple way.
							As long as he doesn't have at least 17, he will deal a card for himself.
							In this version, the dealer won't deal for himself on "soft 17" (when there is an ace and a 6 in his hand) 
							thus making the chances of players increase.
							</p>
						</div>
						<div class="col-50">
							<img src="./images/dealer.png" />			
						</div>
					</div>
				</div> <!--section end-->
				<div class="outer white section" id="theBot">
					<div class="inner">
						<div class="col-50">
							<h2>The Bot</h2>
							<p>
							This Bot decides exclusively relying on the <a href="#basicStrategy">basic strategy</a> 
							and selects the bet amount based on the  <a href="#cardCounting">"true card count"</a> 
							and the betting strategy suggested by 888 Casino at 
							<a target="_blank" href="https://www.888casino.com/blog/sites/newblog.888casino.com/files/inline-images/HowMuchToBet_Table.png">here</a>.
							If he thinks that the card-count is not favourable for him, he can decide to sit out and have a booze as long as it doesn't turn favourable.	
							</p>
						</div>	
						
						<div class="col-50">
							<img src="./images/bot.png" />			
						</div>
						
					
					</div> <!--section end-->
				</div>
				
				<div class="outer red section" id="you">
					<div class="inner">
						<div class="col-50">
							<h2>You</h2>
							<p>
								You should and must use any cunning means to defeat the dealer.	
								You can count the cards, if you want, ask a fortune teller 
								about the probability of getting ace and king for the next hand, whatever. Your only aim is to protect mankind's honour.	
							</p>
						</div>	
						
						<div class="col-50">
							<img src="./images/you.png" />			
						</div>
						
					
					</div> <!--section end-->
				</div>
				<div class="outer orange section" id="basicStrategy">
					<div class="inner">
					<h2>Basic strategy</h2>
					<p>
					The basic strategy is a chart, which tells the player what course of action to take relative to the dealer's upcard
					in every scenario.
					These actions are based on the probability of the most favourable outcome for the player.
					But to be honest, tt may play out in maths, but reality does not always reconcile with it.
					Everybody knows that the probability of a coin landing on either of its side is 50% when flipping it.
					However, in real life, it rarely happens. It is easy to imagine that the deviation, when there are 52, 
					104 or even more cards in the deck, is much larger.
					The basic strategy used by the bot can be 
					found <a target="_blank" href="https://wizardofodds.com/games/blackjack/strategy/calculator/">here</a>.<br/>
					A little explanation: the chart's heading is the dealer's upcard. To get the action to take, one has to select the column
					according to the dealer's upcard. Then, the row is determined by the players card value sum. So if he has a 10, and a six, it means, he has to select the 16th row.
					Whatever cell is in the intersection of the selected column and row, that is the action the player should go for.
					</div>
				</div> <!--section end-->
				
				<div class="outer blue section" id="cardCounting">
					<div class="inner">
						<h2>What is card counting?</h2>
						<p>
						This is what the "rainman" did, right? Well, yes, and no.
						To count cards, you don't have to be a math genious. To be honest, it's is quite simple, 
						and with practice, can be easily mastered.
						The card-counter only has to be "attentive", when it comes to dealeing cards at the table, nothing more is needed.
						</p>
						<p>
						It is important to ponint out, that there are different ways of counting cards, and this site, or to be more accurate, the bot of this site
						uses the so called 
						<a target="_blank" href="https://www.888casino.com/blog/blackjack-strategy-guide/blackjack-card-counting">"Hi-Lo" 
						card counting</a>  system.
						In this system, every card has a value between 1 and -1.
						</p>
						<ul>
							<li>
							Cards from 2 to 6, has a value of +1
							</li>
							<li>
							Cards from 7 to 9, has a value of 0
							</li>
							<li>
							Cards from 10 to Ace, has a value of +1
							</li>
						</ul>
						<p>
						Whenever a new card is dealt, its value is added to the running count.
						In practice, before the dealer starts dealing, the running sum is 0. If he deals a king, it becomes 1(0+1=1).<br/>
						Then, let's say, he deals a 7. 7 has 0 value, so it stays the same (1+0=0). If the next card is 2, then it becomes 0 again (1-1=0).
						</p>
						<h2> How does the card counter benefit from this?</h2>
						
						<ul>
							<li>
							Firstly, when the deck is richer in high cards (10 to ace) he is more likely to be dealt blackjack.
							</li>
							<li>
							Secondly, the dealer is more likely to bust.
							</li>
							<li>
							Thirdly, knowing the card count, the player knows 
							before the first card is dealt that how likely he is to win the round. 
							Therefore, he can decide to bet accordingly.
							</li>
						</ul>
						<p>
						The benefits of card counting are discussed in details 
						<a target="_blank" href="https://www.888casino.com/blog/blackjack-strategy-guide/blackjack-card-counting">here</a>.
						The betting strategy used by the "bot", can be found 
						<a target="_blank" href="https://www.888casino.com/blog/sites/newblog.888casino.com/files/inline-images/HowMuchToBet_Table.png">here</a>.
						</p>
						<p>
						These, in theory, give the card-counter a little edge over the dealer,
						thus making the game, blackjack a little bit less of gambling.
						</p>
								
					</div>
				</div><!--section end-->
				
				<div class="outer orange section" id="theGame">
					<div class="inner">
						<h2>The BlackJack version you can play here</h2>
						<p>
						The game can be started having selected the deck size and clicking on the button which can be found on the right in the red semi circle.
						</p>
						<ul>
							<li>
								Currently, splitting is not allowed. It was thought to increase the edge of the players over the dealer unfairly.
							</li>
							<li>
								There's no credit limit, but as soon as the first bet is made, that is deducted from the starting balance (which is 0).
							</li>
							<li>
								If the player pushes, he doesn't lose his bet, but gets it back.
							</li>
							<li>
								There is no round rotation. Whatever postion a player has (frist, second), it will remain the same in every round.
							</li>
							<li>
								The dealer stands on soft 17. It means that he won't deal a card for himself when he has an ace and a 6.
								It improves the chances of players, as he could deal without risking getting busted,
								as aces are counted as either 1 or 11 according to whether the player would get busted, or not.
							</li>
							<li>
								Doubling up is allowed on any dealer upcard.
							</li>
							<li>
								The player can decide whether he wants to play with 1 or 2 decks. 
								4 decks might be introduced later on. It is currently assumed that a visitor won't spend hours at this site, 
								thus making the bot's chances to get a favourable true-count smaller. 4 decks would make it even less probable.
							</li>
							<li>
								Each player's current balance is displayed at the bottom of the page. The in game balance is also displayed on the 
								table to give the opportunity the user to assess his strategy's successfullness.
							</li>
						</ul>
					</div>
				</div><!--section end-->
				<div class="outer grey section" id="letsPlay">
					<div class="inner">
						<div class="gameContainer">
							<h3>Click on "Let's play" on the right to start the game</h3>

							<div id="statusHeader" class="gameHeader left">
							Game area
							</div>
							<div id="gameHeader" class="gameHeader right">
							Game updates
							</div>
							
							<svg id="gameArea" width="698" height="550" version="1.1"
								xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
							</svg>
							<div id="statusFeed">
							
							</div>
							
						</div>
					</div>
				</div> <!--section end-->
					
				<div class="outer" id="footer">
					<div id="footer_inner">
						<span>
							<span>
								1 deck: humans: 
								<span class="standingValue" id="playerStanding_1"></span> | 
							</span>
						</span>
						<span>
							<span>
								bot: 
								<span  class="standingValue" id="botStanding_1"></span> |  
							</span>
						</span>
						<span>
							<span>
							dealer: 
							<span  class="standingValue" id="dealerStanding_1"></span> 

							</span>
						</span>	
						<span>
									&nbsp;&nbsp; <span class="huge">|</span>&nbsp;&nbsp; 
						</span>
						<span>
							<span>
								2 decks: humans: 
								<span class="standingValue" id="playerStanding_2"></span> | 
							</span>
						</span>
						<span>
							<span>
								bot: 
								<span  class="standingValue" id="botStanding_2"></span> | 
							</span>
						</span>
						<span>
							<span>
							dealer: 
							<span  class="standingValue" id="dealerStanding_2"></span> 

							</span>
						</span>	
					</div>
				</div> <!--footer end-->
				
			</div>
			<div id="actionBlock">
				<div id="actionBlockInner">
					<h4>Settings</h4>

					<div id="selectorDiv">
						<select name="numberOfDecks" id="numberOfDecksSelector">
							<option value="1">1 Deck</option>
							<option value="2">2 Decks</option>
						</select>
					</div>
					<div id="letsPlayDiv">
						<button id="letsPlayButton" onclick="startGame()" title="click here to start the game"> Let's play </button>
					</div>
					<br/>
					<div class="fb-like" data-href="http://bitseverywhere.co.uk/finalProject" data-layout="box_count" data-action="like" data-size="small" data-show-faces="false" data-share="true">
					</div>
				</div>
			</div> <!--red semi-circular element end-->
			
		</div>  <!--main container end-->
		<!-- scripts included -->
		<script type="text/javascript" src="./js/Card.js"></script>  
		<script type="text/javascript" src="./js/Deck.js"></script>    
		<script type="text/javascript" src="./js/Player.js"></script>  
		<script type="text/javascript" src="./js/Dealer.js"></script>  
		<script type="text/javascript" src="./js/Bot.js"></script>
		<script type="text/javascript" src="./js/Output.js"></script> 
		<script type="text/javascript" src="./js/ajaxFunctions.js"></script> 
		<script type="text/javascript" src="./js/Game.js"></script>
		<script type="text/javascript" src="./js/Main.js"></script>

	</body>
</html>