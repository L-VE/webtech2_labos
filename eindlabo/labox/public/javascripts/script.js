// GLOBALE VARS
var messageId = 0;
var client = null;
var indexPagePath = "";
var maxRandomIdGenerator = 589;
// DOCUMENT READY
// ----------------------------------------------------------------
$(document).ready(function (e){

	window.onresize=function()	{
		if($(window).width() > 700)
		{
			if( $("#rightSide").hasClass("moveUp") )
			{
				$("#rightSide").removeClass("moveUp");
				//$("#leftSide").removeClass("moveUp");
			}
		}
	};


    // CHECKEN OF ER AL POSTS ZIJN, INDIEN WEL DAN WORDEN ZE GETOOND
    // INDIEN NIET DAN WORDT ER GEZEGD DAT ER NOG GEEN POSTS ZIJN
	checkIfThereArePosts();
	

// wanneer er op het user icoontje geklikt wordt
// schuift het uitlog menu'tje van recht uit
// en kruipt weer op zijn plaats als er nog eens op geklikt wordt
/*	$("#accountPic").on('click', function (argument){
		showLogoutSidebar()
	});

	$("#accountPicMod").on('click', function (argument){
		showLogoutSidebar()
	});

*/

	// WANNEER ER OP DE SENDMESSAGE HEADER GEKLIKT WORDT, ENKEL WANNEER
	// HET SCHERM KLEINER IS DAN 700PX (WANT DAN VERANDERT DE LAYOUT OOK)
	// DAN SCHUIFT DEZE NAAR BOVEN OF BENEDEN ADHV CSS ANIMATIONS
	$(".questionHeader").on('click', function (argument){
		if($(window).width() <= 700)
		{
			if(/*$("#rightSide").hasClass("moveUp") &&*/ $("#rightSide").hasClass("moveUp") )
			{
				$("#rightSide").removeClass("moveUp");

				if($(".errorMessage").css("display") == 'block' && $(window).width() <= 700)
				{
					$("#rightSide").height(175);
				}
				//$("#leftSide").removeClass("moveUp");
			}
			else
			{
				$("#rightSide").addClass("moveUp");
				//$("#leftSide").addClass("moveUp");
			}
		}
	});


	// WANNEER ER OP DE "LOGIN AS ADMIN" GEKLIKT WORDT
	// DAN WORDT ER EEN POST GEDAAN NAAR "/LOGINMOD/ADMINUSERNAME/ADMINPASSWORD"
	// WANNEER DE ADMIN SUCCESVOL IS INGELOGD DAN WORDT HIJ DOORVERWEZEN NAAR DE ADMIN PAGINA
	// WANNEER NIET SUCCESVOL DAN WORDT ER EEN FOUTBERICHT GETOOND ADHV VAN ER FOUT GING
	$("#modLogin").on('click', function (argument){
		
		var username = $("#username").val();
		var password = $("#password").val();
		$(".errorMessage").text("") ;
    	$(".errorMessage").css('display','none');
		if(username != "" && password != "")
		{
			 var request = $.ajax({ 
								type: "POST", // GET or POST
								url: "/loginMod/" + username + '/' + password,
								dataType: "json",
								error: function( xhr, status ) {
									//console.log("Kon de actie niet uitvoeren.");
									$(".errorMessage").text("You didn't fill in the correct login!") ;
    								$(".errorMessage").css('display','block');
									argument.preventDefault();
								 }, // the file to call
								success: function(response) { // on success..
									//showAbsences();
									//humane.log("Was een succes!");
									//console.log(JSON.stringify(response));
									$(".errorMessage").text("") ;
    								$(".errorMessage").css('display','none');
									argument.preventDefault();
									// WANNEER JUIST IS INGELOGD KRIJGEN WE VAN DE SERVER EEN TRUE BERICHT EN 
									// GAAN WE DOOR NAAR DE VOLGENDE PAGINA
									// BIJ FALSE WORDT ER EEN GEPASTE FOUTBOODSCHAP GETOOND
									if(JSON.stringify(response) == "false")
									{
										$(".errorMessage").text("You didn't fill in the correct login!") ;
    									$(".errorMessage").css('display','block');
									}
									else
									{
										$(".errorMessage").text("Y") ;
    									$(".errorMessage").css('display','none');
    									 $("#username").val("");
										$("#password").val("");
										var currentPath = $(location).attr('href');
										var toGoPath = "";
										if($("#wholeContainer").hasClass("moderatorAccount"))
										{
											
											toGoPath = currentPath.substr(0,currentPath.indexOf('moderator'));
										}
										else
										{
											toGoPath = currentPath.substr(0,currentPath.indexOf('ask'));
										
										}
										indexPagePath = toGoPath;
										$(location).attr('href',toGoPath + "moderator");
									}
									
								}
							});//einde ajax
		}
		else
		{
			$(".errorMessage").text("You have to fill in both inputs!") ;
    		$(".errorMessage").css('display','block');
		}
	});// END ON CLICK p.logout


// DEZE FUNCTIE HANGT EEN KLEINE KLEURBAND AAN DE POSTS DIE DE VRAGEN VAN ANTWOORDEN ONDERSCHEIDT
// DEZE HEEFT EEN VARIERENDE LENGTE AFHANKELIJK VAN DE LENGTE VAN HET BERICHT
// DAAROM WORDT DE LENGTE VAN DE BERICHTCONTAINER BEREKEND EN VERMENIGVULDIGD MET 3
// ZODAT DEZE ZEKER GROOT GENOEG IS.
	calculatePaddingForMessages ();

// BIJ HET LADEN VAN DE MODERATOR ACCOUNT WORDT HET INDEXPAD GESET
	$(".moderatorAccount").on('load', function (){
		var currentPath = $(location).attr('href');
		var toGoPath = currentPath.substr(0,currentPath.indexOf('moderator'));
		indexPagePath = toGoPath;
	});

// BIJ HET KLAAR ZIJN VAN DE /ASK PAGINA WORDT ER 
// VOOR ALLE POSTS DIE GETOOND WORDEN? WORDT GECHECKT OF DE HUIDIGE USER ER AL
// HEEFT OP GEVOTED
// DAARVOOR ROEPEN WE DE COOKIE AAN DIE TIJDENS HET VOTEN GEMAAKT IS 
// EN SETTEN WE DE REEDS GEVOTED POSTS MET DE JUISTE KLEURPIJL EN DATA ATRRIBUTEN
	$(".ordinaryUser").ready(function (){

			var votesList;
			var id = getTextType($(".category").find("#facebookUserID")[0]);
	    var request = $.ajax({ 
							type: "POST", // GET or POST
							url: "/getVotesByUser/" + id,//$(this).attr('action'),
							dataType: "json",
							error: function( xhr, status ) {
								//console.log("Kon de actie niet uitvoeren.");
								console.log(status + ",  unlucky")
								event.preventDefault();
							 }, // the file to call
							success: function(response) { // on success..
								//showAbsences();
								//humane.log("Was een succes!");
								votesList = response;
											$("#questionList li.questionItem").each(function( index ) {

												var currentId = $(this)[0].id;
												//var idList = $.cookie("myVotesIMDWALL");
												/*var idList = JSON.parse(localStorage.getItem('savedVotes'));*/
												var idList = votesList;
												var dataArray = [];

												$.each(idList, function (index, value) {

													var savedId = "message" + value.chat_id;
													var savedVoteValue = value.voteValue;
													var savedDataUp = value.votedUp;
													var savedDataDown = value.votedDown;
												    
												    if(currentId == savedId)
												    {
														switch(savedVoteValue)
														{
															// ALLE MOGELIJKHEDEN CHECKEN VAN HOE DE VOTE WAS, IS BELANGRIJK OM TE WETEN
															// VOOR HOE DE PIJLTJES GESET WORDEN
															// WANT 1DOWN KAN BV ZIJN WANNEER JE GEWOON NAAR BENEDEN VOTE
															// MAAR OOK WANNEER JE JE UP VOTE WILT TERUGNEMEN OM TERUG NAAR DE 
															// NEUTRALE SITUATIE TE GAAN
															// 2 DOWN OF 2 UP STAAT DAN VOOR WANNEER JE AL GEDOWNVOTED OF GEUPVOTED HEBT
															// OM DAN RESPECTIEVELIJK METEEN TE UPVOTED OF DOWNVOTEN
															case "1up" : 	if(savedDataUp == true && savedDataDown == false)//van 0 @ 1
																			{
																				$("#" + currentId).data("votedup",true);//true
																				$("#" + currentId).data("voteddown",false);//false
																				$("#" + currentId).find(".voteUp").removeClass('up');
																				$("#" + currentId).find(".voteUp").addClass('chosenUp');
																			}
																			else if(savedDataUp == false && savedDataDown == false)// van -1 @ 0
																			{
																				$("#" + currentId).data("votedup",false);//true
																				$("#" + currentId).data("voteddown",false);//false
																				$("#" + currentId).find(".voteDown").removeClass('chosenDown');
																				$("#" + currentId).find(".voteDown").addClass('down');
																			}
																break;
															case "2up" : 	if(savedDataUp == true && savedDataDown == false)// van -1 @ 1
																			{
																				$("#" + currentId).data("votedup",true);//true
																				$("#" + currentId).data("voteddown",false);//false
																				$("#" + currentId).find(".voteUp").removeClass('up');
																				$("#" + currentId).find(".voteUp").addClass('chosenUp');
																			}
																break;
															case "1down" : 	if(savedDataUp == false && savedDataDown == true)//van 0 @ -1
																			{
																				$("#" + currentId).data("votedup",false);//true
																				$("#" + currentId).data("voteddown",true);//false
																				$("#" + currentId).find(".voteDown").removeClass('down');
																				$("#" + currentId).find(".voteDown").addClass('chosenDown');
																			}
																			else if(savedDataUp == false && savedDataDown == false)// van 1 @ 0
																			{
																				$("#" + currentId).data("votedup",false);//true
																				$("#" + currentId).data("voteddown",false);//false
																				$("#" + currentId).find(".voteUp").removeClass('chosenUp');
																				$("#" + currentId).find(".voteUp").addClass('up');
																			}
																break;
															case "2down" : 	if(savedDataUp == false && savedDataDown == true)// van 1 @ -1
																			{
																				$("#" + currentId).data("votedup",false);//true
																				$("#" + currentId).data("voteddown",true);//false
																				$("#" + currentId).find(".voteDown").removeClass('down');
																				$("#" + currentId).find(".voteDown").addClass('chosenDown');
																			}
																break;
														}
												    }
												});
											});

								event.preventDefault();
								
							}
			});//einde ajax
		});

	/*client = new Faye.Client('http://localhost:3002/faye/',{
				timeout: 20
	});*/

// DE CLIENT AFHANKELIJK VAN DE REMOTE OF LOCAL URL DEFINIEREN
	client = new Faye.Client(indexPagePath + 'faye/',{
				timeout: 20
	});

// OM ALLE GEMAAKTE POSTS TE ONTVANGEN MOET ELKE CLIENT NAAR DE /MESSAGE LUISTEREN
	var subscription = client.subscribe('/message', function(message) {
	  //console.log(message.chat + " " + message.user + " " + message.chatMessageType);

	  
	 // ER WORDEN 3 INSTANTIES GEMAAKT VAN DE GEMAAKTE POST: VOOR DE GEWONE USER MET VOTING CAPACITEITEN
	 //														 VOOR DE MODERATOR MET ALLEEN DELETE CAPACITEITEN
	 //														 VOOR DE QUESTIONS PAGINA MET GEEN ENKELE CAPACITEIT, ENKEL BEKIJKEN
	 // HIER WORDEN DAN DE JUIST WAARDEN VAN DE PUBLISH IN GESTOKEN
	  var listItemInstanceAsk = "<li id='" + message.id + "' data-votedup='false' data-voteddown='false' class='questionItem animateQuestion'>"
	  						+ "<div class='messageCon even " + message.chatMessageType +  "'>"
	  						+ 	"<span class='typeColor" + message.chatMessageType + "'>"
							+ 	"</span>"
							+ 	"<div class='messageConSec'>"
							+ 		"<div class='messageDetails'>"
							+			"<div class='profile'>"
							+				"<img src='" + message.senderPicURL + "' alt='senderPic'>"
							+			"</div>"
						    + "<div class='votes'>"
						    +      "<div class='voteAction'>"
						    +         "<ul>"
						    +             "<li>"
						    +                 "<span class='voteUp up'></span>"
						    +             "</li>"
						    +             "<li>"
						    +                 "<div class='voteInfo'>"
						    +                     "<h1 class='votesNr'>"
						    +                         "<div class='voteCounter'>"
						    +                           "0"
						    +                         "</div>"
						    +                     "</h1>"
						    +                 "</div>"
						    +             "</li>"
						    +             "<li>"
						    +                 "<span class='voteDown down'></span>"
						    +             "</li>"
						    +         "</ul>"
						    +     "</div>"
						    + "</div>"
							+		"</div>"
							+		"<div class='messageContent'>"
							+			"<div class='name'>"
							+				"<h1>" +  message.user + " says:</h1>"
							+			"</div>"
							+			"<div class='text'>"
							+				"<h2>" + message.chat + "</h2>"
							+			"</div>"
							+			"<div class='time'>"
							+				"<h3>" + message.chatTime + "</h3>"
							+			"</div>"
							+		"</div>"
							+	"</div>"
							+	"</div>"
					   		+ "</li>";

	var listItemInstance = "<li id='" + message.id + "' data-votedup='false' data-voteddown='false' class='questionItem animateQuestion'>"
	  						+ "<div class='messageCon even " + message.chatMessageType +  "'>"
	  						+ 	"<span class='typeColor" + message.chatMessageType + "'>"
							+ 	"</span>"
							+ 	"<div class='messageConSec'>"
							+ 		"<div class='messageDetails'>"
							+			"<div class='profile'>"
							+				"<img src='" + message.senderPicURL + "' alt='SenderPic'>"
							+			"</div>"
							+			"<div class='votes'>"
							+				"<div class='voteInfo'>"
							+					"<h1 class='votesNr'><span class='voteCounter'>0</span> votes</h1>"
							+				"</div>"
							+			"</div>"
							+		"</div>"
							+		"<div class='messageContent'>"
							+			"<div class='name'>"
							+				"<h1>" +  message.user + " says:</h1>"
							+			"</div>"
							+			"<div class='text'>"
							+				"<h2>" + message.chat + "</h2>"
							+			"</div>"
							+			"<div class='time'>"
							+				"<h3>" + message.chatTime + "</h3>"
							+			"</div>"
							+		"</div>"
							+	"</div>"
							+	"</div>"
					   		+ "</li>";

	var listItemInstanceModerator = "<li id='" + message.id + "' data-votedup='false' data-voteddown='false' class='questionItem animateQuestion'>"
	  						+ "<div class='messageCon even " + message.chatMessageType +  "'>"
	  						+ 	"<span class='typeColor" + message.chatMessageType + "'>"
							+ 	"</span>"
							+ 	"<div class='messageConSec'>"
							+ 		"<div class='messageDetails'>"
							+			"<div class='profile'>"
							+				"<img src='" + message.senderPicURL + "' alt='SenderPic'>"
							+			"</div>"
							+				"<div class='deleteAction'>"
							+					"<span class='delete'></span>"	
							+				"</div>"
							+			"<div class='votesMod'>"
							+				"<div class='voteInfo'>"
							+					"<h1 class='votesNr'><span class='voteCounter'>0</span> votes</h1>"
							+				"</div>"
							+			"</div>"
							+		"</div>"
							+		"<div class='messageContent'>"
							+			"<div class='name'>"
							+				"<h1>" +  message.user + " says:</h1>"
							+			"</div>"
							+			"<div class='text'>"
							+				"<h2>" +  message.chat + "</h2>"
							+			"</div>"
							+			"<div class='time'>"
							+				"<h3>" + message.chatTime + "</h3>"
							+			"</div>"
							+		"</div>"
							+	"</div>"
							+	"</div>"
					   		+ "</li>";


	  //$("ul#questionList.allQuestion").append(listItemInstance);
	  //$("ul#questionList.moderator").append(listItemInstanceModerator);
	 
	 

	  //console.log($("#message" + messageId));
	  //console.log($("#message" + messageId).find(".votes"));
	  //console.log($("#message" + messageId).find(".voteDown"));
	  
	  //checkIfNoVotes ("#message" + messageId);

	  // BIJ HET MAKEN VAN DEZE BERICHTEN WORDT ER OOK UITGEREKEND WAAR ZE MOETEN KOMEN
	  // VERMITS DE POSTS GERANGSCHIKT WORDEN OP VOTES VAN HOOG NAAR LAAG
		sortMessages (listItemInstance, 0); 
		sortMessagesModerator (listItemInstanceModerator, 0);
		sortMessagesAsk (listItemInstanceAsk, 0);
	  	calculatePaddingForMessages();
	   checkIfThereArePosts();
	});// END SUBSCRIBE


// deze client moet ook zijn vragen kunnen stellen, dus publiceren naar /message
// DE CLIENT KAN OOK POSTS MAKEN MET HET FORMULIER
// DEZE POST WORDT DAN GECHECKT OP ILLEGALE CHARACTERS EN OF ZE NIET LEEG OF UNDEFINED ZIJN
// IN DEZE GEVALLEN WORDEN FOUTBOODSCHAPPEN GETOOND
	$("#submitQuestion").on('click', function (e){
		e.preventDefault();
		var chatUser = getTextType($(".accountname")[0]);  //== de displayname MOET HIER NOG UITGEVIST WORDEN
		//console.log(chatUser);
		var chatMessage = $("#questionField").val();
		var messageIllegalCharsFound = illegalCharsFound(chatMessage);
    var userIllegalCharsFound = illegalCharsFound(chatUser);
		var chatMessageType = $("#sendTypes input[type='radio']:checked").val();
		var currentDateTime = new Date();
    //var currentdate = createDateStringOnlyTime(currentDateTime); 
    var currentdate = createDateString(currentDateTime);


		
		if(chatMessage != "" && chatUser != "" && chatMessageType != undefined )
    	{
   
	    	if( messageIllegalCharsFound == true || userIllegalCharsFound == true )
	    	{
	    		$(".errorMessage").text("Your message contains illegal characters like '< >'!") ;
    			$(".errorMessage").css('display','block');
    			if($(window).width() <= 700)
    			{
    				$("rightSide").height(204);
    			}
	    	}
	    	else
	    	{
	    		$(".errorMessage").text("") ;
    			$(".errorMessage").css('display','none');
    			if($(window).width() <= 700)
    			{
    				$("#rightSide").height(175);
    			}

    // BIJ HET POSTEN VAN DE CREATIE VAN EEN POST
    // KRIJGT DIT BERICHT ALS ID HET AANTAL MESSAGES DAT AL IN DE DATABANK ZIT MET 1 VERHOOGD
    // ZO KRIJGT DIT BERICHT EEN UNIEKE ID
    // AL DE INGEVULDE GEGEVENS WORDEN ZOWEL NAAR DE SERVER GESTUURD OM IN DE DATABANK TE STEKEN
    // MAAR OOK NAAR DE SUBSCRIBE FUNCTIE VAN DE CLIENT OM DE NIEUWE POST TE APPENDEN AAN HUN LIJST ZICHTBARE posts
    			var totalMessagesCount = parseInt(getTextType($("span.hiddenMessageCount")[0]));
    			totalMessagesCount++;
    			//var facebookUserID = getTextType($(".hiddenSpan"));
    			var facebookUserID = getTextType($(".category").find("#facebookUserID")[0]);
    			var facebookUserName = getTextType($(".category").find("#facebookUserName")[0]);
    			var senderPic = $("#accountPic").attr("src");
    			var insertInDb = {id : totalMessagesCount, message : chatMessage, sender : chatUser, chatType : chatMessageType, chatTime : currentDateTime, senderPicURL : senderPic, facebookUserID : facebookUserID, facebookUserName : facebookUserName};
		
    			var publicationAsk = client.publish('/message', {id : "message"+totalMessagesCount, chat : chatMessage, user : chatUser, chatMessageType : chatMessageType, chatTime : currentdate, senderPicURL :senderPic, facebookUserID : facebookUserID, facebookUserName : facebookUserName});
    			//var publicationAsk = client.publish('/moderate', {chat : chatMessage, user : chatUser, chatMessageType : chatMessageType});
    				  //alert(parseInt(getTextType($("span.hiddenMessageCount")[0])));
				
    			$("#questionField").val("");
 				//alert(uniqId());

    			 var request = $.ajax({ // create an AJAX call...
							data: {chatContent :  insertInDb }, // get the form data
							type: "POST", // GET or POST
							url: "/create",//$(this).attr('action'),
							dataType: "json",
							error: function( xhr, status ) {
								//console.log("Kon de actie niet uitvoeren.");
								e.preventDefault();
							 }, // the file to call
							success: function(response) { // on success..
								//showAbsences();
								//humane.log("Was een succes!");
								if(JSON.stringify(response) == "true")
								{
									$("#sender").attr("src", senderPic);
								}
								//console.log("geluktsucces");
								e.preventDefault();
								
							}
						});//einde ajax
    			 // OOK DE MESSAGESCOUNT IN DE HIDDEN SPAN WORDT AAN GEPAST VOOR ALS ER NOG BERICHTEN WORDEN
    			 // GEMAAKT TERWIJL ER NOG NIET GEREFRESHED IS, ZODAT DE ID MEE VERANDERT
    			 // WANNEER WEL GEREFRESHED WORDT, WORDT DE INHOUD HIERVAN INGEVULD DOOR DE SERVER DIE DIT AANTAL OPHAALT
				changeText($("span.hiddenMessageCount")[0],totalMessagesCount);
	    	}
    	}
    	else
    	{

    		$(".errorMessage").text("You must fill in both your message and a message type!") ;
    		$(".errorMessage").css('display','block');
    		if($(window).width() <= 700)
    			{
    				$("#rightSide").height(204);
    			}
    	}
		
	});// END ON CLICK submitQuestion

	
// BIJ HET KLIKKEN OP HET VOTEUP PIJLTJE WORDT DE ID VAN HET AANGEKLIKTE BERICHT OPGEVRAAGD
// DAN WORDT ER GEKEKEN VAN WELKE SITUATIE DE VOTE KOMT
// INDIEN VOTEDUP & VOTEDDOWN BEIDE FALSE ZIJN DAN KOMEN WE VANUIT DE NEUTRALE SITUATIE
// WAARBIJ NU VOTEDUP GEKOZEN IS EN MOET DIT DATAATTRIBUUT VERANDEREN NAAR TRUE
// EN MOETEN DE JUISTE KLASSEN ERAAN TOEGEVOEGD EN VERWIJDERD WORDEN
// INDIEN VOTEDDOWN AL OP TRUE STOND KOMEN VAN -1 NAAR +1
// ANDERE MOGELIJKHEDEN BESTAAN NIET, DAN WORDT DE NEUTRALE SITUATIE GEKOZEN
	$( "#questionList" ).on( "click", ".voteUp", function( event ) {
		 	var currentMessageId = "#" + $(this).parents(".questionItem")[0].id;


	    if($(currentMessageId).data("votedup") === false && $(currentMessageId).data("voteddown") === false)
	    {
	    	//checkVotingAvailibility (currentMessageId, "votedup", "voteddown", ".voteUp", ".voteDown" , true);
	    	

	    	$(currentMessageId).data("votedup",true);
				$(currentMessageId).find(".voteUp").removeClass('up');
				$(currentMessageId).find(".voteUp").addClass('chosenUp');
				voteMessage(currentMessageId, "up", "1up",true,false);
	    }
	    else if($(currentMessageId).data("votedup") === false && $(currentMessageId).data("voteddown") === true)
	    {
	    	//checkVotingAvailibility (currentMessageId, "votedup", "voteddown", ".voteUp", ".voteDown" , true);
	    	$(currentMessageId).data("votedup",true);
	    	$(currentMessageId).data("voteddown",false);
				$(currentMessageId).find(".voteUp").removeClass('up');
				$(currentMessageId).find(".voteUp").addClass('chosenUp');
				$(currentMessageId).find(".voteDown").removeClass('chosenDown');
				$(currentMessageId).find(".voteDown").addClass('down');
	    	voteMessage(currentMessageId, "up", "2up",true,false);
	    }
	    else
	    {
	    	setInitialVotingSituation (currentMessageId);
	    	voteMessage(currentMessageId, "up", "1down",false,false);
	    }
	    
       // checkIfNoVotes ("#" + currentMessageId);
    });// END ON CLICK .voteUp


// BIJ HET KLIKKEN OP HET VOTEDOWN PIJLTJE WORDT DE ID VAN HET AANGEKLIKTE BERICHT OPGEVRAAGD
// DAN WORDT ER GEKEKEN VAN WELKE SITUATIE DE VOTE KOMT
// INDIEN VOTEDUP & VOTEDDOWN BEIDE FALSE ZIJN DAN KOMEN WE VANUIT DE NEUTRALE SITUATIE
// WAARBIJ NU VOTEDOWN GEKOZEN IS EN MOET DIT DATAATTRIBUUT VERANDEREN NAAR TRUE
// EN MOETEN DE JUISTE KLASSEN ERAAN TOEGEVOEGD EN VERWIJDERD WORDEN
// INDIEN VOTEDUP AL OP TRUE STOND KOMEN VAN 1 NAAR -1
// ANDERE MOGELIJKHEDEN BESTAAN NIET, DAN WORDT DE NEUTRALE SITUATIE GEKOZEN
    $( "#questionList" ).on( "click", ".voteDown", function( event ) {


		 var currentMessageId = "#" + $(this).parents(".questionItem")[0].id;


		    if($(currentMessageId).data("voteddown") === false && $(currentMessageId).data("votedup") === false)
		    {
		    	//checkVotingAvailibility (currentMessageId, "voteddown", "votedup", ".voteDown", ".voteUp" , true);
		    	$(currentMessageId).data("voteddown",true);
					$(currentMessageId).find(".voteDown").removeClass('down');
					$(currentMessageId).find(".voteDown").addClass('chosenDown');
		    	voteMessage(currentMessageId, "down", "1down",false,true);
		    }
		    else if($(currentMessageId).data("voteddown") === false && $(currentMessageId).data("votedup") === true)
		    {
		    	//checkVotingAvailibility (currentMessageId, "voteddown", "votedup", ".voteDown", ".voteUp" , true);
		    	$(currentMessageId).data("voteddown",true);
	    	  $(currentMessageId).data("votedup",false);
					$(currentMessageId).find(".voteDown").removeClass('down');
					$(currentMessageId).find(".voteDown").addClass('chosenDown');
					$(currentMessageId).find(".voteUp").removeClass('chosenUp');
					$(currentMessageId).find(".voteUp").addClass('up');
		    	voteMessage(currentMessageId, "down", "2down",false,true);
		    }
		    else
		    {
		    	setInitialVotingSituation (currentMessageId);
		    	voteMessage(currentMessageId, "down", "1up",false,false);
		    }
		    
		        
		//}
        //checkIfNoVotes ("#" + currentMessageId);
    });// END ON CLICK .voteDown

// DE CLIENT MOET OOK LUISTEN NAAR DE VERANDERING VAN VOTES
// WE BEPALEN ADHV DE MEEGEGEVEN PARAMETERS NAAR WELKE SITUATIE WE MOETEN GAAN
// EN BEPAALDEN DAARMEE DE JUISTE VOTEVALUE
// DAN WORDT DEZE VOTE SAMEN MET ZIJN CORRESPONDERENDE ID DOORGESTUURD NAAR DE SERVER
// OM TE WORDEN AANGEPAST IN DE DATABANK EN BIJ DE POSTS VAN DE CLIENTS OP HET SCHERM
    var subscriptionVote = client.subscribe('/vote', function(message) {
		var test = $(message.chosenQuestion).find(".voteCounter")[0];
		var mesId = message.chosenQuestion; // #message5
		//alert(mesId);
    	//alert($(this).parents(".questionItem")[0].id);
    	var mesString = "#message";
    	var mesStinglength = mesString.length;
    	//alert(mesStinglength);
    	//alert(mesId.substr(mesStinglength,mesId.length));
    	var id = mesId.substr(mesStinglength,mesId.length);
		var currentVotes = parseInt(getTextType(test));
		//var currentVotes = parseInt(test.text());/*parseInt(test.innerText);*/
		var voteValue = message.voteValue;
		var voterFacebookID = getTextType($(".category").find("#facebookUserID")[0]);
		//console.log(voterFacebookID);
		switch (voteValue)
		{
			case "1up" : currentVotes ++;
				break;
			case "2up" : currentVotes += 2;
				break;
			case "1down": currentVotes--;
				break;
			case "2down": currentVotes -= 2;
				break;
		}
		/*if(voteValue == "1up")
				currentVotes ++;	
			else
				currentVotes--;	
		 	*/

		
	    //test.innerText = currentVotes;
	    //test.text(currentVotes);

	
	    changeText(test, currentVotes);
	    var voteData = {voteValue : voteValue, voteType : message.voteType, votedUp : message.votedUp, votedDown : message.votedDown, voterFacebookID : voterFacebookID};
	    var request = $.ajax({ 
							type: "POST", // GET or POST
							url: "/vote/" + id + "/" + currentVotes,//$(this).attr('action'),
							data : {voteData : voteData},
							dataType: "json",
							error: function( xhr, status ) {
								//console.log("Kon de actie niet uitvoeren.");
								console.log(status + ",  unlucky")
								event.preventDefault();
							 }, // the file to call
							success: function(response) { // on success..
								//showAbsences();
								//humane.log("Was een succes!");
								console.log("geluktsucces, " + response);
								event.preventDefault();
								
							}
			});//einde ajax
	// OOK BIJ HET VOTEN WORDT ER BEKEKEN WAAR HET HUIDIGE BERICHT NAARTOE MOET
	// OMDAT ZE GERANGSCHIKT WORDEN OP BASIS VAN VOTES VAN HOOG NAAR LAAG
	    if($("ul#questionList").children().length > 1)
  		{
		    sortMessages ($(message.chosenQuestion), currentVotes); 
		    sortMessagesAsk($(message.chosenQuestion), currentVotes); 
			sortMessagesModerator ($(message.chosenQuestion), currentVotes);
		}

    });// END SUBSCRIBE VOTE

// BIJ HET KLIKKEN OP DE DELETE KNOP
// WORDT DE ID VAN HET CORRESPONDERENDE POST OPGEVRAAGD EEN ZOWEL DOORGESTUURD NAAR DE SERVER
// OM TE DELETEN IN DE DATABANK MAAR OOK UIT DE LIJST BIJ DE CLIENTS	
// ENKEL WANNEER DE DELETE GELUKT IS IN DE DATABANK, DAN WORDEN DE POSTS BIJ DE CLIENTS OOK AANGEPAST
    $( "#questionList" ).on( "click", ".delete", function (event){
    	var currentMessageId = "#" + $(this).parents(".questionItem")[0].id;
    	var mesId = $(this).parents(".questionItem")[0].id;
    	//alert($(this).parents(".questionItem")[0].id);
    	var mesString = "message";
    	var mesStinglength = mesString.length;
    	//alert(mesStinglength);
    	//alert(mesId.substr(mesStinglength,mesId.length));
    	var id = mesId.substr(mesStinglength,mesId.length);
		
    	//alert(messageIdString.substr(2,3));
		 var request = $.ajax({ // create an AJAX call...
							/*data: {id :  id }, */// get the form data
							type: "POST", // GET or POST
							url: "/destroy/" + id,//$(this).attr('action'),
							dataType: "json",
							error: function( xhr, status ) {
								//console.log("Kon de actie niet uitvoeren.");
								event.preventDefault();
							 }, // the file to call
							success: function(response) { // on success..
								//showAbsences();
								//humane.log("Was een succes!");
								//console.log("geluktsucces");
								if(JSON.stringify(response) == "true")
								{
									deleteMessage(currentMessageId);
								}
								
								event.preventDefault();
								
							}
						});//einde ajax
    	
    });// END ON CLICK .DELETE

	// BIJ HET OPVANGEN VAN EEN DELETE WORDT HET OVEREENKOMSTIG BERICHT UIT DE MESSAGESLIST VERWIJDERT
    var subscriptionDeleteVote = client.subscribe('/deleteVote', function(message) {
		$( "#questionList " + message.chosenQuestion ).remove();
    });// END SUBSCRIBE VOTE
   
    

   
});// END DOCUMENT READY


// FUNCTIE BESCHRIJVINGEN
// ----------------------------------------------------------------


// HIER WORDT ER GECHECKT OF DAT DE CONTENT ZICHTBAAR IS DAT OOK HET USERICOONTJE MOET GETOOND WORDEN
// EN NIET WANNEER DE CONTENT NIET MAAR WEL HET LOGINSCHERM TE ZIEN IS
// WORDT NIET MEER GEBRUIKT
function checkContentVisibility ()
{
	if ($("#content").css('display') == 'none') 
	{
		$("#accountPic").hide();

	}
	else
	{
		$("#accountPic").show();
	}
	calculatePaddingForMessages ();
}


// DEZE FUNCTIE HANGT EEN KLEINE KLEURBAND AAN DE POSTS DIE DE VRAGEN VAN ANTWOORDEN ONDERSCHEIDT
// DEZE HEEFT EEN VARIERENDE LENGTE AFHANKELIJK VAN DE LENGTE VAN HET BERICHT
// DAAROM WORDT DE LENGTE VAN DE BERICHTCONTAINER BEREKEND EN VERMENIGVULDIGD MET 10
// ZODAT DEZE ZEKER GROOT GENOEG IS.
function calculatePaddingForMessages ()
{
	$("#questionList li div.question").each(function( index ) {
  		var test1 = parseInt($(this).height());
  		//var test2 = parseInt($("#questionList li").css('padding-top').substr(0,$("#questionList li").css('padding-top').length - 2));
  		//var test = ((test1-10) + (test2+10))/2;
  		$(".typeColorquestion").css('padding-top',test1*10 + "px");
  		$(".typeColorquestion").css('padding-bottom',test1*10 + "px");
	});

	$("#questionList li div.answer").each(function( index ) {
  		var test1 = parseInt($(this).height());
  		//var test2 = parseInt($("#questionList li").css('padding-top').substr(0,$("#questionList li").css('padding-top').length - 2));
  		//var test = ((test1-10) + (test2+10))/2;
  		$(".typeColoranswer").css('padding-top',test1*10 + "px");
  		$(".typeColoranswer").css('padding-bottom',test1*10 + "px");
	});
}


// BIJ HET HOVEREN OVER EEN PIJL WERD DE HOVER IMAGE VERANDERT
// NIET MEER NODIG
function setHoverImage (this_element, imageOnHover)
{	
	$(this_element).attr("src",imageOnHover);
}


// DE EERSTE LETTER VAN EEN STRING NAAR EEN HOOFDLETTER OMZETTEN
function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}


// CHECKEN OF DAT ER GEEN HTML TAGS GEBRUIKT WORDEN
function illegalCharsFound(checkString)
{
    //var specialCharacters = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
    var specialCharacters = "<>~`";
    var result = false;
    if (checkString.indexOf('>')!=-1 || checkString.indexOf('<')!=-1 ) // dan is het gevonden
    {
       result = true;  
    }

    return result;
}

// CHECKEN OF ER NOG NIET GEVOTED IS EN DE OVEREENKOMSTIGE IMG GEBRUIKEN DAARVOOR
// WORDT NIET MEER GEBRUIKT
function checkIfNoVotes (p_elementID)
{
	//console.log("r",$(p_elementID));
	//console.log("e",$(p_elementID).children().find("span.voteCounter"));
	// het downvoten van vragen disablen als er 0 votes zijn
		//if($(p_elementID).find(".voteCounter")[0].innerText == "0" || $(p_elementID).find(".voteCounter")[0].innerText == 0 )
		if(getTextType($(p_elementID).find(".voteCounter")[0]) == "0")
		{
			$(p_elementID).find(".voteDown").prop('disabled', true);
			setHoverImage ($(p_elementID).find(".voteDown")[0], "../images/minus_sign_gray.png");
			$(p_elementID).find(".voteDown").css("cursor", "default");
		}
		else
		{
			$(p_elementID).find(".voteDown").prop('disabled', false);
			setHoverImage ($(p_elementID).find(".voteDown")[0], "../images/minus_sign_dark.png");
			$(p_elementID).find(".voteDown").css("cursor", "pointer");
		}
}

// EEN DATETIME OBJECT NAAR EEN CUSTOM FORMAAT CONVERTEREN (1)
function createDateStringOnlyTime(currentdate)
{
   
    var currentHour = checkDate(currentdate.getHours());
    var currentMinutes = checkDate(currentdate.getMinutes());    
    var currentSecond = checkDate(currentdate.getSeconds());  

    var currentDateTime = currentHour + ":"  
                    + currentMinutes + ":" 
                    + currentSecond;
    return currentDateTime;
}

// EEN DATETIME OBJECT NAAR EEN CUSTOM FORMAAT CONVERTEREN (2)
function createDateString(currentdate)
{
    var currentDay = checkDate(currentdate.getDate());
    var currentMonth = checkDate(currentdate.getMonth()+1);
    var currentYear = checkDate(currentdate.getFullYear());
    var currentHour = checkDate(currentdate.getHours());
    var currentMinutes = checkDate(currentdate.getMinutes());    
    var currentSecond = checkDate(currentdate.getSeconds());  

    var currentDateTime = currentDay + "/"
                    + currentMonth + "/" 
                    + currentYear + " ("  
                    + currentHour + ":"  
                    + currentMinutes + ":" 
                    + currentSecond + ") " ;
    return currentDateTime;
}

// CHECKEN OF EEN DATE ELEMENT KLEINER IS DAN 10, EN ER DAN EEN 0 VOOR PLAATSEN
// VOORBEELD: 01/05/2014 IPV 1/5/2014
function checkDate(p_dateElement)
{
    if(p_dateElement < 10)
        p_dateElement = "0" + p_dateElement;
    return p_dateElement;
}

// WERD GEBRUIKT OM DE PIJLTJES VAN DE VOTES TE SETTEN
// NU NIET MEER GEBRUIKT
function checkVotingAvailibility (p_currentMessageId, p_dataAtrrDisable, p_dataAttrEnable, p_voteTypeDisable, p_voteTypeEnable , p_voteValue)
{
	if(p_voteTypeDisable == ".voteDown")
	{
		$(p_currentMessageId).data(p_dataAtrrDisable,p_voteValue);
		//$(p_currentMessageId).find(p_voteTypeDisable).prop('disabled', !p_voteValue);
		$(p_currentMessageId).find(p_voteTypeDisable).removeClass('down');
		$(p_currentMessageId).find(p_voteTypeDisable).addClass('chosenDown');

		// de overblijvende vote
		//$(p_currentMessageId).data(p_dataAttrEnable,!p_voteValue);
		//$(p_currentMessageId).find(p_voteTypeEnable).prop('disabled', p_voteValue);
		//$(p_currentMessageId).find(p_voteTypeEnable).addClass('inactiveUp');
		//$(p_currentMessageId).find(p_voteTypeEnable).removeClass('up');
	}
	else
	{
		$(p_currentMessageId).data(p_dataAtrrDisable,p_voteValue);
		//$(p_currentMessageId).find(p_voteTypeDisable).prop('disabled', !p_voteValue);
		$(p_currentMessageId).find(p_voteTypeDisable).removeClass('up');
		$(p_currentMessageId).find(p_voteTypeDisable).addClass('chosenUp');

		// de overblijvende vote
		//$(p_currentMessageId).data(p_dataAttrEnable,!p_voteValue);
		//$(p_currentMessageId).find(p_voteTypeEnable).prop('disabled', p_voteValue);
		//$(p_currentMessageId).find(p_voteTypeEnable).addClass('inactiveDown');
		//$(p_currentMessageId).find(p_voteTypeEnable).removeClass('down');
	}



}

// DE INITIELE VOTING SITUATIE SETTEN
// = NEUTRALE PIJLTJES
function setInitialVotingSituation (p_currentMessageId)
{
		$(p_currentMessageId).data('voteddown',false);
		$(p_currentMessageId).find('.voteDown').addClass('down');
		$(p_currentMessageId).find('.voteDown').removeClass('chosenDown');
		$(p_currentMessageId).find('.voteDown').removeClass('inactiveDown');
		$(p_currentMessageId).find('.voteDown').prop('disabled', false);

		// de overblijvende vote
		$(p_currentMessageId).data('votedup',false);
		$(p_currentMessageId).find('.voteUp').removeClass('inactiveUp');
		$(p_currentMessageId).find('.voteUp').removeClass('chosenUp');
		$(p_currentMessageId).find('.voteUp').addClass('up');
		$(p_currentMessageId).find('.voteUp').prop('disabled', false);

}

// CHECKEN OF ER AL POSTS ZIJN
// INDIEN NIET, WORDT ER GETOOND DAT ER NOG GEEN ZIJN IN EEN BERICHT
// INDIEN WEL, DAN WORDEN DE POSTS GETOOND
// EN GEEN BERICHT
function checkIfThereArePosts()
{
	if ($('ul#questionList').children().length < 1) 
	{
	    $( ".posts" ).append("<p id='noMessages'>Currently there are no questions!</p>");
	}
	else
	{
		$( "#noMessages" ).remove();
	}   
}

// HIERBIJ WORDT ER ALS ER GEVOTED IS GECHECKD OF DE COOCKIES ENABLED ZIJN
// INDIEN JA DAN WORDEN DE VOTES BIJGEHOUDEN VOOR LATER OM NIET
// VERSCHILLENDE KEREN EEN VOTE TE KUNNEN UITBRENGEN
// DAN WORDT DE VOTE DOORGESTUURD NAAR DE SUBSCRIBE
function voteMessage(p_messageId, p_voteType, p_voteValue,p_dataAttrVotedUp, p_dataAttrVotedDown)
{
	// IN EEN COOKIE SCHRIJVEN OP WELKE MESSAGES WE AL GEVOTED HEBBEN
	/*if(cookiesAreEnabled)
	{
		$.cookie.json = true;
	    var allMyvotes = $.cookie('myVotesIMDWALL');
	    var id = p_messageId.substr(1,p_messageId.length);

	    $.each(allMyvotes, function (index, value) {
			var dupMEsId = index;

			if(id == dupMEsId)
			{
				delete allMyvotes[id];
			}
		});

	    var test = {"messageId" : id, "messageValue" : p_voteValue,votedUp : p_dataAttrVotedUp,votedDown : p_dataAttrVotedDown};
	    allMyvotes[id ] = test;
	    messageId++;
	    $.cookie('myVotesIMDWALL',allMyvotes, { expires: 365 });

	}*/

	
	// BETER MET LOCALSTORAGE DAN MET COOKIE
/*	if(localStorageAvailable)
	{
			 var allMyvotes = JSON.parse(localStorage.getItem('savedVotes'));
			 var id = p_messageId.substr(1,p_messageId.length);

			 $.each(allMyvotes, function (index, value) {
				var dupMEsId = index;

				if(id == dupMEsId)
				{
					delete allMyvotes[id];
				}
			});

	    var test = {"messageId" : id, "messageValue" : p_voteValue,votedUp : p_dataAttrVotedUp,votedDown : p_dataAttrVotedDown};
	    allMyvotes[id ] = test;
	    messageId++;
	    localStorage.setItem('savedVotes',JSON.stringify(allMyvotes));
	    //console.log(JSON.parse(localStorage.getItem('savedVotes')));
	}*/

    var publicationVote = client.publish('/vote', {chosenQuestion : p_messageId, voteType : p_voteType, voteValue : p_voteValue, votedUp : p_dataAttrVotedUp, votedDown : p_dataAttrVotedDown});
    
    
}

// BIJ HET DELETEN VAN EEN POST WORDT DIT DOORGEGEVEN NAAR DE SUBSCRIBE ZODAT ZE OOK UIT DE MESSAGESLIJST BIJ DE CLIENTS VERDWIJNT
function deleteMessage(p_messageId)
{
    var publicationDeleteVote = client.publish('/deleteVote', {chosenQuestion : p_messageId});
    
}



// SORTEREN VAN DE MESSAGES OP DE /QUESTIONS PAGE
// WANNEER DE VOTE VAN HET IN TE BRENGEN BERICHT KLEINER IS DAN DE VOTES VAN DE REEDS
// BESTAANDE BERICHTEN DAN WORDT ZE ERONDER GEPLAATST
function sortMessages (element, value) 
{
	var selector = $(".allQuestion");
	

	  if ($(selector).length > 0) 
	  {
	    $(selector).attr("inserted", "false");
	   /* $(selector).children().each(function() {
	      if (parseInt($(this).text()) > parseInt(value)) {
	        $(this).before(element);
	        $(selector).attr("inserted", "true");
	        return false;
	      }
	    });*/
	
	  
		    $(".allQuestion ").children().each(function() {
		      if (parseInt($(this).find(".voteCounter").text()) < parseInt(value)) {
		        $(this).before(element);
		        $(selector).attr("inserted", "true");
		        return false;
		      }
		    });

	    if ($(selector).attr("inserted") == "false") {
	      $(selector).append(element);
	    }
	  } 
	  else 
	  {
	    $(selector).append(element);
	  }

	  $(selector).removeAttr("inserted");

	  //$(element).addClass('animateQuestion');
};

// SORTEREN VAN DE MESSAGES OP DE /ASK PAGE
// WANNEER DE VOTE VAN HET IN TE BRENGEN BERICHT KLEINER IS DAN DE VOTES VAN DE REEDS
// BESTAANDE BERICHTEN DAN WORDT ZE ERONDER GEPLAATST
function sortMessagesAsk (element, value) 
{
	var selector = $(".allCurrentQuestion");
	
	  
	  if ($(selector).length > 0) 
	  {
	    $(selector).attr("inserted", "false");
	   /* $(selector).children().each(function() {
	      if (parseInt($(this).text()) > parseInt(value)) {
	        $(this).before(element);
	        $(selector).attr("inserted", "true");
	        return false;
	      }
	    });*/
	
		    $(".allCurrentQuestion").children().each(function() {
		      if (parseInt($(this).find(".voteCounter").text()) < parseInt(value)) {
		        $(this).before(element);
		        $(selector).attr("inserted", "true");
		        return false;
		      }
		    });

	    if ($(selector).attr("inserted") == "false") {
	      $(selector).append(element);
	    }
	  } 
	  else 
	  {
	    $(selector).append(element);
	  }

	  $(selector).removeAttr("inserted");

};

// SORTEREN VAN DE MESSAGES OP DE /MODERATOR PAGE
// WANNEER DE VOTE VAN HET IN TE BRENGEN BERICHT KLEINER IS DAN DE VOTES VAN DE REEDS
// BESTAANDE BERICHTEN DAN WORDT ZE ERONDER GEPLAATST
function sortMessagesModerator (element, value) 
{

  var selector = $(".moderator");
  if ($(selector).length > 0) 
  {
    $(selector).attr("inserted", "false");
   /* $(selector).children().each(function() {
      if (parseInt($(this).text()) > parseInt(value)) {
        $(this).before(element);
        $(selector).attr("inserted", "true");
        return false;
      }
    });*/

	    $(".moderator").children().each(function() {
	      if (parseInt($(this).find(".voteCounter").text()) < parseInt(value)) {
	      	$(element).addClass('moveUp');
	        $(this).before(element);
	        $(selector).attr("inserted", "true");
	        return false;
	      }
	    });

    if ($(selector).attr("inserted") == "false") {
      $(selector).append(element);
    }
  } 
  else 
  {
    $(selector).append(element);
  }

  $(selector).removeAttr("inserted");

};

// CHECKEN OF EEN ELEMENT HET ATTRIBUUT INNERTEXT HEEFT OF INNERCONTENT
// HANDIG VOOR FIREFOX EN CHROME
// WANT HAD DAAR PROBLEMEN MEE OM DIT ATTRIBUUT TE SETTEN
function changeText(elem, changeVal) {
    if ((elem.textContent) && (typeof (elem.textContent) != "undefined") && (typeof (elem.textContent) != "NaN")) {
        elem.textContent = changeVal;
    } else {
        elem.innerText = changeVal;
    }
}

// CHECKEN OF EEN ELEMENT HET ATTRIBUUT INNERTEXT HEEFT OF INNERCONTENT
// HANDIG VOOR FIREFOX EN CHROME
// WANT HAD DAAR PROBLEMEN MEE OM DIT ATTRIBUUT TE GETTEN
function getTextType(elem) {
	//console.log(elem);
	var result = "";
		if(elem == undefined)
			return "NaN";	
    if ((elem.textContent) && (typeof (elem.textContent) != "undefined") && (typeof (elem.textContent) != "NaN")) 
    {
        result = elem.textContent;
    } else 
    {
       result =  elem.innerText ;
    }

    return result;
}

// WOU DIT GEBRUIKEN OM EEN UNIEKE ID TE VOORZIEN VOOR DE GEMAAKTE POSTS
// NU WORDT DIT GEDAAN ADHV HET AANTAL GEMAAKTE POSTS
function uniqId() {
	var result = Math.round(messageId + (Math.random() * maxRandomIdGenerator));
  return result;
}

// WOU DIT GEBRUIKEN OM EEN SLIDEBAR TE MAKEN MET DE LOGOUT FUNCTIONALITEIT
// IS WEGGELATEN OMDAT ER TE WEINIG INFORMATIE WAS OM ERIN TE ZETTEN
function showLogoutSidebar()
{
	if($("#accountOptions").hasClass('moveRight'))
		{
			$("#accountOptions").removeClass('moveRight');
			$("#baseContent").removeClass('moveRight');
		}
		else
		{
			$("#accountOptions").addClass('moveRight');
			$("#baseContent").addClass('moveRight');
		}
}

// FUNCTIE OM TE CHECKEN OF ER COOKIES KUNNEN WORDEN GEMAAKT
function cookiesAreEnabled()
{
	if (navigator.cookieEnabled === true)
		return true;
	else
		return false;
}

//BETER LOCALSTORAGE GEBRUIKEN DAN COOKIES
function localStorageAvailable()
{
	if (Modernizr.localstorage) {
	  // window.localStorage is available!
	  return true;
	} else {
	  // no native support for local storage :(
	  // try a fallback or another third-party solution
	  return false;
	}
}
