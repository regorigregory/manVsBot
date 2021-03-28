<!DOCTYPE html>
<html>
	<head>
		<title>Simulations - Man Vs Robots in blackjack</title>
		<meta name="author" content="Gergo Endresz">
		<meta charset="UTF-8">
		<meta name="description" content="A site aiming to conduct blackjack simulations">
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
		<!-- including the menu -->		
		<?php
		 include("navigation.php");
		?>
			
			<div id="content">
					<div class="outer blue section">
						<div class="inner">
						<h3> What is this page about?</h3>
						<p>
						Here you can run any number of simulations played by bots(players) against the dealer.
						</p>
						<h3>A few words about the simulations</h3>
						<p> 
						The site is still under development. This means while it is hoped to be bug free, 
						some features have not been implemented.
						One such feature is logging. The site currently <strong>logs</strong> the happenings of each round 
						<strong>to the JavaScript console.</strong>
						Obviously it is not the most user friendly way, but the demonstrate functionality and help along error checking 
						it is thought to suffice.
						If you can't resist the temptation,
						I can tell you that it can be displayed when using google Chrome by pressing ctrl+shift+i keys simultaneously.
						If you are using a different browser, google it (javascript console are the keywords).
						</p>
						<h3>Settings:</h3>
						<ul>
							<li>
								You can set how many decks the simulation will run with (1-4)
							</li>
							<li>
								You can also decide the number of players at the table (1-7)
							</li>
							<li>
								You can set the number of simulated rounds.
							</li>
							<li>
								Logging to console: this feature logs the most important happening of each round to the javascript console.
								If turned on, it can make the browser unresponsive for some time depending on the number of  simulated rounds decided.
							</li>
							<li>
								Simulation type: by default it is basic strategy. This means that every player(bot) will use 
								the strategy which can be found <a target="_blank" href="https://wizardofodds.com/games/blackjack/strategy/calculator/">here.</a></br>
								If you decide to go for "user defined", you can devise your own basic strategy and run it against the dealer. </br>
								If you choose to have some extra bots along you (more than 1 player), they won't use your strategy. 
								As a result, you can test how your bot performs 
								compared to others who stick to the basic strategy mentioned above.
							</li>
						</ul>
						<h3>About the game</h3>
							<ul>
								<li>
									Splitting is not allowed
								</li>
								<li>
									If the player's and the dealer's cards have the same value (push), the player gets back his bet, doesn't loose money.	
								</li>
								<li>
									Double is allowed against any dealer upcard.
								</li>
								<li>
									The dealing of the cards is not rotated. It means that always the first player gets cards first, and the dealer is the last.
								</li>
							</ul>
						</div>
					</div>	<!-- section end -->
				
					<div class="outer red section" id="simulation" >
						<div class="inner">
							<div class="simulationContainer">
							
								<!-- select the number of decks -->
								
								<div id="selectNumberOfDecks" class="simulationFormElement">	
									<h3> Number of decks</h3>

									
									<select name="numberOfDecks" id="numberOfDecks">
										<option value="1">1 deck</option>
										<option value="2">2 decks</option>
										<option value="3">3 decks</option>
										<option value="4">4 decks</option>
									</select>
								</div>
								
								<!-- select the number of decks -->
								
								<div id="selectNumberOfPlayers" class="simulationFormElement">		
									<h3> Number of players </h3>
									
									<select name="numberOfPlayers" id="numberOfPlayers">
										<option value="1">1 player</option>
										<option value="2">2 players</option>
										<option value="3">3 players</option>
										<option value="4">4 players</option>
										<option value="5">5 players</option>
										<option value="6">6 players</option>
										<option value="7">7 players</option>
									</select>
								</div>
								
								<!-- select the number of simulated rounds -->
								
								<div id="selectNumberOfRounds" class="simulationFormElement">		
									<h3> Number of rounds </h3>
									<input id="numberOfRounds" type="number" min="1" max="100000" value="1"/>
								</div>
								
								<!-- turning the logging on and off -->
								
								<div id="selectLogSwitch" class="simulationFormElement">		
									<h3> Logging to console*</h3>
									<input type="checkbox" id="logSwitch" value="true"/> Logging (on/off)
									<p>*It might freeze your computer for a while.</p>
								</div>
								
								<!-- select the ntype of the simulation i.e.:just bots, or one user defined bot and normal bots -->
								
								<div id="selectSimulationType" class="simulationFormElement">
									<h3>Simulation type:</h3>
									<select name="selectType" id="selectType">
										<option value="default">Basic strategy</option>
										<option value="userDefined">User defined</option>
									</select>
									<p>If "user defined" scroll down.</p>	
								</div>
								
								<!-- big red button: starts the simulation -->
								
								<div id="runTheSim" class="simulationFormElement">
												<button id="simulationTrigger">Run simulation*</button>
												<br/>
												*You will be alerted when it has been done.

								</div>
								
								<div class="clear"></div>
							</div> <!-- main control elements container end -->
						</div>
						
						<!-- if the type selected is "user defined", the user can devise his own "basic strategy" in the table below -->
						
						<div class="outer blue section" id="simulationSettings">
							<div class="inner">
							
								<div id="userDefined">
								
								<!-- selecting which action to add to the table -->
								
									<div id="selectActionContainer">
										<h4> How to tailor the bot's strategy using the table below?</h4>	
										<p> You can edit the table by selecting the action from the dropdown below 
										and then simply click on a table cell. By default, 
										it is "hit" for every screnario, so in order to change a cell's content, 
										you have to select an action other than "hit".
										</p>
										<p>
										<strong> A little explanation about the table:</strong>
										The horizontal headings mean the dealer's upcard. The vertical 
										lines (rows) mean the player's cards value in hand.
										
										<br/>
										For the sake of the argument, let's say the dealer has an upcard of 2, 
										and the player has Jack (10) and an Ace (11), making his sum equal 21. <br/>
										Then, in order to set what action the bot takes in this case, the first column's last cell (21) 
										has to be edited.
										</p>
										<p>										
										<strong> Softhand strategy:</strong>
										This table is aimed to give control over those scenarios, when the player has an ace and another card in 
										his hand.
										This is a special case, as the aces' value is calculated based on the most beneficial case to the player.
										Acknowledging this, anybody can see, 
										that this gives a little edge to the bot as 
										he won't get busted even if he has 21 and asks for an additional card,
										because the ace becomes 1, straight after the third card has been dealt.
										</p>
										
										<h4> Select the action you want to add to the table below</h4>
										
										<select name="selectAction" id = "selectAction">
											<option value="h"/> Hit </option>
											<option value="s"/> Stand</option>
											<option value="r"/> Surrender</option>
											<option value="d"/> Double </option>
											<option value="rh"/> Surrender, otherwise hit </option>
											<option value="rs"/> Surrender, otherwise stand </option>
											<option value="dh"/> Double, otherwise hit </option>
											<option value="ds"/> Double, otherwise stand </option>
										</select>		
									</div>
									
									<!-- The table for the normal basic strategy -->
									
									<div id="table_1" class="strategyTable">
										<table>
											<thead>
												<tr>
													<th colspan="11">
													Normal strategy
													</th>
												</tr>
											</thead>
											
											<tbody>
											<?php
											$columns = [2,3,4,5,6,7,8,9,10,11];
											$rows = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
											$output="";
											
											//outputting horizontal table header
											
											$output .= "<tr>";
											$output .= "<td>&nbsp;</td>";
												foreach($columns as $v)
												{
													$output .= "<td class='label'>".$v."</td>";
												}
												
											$output.= "</tr>";
											echo $output;
											
											//outputting vertical table header	
											
											foreach($rows as $v)
											{
												
												$output = "<tr>";
												$output .= "<td class='label'>".$v."</td>";
												
												for($i=0; $i<count($columns); $i++)
												{
													$output .="<td class='editable h'>h</td>"; 	
												}
												
												$output .="</tr>"; 
												echo $output;	
											}
											?>
											</tbody>
										</table>
									</div>
									<!-- softhand strategy table -->
									<div id="table_2" class="strategyTable">
										<table>
											<thead>
												<tr>
													<th colspan="11">
													Softhand strategy
													</th>
												</tr>
											</thead>
											
											<tbody>
											<?php
											$columns = [2,3,4,5,6,7,8,9,10,11];
											$rows = [12,13,14,15,16,17,18,19,20,21];
											$output="";
											//outputting table header
											$output .= "<tr>";
											$output .= "<td>&nbsp;</td>";
												foreach($columns as $v)
												{
												$output .= "<td class='label'>".$v."</td>";
												
												}
											$output.= "</tr>";
											echo $output;
											//outputting row header
											foreach($rows as $v)
											{
												$output = "<tr>";
												$output .= "<td class='label'>".$v."</td>";
											//outputting rows	
												for($i=0; $i<count($columns); $i++)
												{
													$output .="<td  class='editable h'>h</td>"; 
		
												}
											
											$output .="</tr>"; 
											echo $output;	
												
											}
											
											?>
											</tbody>
										</table>
									</div>
								<!-- table legend -->	
									<div class="strategyTable">
										<ul>
											<li> 
												<strong>Legend:</strong>
											</li>
											<li class="h"> 
											h: hit 
											</li>
											<li class="s">
											s: stand 
											</li>
											<li class="rh">
											rh: Surrender if possible, otherwise hit 
											</li>
											<li class="rs"> 
											rs: Surrender if possible, otherwise stand 
											</li>
											<li class="dh">
											dh: Double if possible, otherwise hit 
											</li>
											<li class="ds">
											ds: Double if possible, otherwise stand 
											</li>
										</ul>
									</div>
								</div>
							</div> 	
						</div><!-- settings section end -->
						<div id="simulatioinResults" >
							<div class="closeIt">
								<button id="closeIt">X</button>
								
							</div>
							<div id="resultsToDelete"></div>
						</div>
					</div><!-- outer section end -->
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
				</div>	
			</div>
		</div><!-- main container end --> 		 
		<script type="text/javascript" src="./js/Card.js"></script>  
		<script type="text/javascript" src="./js/Deck.js"></script>    
		<script type="text/javascript" src="./js/Player.js"></script>  
		<script type="text/javascript" src="./js/Dealer.js"></script>  
		<script type="text/javascript" src="./js/Bot.js"></script>
		<script type="text/javascript" src="./js/Output.js"></script> 
		<script type="text/javascript" src="./js/ajaxFunctions.js"></script> 
		<script type="text/javascript" src="./js/Simulation.js"></script>
		<script type="text/javascript" src="./js/simulationUI.js"></script>																										
	</body>
</html>