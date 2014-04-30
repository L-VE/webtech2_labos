// GLOBALE VARS
var messageId = 0;
var client = null;
var indexPagePath = "";
// DOCUMENT READY
// ----------------------------------------------------------------
$(document).ready(function (e){


	checkIfThereArePosts();
	

// wanneer er op het user icoontje geklikt wordt
// schuift het uitlog menu'tje van recht uit
// en kruipt weer op zijn plaats als er nog eens op geklikt wordt
	$("#accountPic").on('click', function (argument){
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
	});// END ON CLICK accountPic

//  Wanneer er op een topic geklikt wordt, kan men beginnen vragen te versturen
//  en verdwijnt het beginscherm en kan man zowel vragen stellen, antwoorden
//  en alle vragen en antwoorden ook bekijken en voten
/*	$("#topicList span").on('click', function (argument){
		$("#topicList").hide();
		$('#topicDetails').show();
		$("#form :input").prop('disabled', false);
		$("#goBackArrow").show();
	});*/// END ON CLICK topicList span

// Wanneer er vanaf de vragen op de back-pijl wordt geklikt 
// wordt het beginscherm met de lijst van topics weer getoond.
	$("#goBackArrow").on('click', function (argument){
		$(".errorMessage").text("") ;
    	$(".errorMessage").css('display','none');
		$("#topicList").show();
		$('#topicDetails').hide();
		//$("#form :input").prop('disabled', true);
		$("#goBackArrow").hide();
	});// END ON CLICK goBackArrow

// TEST TEST TEST NIET VOOR ECHT
	$(".facebookLogin").on('click', function (argument){
		var currentPath = $(location).attr('href');
		$(location).attr('href',currentPath + "ask");
	});// END ON CLICK #login

	$("#admin").on('click', function (argument){
		var currentPath = $(location).attr('href');
		$(location).attr('href',currentPath + "moderator");
	});// END ON CLICK #login

// Wanneer men uitlogt verdwijnt het huidige scherm
// en komt het loginscherm weer tevoorschijn
	$("p.logout").on('click', function (argument){
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
		$(location).attr('href',toGoPath);
		//console.log(indexPath);
		//checkContentVisibility();
	});// END ON CLICK p.logout


// de kleine kleurband die de vragen van antwoorden onderscheidt
// heeft een varierende lengte afhankelijk van de lengte van het bericht
// daarom wordt de lengte van de berichtcontainer berekend en vermenigvuldigd met 3
// zodat deze zeker groot genoeg is.
	calculatePaddingForMessages ();

	$(".moderatorAccount").on('load', function (){
		var currentPath = $(location).attr('href');
		var toGoPath = currentPath.substr(0,currentPath.indexOf('moderator'));
		indexPagePath = toGoPath;
	});

	$(".ordinaryUser").on('load', function (){
		var currentPath = $(location).attr('href');
		var toGoPath = currentPath.substr(0,currentPath.indexOf('ask'));
		indexPagePath = toGoPath;
	});
// nu de client definieëren

	/*client = new Faye.Client('http://localhost:3002/faye/',{
				timeout: 20
	});*/
	client = new Faye.Client(indexPagePath + 'faye/',{
				timeout: 20
	});

// deze client moet zich subscriben op het kanaal /message
	var subscription = client.subscribe('/message', function(message) {
	  //console.log(message.chat + " " + message.user + " " + message.chatMessageType);

	  var currentDateTime = new Date();
      var currentdate = createDateStringOnlyTime(currentDateTime);

	  var listItemInstanceAsk = "<li class='questionItem animateQuestion' id='message" + messageId + "' data-votedup='false' data-voteddown='false'>"
	  						+ "<div class='messageCon even " + message.chatMessageType +  "'>"
	  						+ 	"<span class='typeColor" + message.chatMessageType + "'>"
							+ 	"</span>"
							+ 	"<div class='messageConSec'>"
							+ 		"<div class='messageDetails'>"
							+			"<div class='profile'>"
							+				"<img src='../images/profilePic.png' alt=''>"
							+			"</div>"
							+			"<div class='votes'>"
							+				"<div class='voteInfo'>"
							+					"<h1 class='votesNr'><span class='voteCounter'>0</span> votes</h1>"
							+				"</div>"
							+				"<div class='voteAction'>"
							+					"<ul>"
							+						"<li><span class='up voteUp'></span></li>"
							+						"<li><span class='down voteDown'></span></li>"
							+					"</ul>"
							+				"</div>"
							+			"</div>"
							+		"</div>"
							+		"<div class='messageContent'>"
							+			"<div class='name'>"
							+				"<h1>" +  message.user + "</h1>"
							+			"</div>"
							+			"<div class='text'>"
							+				"<h2>" + message.chat + "</h2>"
							+			"</div>"
							+			"<div class='time'>"
							+				"<h3>" + currentdate + "</h3>"
							+			"</div>"
							+		"</div>"
							+	"</div>"
							+	"</div>"
					   		+ "</li>";

	var listItemInstance = "<li class='questionItem animateQuestion' id='message" + messageId + "' data-votedup='false' data-voteddown='false'>"
	  						+ "<div class='messageCon even " + message.chatMessageType +  "'>"
	  						+ 	"<span class='typeColor" + message.chatMessageType + "'>"
							+ 	"</span>"
							+ 	"<div class='messageConSec'>"
							+ 		"<div class='messageDetails'>"
							+			"<div class='profile'>"
							+				"<img src='../images/profilePic.png' alt=''>"
							+			"</div>"
							+			"<div class='votes'>"
							+				"<div class='voteInfo'>"
							+					"<h1 class='votesNr'><span class='voteCounter'>0</span> votes</h1>"
							+				"</div>"
							+			"</div>"
							+		"</div>"
							+		"<div class='messageContent'>"
							+			"<div class='name'>"
							+				"<h1>" +  message.user + "</h1>"
							+			"</div>"
							+			"<div class='text'>"
							+				"<h2>" + message.chat + "</h2>"
							+			"</div>"
							+			"<div class='time'>"
							+				"<h3>" + currentdate + "</h3>"
							+			"</div>"
							+		"</div>"
							+	"</div>"
							+	"</div>"
					   		+ "</li>";

	var listItemInstanceModerator = "<li class='questionItem animateQuestion' id='message" + messageId + "' data-votedup='false' data-voteddown='false'>"
	  						+ "<div class='messageCon even " + message.chatMessageType +  "'>"
	  						+ 	"<span class='typeColor" + message.chatMessageType + "'>"
							+ 	"</span>"
							+ 	"<div class='messageConSec'>"
							+ 		"<div class='messageDetails'>"
							+			"<div class='profile'>"
							+				"<img src='../images/profilePic.png' alt=''>"
							+			"</div>"
							+			"<div class='votes'>"
							+				"<div class='voteInfo'>"
							+					"<h1 class='votesNr'><span class='voteCounter'>0</span> votes</h1>"
							+				"</div>"
							+				"<div class='deleteAction'>"
							+					"<span class='delete'></span>"	
							+				"</div>"
							+			"</div>"
							+		"</div>"
							+		"<div class='messageContent'>"
							+			"<div class='name'>"
							+				"<h1>" +  message.user + "</h1>"
							+			"</div>"
							+			"<div class='text'>"
							+				"<h2>" +  message.chat + "</h2>"
							+			"</div>"
							+			"<div class='time'>"
							+				"<h3>" + currentdate + "</h3>"
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
		messageId++;
		sortMessages (listItemInstance, 0); 
		sortMessagesModerator (listItemInstanceModerator, 0);
		sortMessagesAsk (listItemInstanceAsk, 0);
	  	calculatePaddingForMessages();
	   checkIfThereArePosts();
	});// END SUBSCRIBE


// deze client moet ook zijn vragen kunnen stellen, dus publiceren naar /message
	$("#submitQuestion").on('click', function (e){
		var chatUser = "Test";  //MOET HIER NOG UITGEVIST WORDEN
		var chatMessage = $("#questionField").val();
		var messageIllegalCharsFound = illegalCharsFound(chatMessage);
        var userIllegalCharsFound = illegalCharsFound(chatUser);
		var chatMessageType = $("#sendTypes input[type='radio']:checked").val();

		if(chatMessage != "" && chatUser != "" && chatMessageType != undefined )
    	{
   
	    	if( messageIllegalCharsFound == true || userIllegalCharsFound == true )
	    	{
	    		$(".errorMessage").text("Your message contains illegal characters like '< >'!") ;
    			$(".errorMessage").css('display','block');
	    	}
	    	else
	    	{
	    		$(".errorMessage").text("") ;
    			$(".errorMessage").css('display','none');
    			var publicationAsk = client.publish('/message', {chat : chatMessage, user : chatUser, chatMessageType : chatMessageType});
    			//var publicationAsk = client.publish('/moderate', {chat : chatMessage, user : chatUser, chatMessageType : chatMessageType});
    			$("#questionField").val("");
	    	}
    	}
    	else
    	{
    		$(".errorMessage").text("You must fill in both your message and a message type!") ;
    		$(".errorMessage").css('display','block');
    	}
		e.preventDefault();
	});// END ON CLICK submitQuestion

	
	$( "#questionList" ).on( "click", ".voteUp", function( event ) {
		 	var currentMessageId = "#" + $(this).parents(".questionItem")[0].id;
		//if($(currentMessageId).data("votedup") === false)
		//{
		 	//var test = $(currentMessageId).find(".voteCounter")[0];
		 	//var currentVotes = parseInt(test.innerText);
		 	//if(votedDown === true)
		 	//	currentVotes+=2;	
		 	//else
		 	//	currentVotes++;
		 	
	        //test.innerText = currentVotes;
	        //checkVotingAvailibility (currentMessageId, "votedup", "voteddown", ".voteUp", ".voteDown" , true);
	   // }

	    if($(currentMessageId).data("votedup") === false && $(currentMessageId).data("voteddown") === false)
	    {
	    	//checkVotingAvailibility (currentMessageId, "votedup", "voteddown", ".voteUp", ".voteDown" , true);
	    	

	    	$(currentMessageId).data("votedup",true);
			$(currentMessageId).find(".voteUp").removeClass('up');
			$(currentMessageId).find(".voteUp").addClass('chosenUp');
			voteMessage(currentMessageId, "up", "1up");
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
	    	voteMessage(currentMessageId, "up", "2up");
	    }
	    else
	    {
	    	setInitialVotingSituation (currentMessageId);
	    	voteMessage(currentMessageId, "up", "1down");
	    }
	    
       // checkIfNoVotes ("#" + currentMessageId);
    });// END ON CLICK .voteUp


    $( "#questionList" ).on( "click", ".voteDown", function( event ) {


		 var currentMessageId = "#" + $(this).parents(".questionItem")[0].id;
    	//if($(currentMessageId).data("voteddown") === false)
		//{

		 	//var test = $(currentMessageId).find(".voteCounter")[0];
		 	//var currentVotes = parseInt(test.innerText);
		 	//if(votedUp === true)
		 	//	currentVotes-=2;	
		 	//else
		 	//	currentVotes--;
		 	
	        //test.innerText = currentVotes;


		    if($(currentMessageId).data("voteddown") === false && $(currentMessageId).data("votedup") === false)
		    {
		    	//checkVotingAvailibility (currentMessageId, "voteddown", "votedup", ".voteDown", ".voteUp" , true);
		    	$(currentMessageId).data("voteddown",true);
				$(currentMessageId).find(".voteDown").removeClass('down');
				$(currentMessageId).find(".voteDown").addClass('chosenDown');
		    	voteMessage(currentMessageId, "down", "1down");
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
		    	voteMessage(currentMessageId, "down", "2down");
		    }
		    else
		    {
		    	setInitialVotingSituation (currentMessageId);
		    	voteMessage(currentMessageId, "down", "1up");
		    }
		    
		        
		//}
        //checkIfNoVotes ("#" + currentMessageId);
    });// END ON CLICK .voteDown

    var subscriptionVote = client.subscribe('/vote', function(message) {
		var test = $(message.chosenQuestion).find(".voteCounter")[0];
		var currentVotes = parseInt(getTextType(test));
		//var currentVotes = parseInt(test.text());/*parseInt(test.innerText);*/
		var voteValue = message.voteValue;
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
	    
	    if($("ul#questionList").children().length > 1)
  		{
		    sortMessages ($(message.chosenQuestion), currentVotes); 
		    sortMessagesAsk($(message.chosenQuestion), currentVotes); 
			sortMessagesModerator ($(message.chosenQuestion), currentVotes);
		}

    });// END SUBSCRIBE VOTE

    $( "#questionList" ).on( "click", ".delete", function (event){
    	var currentMessageId = "#" + $(this).parents(".questionItem")[0].id;
    	deleteMessage(currentMessageId);
    });// END ON CLICK .DELETE

    var subscriptionDeleteVote = client.subscribe('/deleteVote', function(message) {
		$( "#questionList " + message.chosenQuestion ).remove();
    });// END SUBSCRIBE VOTE
   
    

   
});// END DOCUMENT READY


// FUNCTIE BESCHRIJVINGEN
// ----------------------------------------------------------------

// hier wordt er gecheckt dat wanneer de content zichtbaar is dat
// ook het usericoontje moet getoond worden
// en niet wanneer de content niet maar wel het loginscherm te zien is
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


// de kleine kleurband die de vragen van antwoorden onderscheidt
// heeft een varierende lengte afhankelijk van de lengte van het bericht
// daarom wordt de lengte van de berichtcontainer berekend en vermenigvuldigd met 10
// zodat deze zeker groot genoeg is.
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


function setHoverImage (this_element, imageOnHover)
{	
	$(this_element).attr("src",imageOnHover);
}


// eerste letter van een string in hoofdletter omzetten
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

function checkIfNoVotes (p_elementID)
{
	console.log("r",$(p_elementID));
	console.log("e",$(p_elementID).children().find("span.voteCounter"));
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


function checkDate(p_dateElement)
{
    if(p_dateElement < 10)
        p_dateElement = "0" + p_dateElement;
    return p_dateElement;
}

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

function checkIfThereArePosts()
{
	if ($('ul#questionList').children().length < 1) 
	{
	    $( ".posts" ).append("<p id='noMessages'>Currently there are no questions asked!</p>");
	}
	else
	{
		$( "#noMessages" ).remove();
	}   
}

function voteMessage(p_messageId, p_voteType, p_voteValue)
{
    var publicationVote = client.publish('/vote', {chosenQuestion : p_messageId, voteType : p_voteType, voteValue : p_voteValue});
    
}

function deleteMessage(p_messageId)
{
    var publicationDeleteVote = client.publish('/deleteVote', {chosenQuestion : p_messageId});
    
}




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


function changeText(elem, changeVal) {
    if ((elem.textContent) && (typeof (elem.textContent) != "undefined") && (typeof (elem.textContent) != "NaN")) {
        elem.textContent = changeVal;
    } else {
        elem.innerText = changeVal;
    }
}

function getTextType(elem) {
	var result = "";
    if ((elem.textContent) && (typeof (elem.textContent) != "undefined") && (typeof (elem.textContent) != "NaN")) 
    {
        result = elem.textContent;
    } else 
    {
       result =  elem.innerText ;
    }

    return result;
}

