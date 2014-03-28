// TODO
// * css animation op de messages
// * voting systeem
// * bij meermaals klikken = voten, moet de vraag groter worden
// DAT IS DAN OPNIEUW SUBSCRIBER EN PUBLISHEN NAAR EEN ANDER PATH
// DAN WORDT ER BIJ DE PUBLISH MEEGEGEVEN WELK ELEMENT GROTER MOET WORDEN
//

var previousChatTime = new Date();
var messageId = 0;
var messagesIds = [];

$(document).ready(function(){

/*	var client = new Faye.Client('http://localhost:3000/faye',{
				timeout: 20
	});*/
    
    
    var text_max = 100;
    $('.charactersLeft').html(text_max + ' characters remaining');

    $('#questionField').keyup(function() {
        var text_length = $('#questionField').val().length;
        var text_remaining = text_max - text_length;

        $('.charactersLeft').html(text_remaining + ' characters remaining');
    });


   
	var client = new Faye.Client('http://localhost:3000/faye/',{
				timeout: 20
	});

//	Clients should subscribe to channels using the #subscribe() method:		
	var subscriptionAsk = client.subscribe('/ask', function(message) {
	   //alert('Got a message: ' + message.text);
        var currentDateTime = new Date();
        var currentdate = createDateStringOnlyTime(currentDateTime);

        
    var appendToLeftSide = "<div id='message" + messageId 
                         + "' class='questionStyle animateQuestion'><div class='userClass'><h1>"
                         + capitaliseFirstLetter(message.user) + " asks: </h1><p class='voteUp'>Vote up</p><p class='chatMessage'>"
                         + message.chat  + "</p></div><div class='chatTime'><p>" 
                         + currentdate + "</p></div></div>"


        messagesIds.push("message"+messageId);
        messageId++;
        previousChatTime = currentDateTime;
        //console.log(messagesIds);
        
        //console.log(currentDateTime);
        $("#leftSide").append(appendToLeftSide);
	
    }); // END VAN SUBSCRIBE ASK

	
    $('#submitQuestion').on('click',null, function() {
    	var chatMessage = $('#questionField').val();
    	var chatUser = $('#nameField').val();
        var messageIllegalCharsFound = illegalCharsFound(chatMessage);
        var userIllegalCharsFound = illegalCharsFound(chatUser);

    	if(chatMessage != "" && chatUser != ""  && (messageIllegalCharsFound == false && userIllegalCharsFound == false) )
    	{
    		$(".errorMessage").text("") ;
    		$(".errorMessage").css('display','none');
			var publicationAsk = client.publish('/ask', {chat : chatMessage, user : chatUser});
            $('#questionField').val("");
            $('#nameField').val("");
            $('.charactersLeft').html('100 characters remaining');
    	}
    	else
    	{
    		$(".errorMessage").text("You must fill in both your name and a question!") ;
    		$(".errorMessage").css('display','block');
    	}

    	
	}); // END VAN ONCLICK SUBMITQUESTION


    $( "#leftSide" ).on( "mouseenter", "div", function( event ) {
     //  $(".voteUp").css('display','block');
       event.preventDefault();
       $(this).find(".voteUp").css('display','block');
    });

    $( "#leftSide" ).on( "mouseleave", "div", function( event ) {
       $(this).find(".voteUp").css('display','none');
       event.preventDefault();
    });

    var subscriptionAllquestion = client.subscribe('/allquestions', function(message) {

        var currentElementId = ""; 
        $.each($(".chatTime"), function(key, value) {
           // $('div.chatTime:contains(' + key + ')').html(value);
           var currentChatTime = $(this)[0].innerText;
           //console.log(currentChatTime);
           //console.log(message.messageTimeStamp);
           if(currentChatTime == message.messageTimeStamp)
           {
                currentElementId = $(this).parent()[0].id;
                //console.log(currentElementId);
          

              //  $(".chatTime:contains('" + message.messageTimeStamp + "')" ).css( "text-decoration", "underline" );
                //var currentElement = $("#" + message.chosenQuestion);
                var currentElement = $("#" + currentElementId);
                currentElement.animate({height: currentElement.height() * 1.2}, 1000 );
                var fontSize = currentElement.find(".chatMessage").css('fontSize');    
                if(fontSize != undefined)
                {
                    //alert(fontSize);
                    var numberFontSize = fontSize.substr(0,fontSize.length - 2);
                   // alert(numberFontSize);
                   currentElement.find(".chatMessage").css('fontSize', (numberFontSize * 1.2) + "px");
                }
         }
        
        });
    });

    $( "#leftSide" ).on( "click", "div.questionStyle.animateQuestion", function( event ) {
      var chosenQuestion = $(this)[0].id;
      
      //console.log($(this));
      var messageTimeStamp = $("#"+chosenQuestion).find('.chatTime')[0].innerText;
      
      //console.log(messageTimeStamp);
       event.preventDefault();
    var publicationAllQuestions = client.publish('/allquestions', {chosenQuestion : chosenQuestion, messageTimeStamp : messageTimeStamp});
    
    });


      // KLIK WORDT NU OOK GEDAAN VOOR ELK ELEMENT IN DE DIV, MAG ALLEEN VOOR DE OUTERDIV


});// END VAN DOCUMENT READY

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
                    + currentYear + " ( "  
                    + currentHour + ":"  
                    + currentMinutes + ":" 
                    + currentSecond + " ) " ;
    return currentDateTime;
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

