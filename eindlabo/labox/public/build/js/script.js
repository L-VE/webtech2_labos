function checkContentVisibility(){"none"==$("#content").css("display")?$("#accountPic").hide():$("#accountPic").show(),calculatePaddingForMessages()}function calculatePaddingForMessages(){$("#questionList li div.question").each(function(){var e=parseInt($(this).height());$(".typeColorquestion").css("padding-top",10*e+"px"),$(".typeColorquestion").css("padding-bottom",10*e+"px")}),$("#questionList li div.answer").each(function(){var e=parseInt($(this).height());$(".typeColoranswer").css("padding-top",10*e+"px"),$(".typeColoranswer").css("padding-bottom",10*e+"px")})}function setHoverImage(e,t){$(e).attr("src",t)}function capitaliseFirstLetter(e){return e.charAt(0).toUpperCase()+e.slice(1)}function illegalCharsFound(e){var t=!1;return(-1!=e.indexOf(">")||-1!=e.indexOf("<"))&&(t=!0),t}function checkIfNoVotes(e){"0"==getTextType($(e).find(".voteCounter")[0])?($(e).find(".voteDown").prop("disabled",!0),setHoverImage($(e).find(".voteDown")[0],"../images/minus_sign_gray.png"),$(e).find(".voteDown").css("cursor","default")):($(e).find(".voteDown").prop("disabled",!1),setHoverImage($(e).find(".voteDown")[0],"../images/minus_sign_dark.png"),$(e).find(".voteDown").css("cursor","pointer"))}function createDateStringOnlyTime(e){var t=checkDate(e.getHours()),s=checkDate(e.getMinutes()),o=checkDate(e.getSeconds()),a=t+":"+s+":"+o;return a}function createDateString(e){var t=checkDate(e.getDate()),s=checkDate(e.getMonth()+1),o=checkDate(e.getFullYear()),a=checkDate(e.getHours()),n=checkDate(e.getMinutes()),i=checkDate(e.getSeconds()),d=t+"/"+s+"/"+o+" ("+a+":"+n+":"+i+") ";return d}function checkDate(e){return 10>e&&(e="0"+e),e}function checkVotingAvailibility(e,t,s,o,a,n){".voteDown"==o?($(e).data(t,n),$(e).find(o).removeClass("down"),$(e).find(o).addClass("chosenDown")):($(e).data(t,n),$(e).find(o).removeClass("up"),$(e).find(o).addClass("chosenUp"))}function setInitialVotingSituation(e){$(e).data("voteddown",!1),$(e).find(".voteDown").addClass("down"),$(e).find(".voteDown").removeClass("chosenDown"),$(e).find(".voteDown").removeClass("inactiveDown"),$(e).find(".voteDown").prop("disabled",!1),$(e).data("votedup",!1),$(e).find(".voteUp").removeClass("inactiveUp"),$(e).find(".voteUp").removeClass("chosenUp"),$(e).find(".voteUp").addClass("up"),$(e).find(".voteUp").prop("disabled",!1)}function checkIfThereArePosts(){$("ul#questionList").children().length<1?$(".posts").append("<p id='noMessages'>Currently there are no questions!</p>"):$("#noMessages").remove()}function voteMessage(e,t,s,o,a){client.publish("/vote",{chosenQuestion:e,voteType:t,voteValue:s,votedUp:o,votedDown:a})}function deleteMessage(e){client.publish("/deleteVote",{chosenQuestion:e})}function sortMessages(e,t){var s=$(".allQuestion");$(s).length>0?($(s).attr("inserted","false"),$(".allQuestion ").children().each(function(){return parseInt($(this).find(".voteCounter").text())<parseInt(t)?($(this).before(e),$(s).attr("inserted","true"),!1):void 0}),"false"==$(s).attr("inserted")&&$(s).append(e)):$(s).append(e),$(s).removeAttr("inserted")}function sortMessagesAsk(e,t){var s=$(".allCurrentQuestion");$(s).length>0?($(s).attr("inserted","false"),$(".allCurrentQuestion").children().each(function(){return parseInt($(this).find(".voteCounter").text())<parseInt(t)?($(this).before(e),$(s).attr("inserted","true"),!1):void 0}),"false"==$(s).attr("inserted")&&$(s).append(e)):$(s).append(e),$(s).removeAttr("inserted")}function sortMessagesModerator(e,t){var s=$(".moderator");$(s).length>0?($(s).attr("inserted","false"),$(".moderator").children().each(function(){return parseInt($(this).find(".voteCounter").text())<parseInt(t)?($(e).addClass("moveUp"),$(this).before(e),$(s).attr("inserted","true"),!1):void 0}),"false"==$(s).attr("inserted")&&$(s).append(e)):$(s).append(e),$(s).removeAttr("inserted")}function changeText(e,t){e.textContent&&"undefined"!=typeof e.textContent&&"NaN"!=typeof e.textContent?e.textContent=t:e.innerText=t}function getTextType(e){var t="";return void 0==e?"NaN":t=e.textContent&&"undefined"!=typeof e.textContent&&"NaN"!=typeof e.textContent?e.textContent:e.innerText}function uniqId(){var e=Math.round(messageId+Math.random()*maxRandomIdGenerator);return e}function showLogoutSidebar(){$("#accountOptions").hasClass("moveRight")?($("#accountOptions").removeClass("moveRight"),$("#baseContent").removeClass("moveRight")):($("#accountOptions").addClass("moveRight"),$("#baseContent").addClass("moveRight"))}function cookiesAreEnabled(){return navigator.cookieEnabled===!0?!0:!1}function localStorageAvailable(){return Modernizr.localstorage?!0:!1}var messageId=0,client=null,indexPagePath="",maxRandomIdGenerator=589;$(document).ready(function(){window.onresize=function(){$(window).width()>700&&$("#rightSide").hasClass("moveUp")&&$("#rightSide").removeClass("moveUp")},checkIfThereArePosts(),$(".questionHeader").on("click",function(){$(window).width()<=700&&($("#rightSide").hasClass("moveUp")?($("#rightSide").removeClass("moveUp"),"block"==$(".errorMessage").css("display")&&$(window).width()<=700&&$("#rightSide").height(175)):$("#rightSide").addClass("moveUp"))}),$("#modLogin").on("click",function(e){var t=$("#username").val(),s=$("#password").val();if($(".errorMessage").text(""),$(".errorMessage").css("display","none"),""!=t&&""!=s){$.ajax({type:"POST",url:"/loginMod/"+t+"/"+s,dataType:"json",error:function(){$(".errorMessage").text("You didn't fill in the correct login!"),$(".errorMessage").css("display","block"),e.preventDefault()},success:function(t){if($(".errorMessage").text(""),$(".errorMessage").css("display","none"),e.preventDefault(),"false"==JSON.stringify(t))$(".errorMessage").text("You didn't fill in the correct login!"),$(".errorMessage").css("display","block");else{$(".errorMessage").text("Y"),$(".errorMessage").css("display","none"),$("#username").val(""),$("#password").val("");var s=$(location).attr("href"),o="";o=$("#wholeContainer").hasClass("moderatorAccount")?s.substr(0,s.indexOf("moderator")):s.substr(0,s.indexOf("ask")),indexPagePath=o,$(location).attr("href",o+"moderator")}}})}else $(".errorMessage").text("You have to fill in both inputs!"),$(".errorMessage").css("display","block")}),calculatePaddingForMessages(),$(".moderatorAccount").on("load",function(){var e=$(location).attr("href"),t=e.substr(0,e.indexOf("moderator"));indexPagePath=t}),$(".ordinaryUser").ready(function(){{var e,t=getTextType($(".category").find("#facebookUserID")[0]);$.ajax({type:"POST",url:"/getVotesByUser/"+t,dataType:"json",error:function(e,t){console.log(t+",  unlucky"),event.preventDefault()},success:function(t){e=t,$("#questionList li.questionItem").each(function(){var t=$(this)[0].id,s=e;$.each(s,function(e,s){var o="message"+s.chat_id,a=s.voteValue,n=s.votedUp,i=s.votedDown;if(t==o)switch(a){case"1up":1==n&&0==i?($("#"+t).data("votedup",!0),$("#"+t).data("voteddown",!1),$("#"+t).find(".voteUp").removeClass("up"),$("#"+t).find(".voteUp").addClass("chosenUp")):0==n&&0==i&&($("#"+t).data("votedup",!1),$("#"+t).data("voteddown",!1),$("#"+t).find(".voteDown").removeClass("chosenDown"),$("#"+t).find(".voteDown").addClass("down"));break;case"2up":1==n&&0==i&&($("#"+t).data("votedup",!0),$("#"+t).data("voteddown",!1),$("#"+t).find(".voteUp").removeClass("up"),$("#"+t).find(".voteUp").addClass("chosenUp"));break;case"1down":0==n&&1==i?($("#"+t).data("votedup",!1),$("#"+t).data("voteddown",!0),$("#"+t).find(".voteDown").removeClass("down"),$("#"+t).find(".voteDown").addClass("chosenDown")):0==n&&0==i&&($("#"+t).data("votedup",!1),$("#"+t).data("voteddown",!1),$("#"+t).find(".voteUp").removeClass("chosenUp"),$("#"+t).find(".voteUp").addClass("up"));break;case"2down":0==n&&1==i&&($("#"+t).data("votedup",!1),$("#"+t).data("voteddown",!0),$("#"+t).find(".voteDown").removeClass("down"),$("#"+t).find(".voteDown").addClass("chosenDown"))}})}),event.preventDefault()}})}}),client=new Faye.Client(indexPagePath+"faye/",{timeout:20});client.subscribe("/message",function(e){var t="<li id='"+e.id+"' data-votedup='false' data-voteddown='false' class='questionItem animateQuestion'><div class='messageCon even "+e.chatMessageType+"'><span class='typeColor"+e.chatMessageType+"'></span><div class='messageConSec'><div class='messageDetails'><div class='profile'><img src='"+e.senderPicURL+"' alt='senderPic'></div><div class='votes'><div class='voteAction'><ul><li><span class='voteUp up'></span></li><li><div class='voteInfo'><h1 class='votesNr'><div class='voteCounter'>0</div></h1></div></li><li><span class='voteDown down'></span></li></ul></div></div></div><div class='messageContent'><div class='name'><h1>"+e.user+" says:</h1></div><div class='text'><h2>"+e.chat+"</h2></div><div class='time'><h3>"+e.chatTime+"</h3></div></div></div></div></li>",s="<li id='"+e.id+"' data-votedup='false' data-voteddown='false' class='questionItem animateQuestion'><div class='messageCon even "+e.chatMessageType+"'><span class='typeColor"+e.chatMessageType+"'></span><div class='messageConSec'><div class='messageDetails'><div class='profile'><img src='"+e.senderPicURL+"' alt='SenderPic'></div><div class='votes'><div class='voteInfo'><h1 class='votesNr'><span class='voteCounter'>0</span> votes</h1></div></div></div><div class='messageContent'><div class='name'><h1>"+e.user+" says:</h1></div><div class='text'><h2>"+e.chat+"</h2></div><div class='time'><h3>"+e.chatTime+"</h3></div></div></div></div></li>",o="<li id='"+e.id+"' data-votedup='false' data-voteddown='false' class='questionItem animateQuestion'><div class='messageCon even "+e.chatMessageType+"'><span class='typeColor"+e.chatMessageType+"'></span><div class='messageConSec'><div class='messageDetails'><div class='profile'><img src='"+e.senderPicURL+"' alt='SenderPic'></div><div class='deleteAction'><span class='delete'></span></div><div class='votesMod'><div class='voteInfo'><h1 class='votesNr'><span class='voteCounter'>0</span> votes</h1></div></div></div><div class='messageContent'><div class='name'><h1>"+e.user+" says:</h1></div><div class='text'><h2>"+e.chat+"</h2></div><div class='time'><h3>"+e.chatTime+"</h3></div></div></div></div></li>";sortMessages(s,0),sortMessagesModerator(o,0),sortMessagesAsk(t,0),calculatePaddingForMessages(),checkIfThereArePosts()});$("#submitQuestion").on("click",function(e){e.preventDefault();var t=getTextType($(".accountname")[0]),s=$("#questionField").val(),o=illegalCharsFound(s),a=illegalCharsFound(t),n=$("#sendTypes input[type='radio']:checked").val(),i=new Date,d=createDateString(i);if(""!=s&&""!=t&&void 0!=n)if(1==o||1==a)$(".errorMessage").text("Your message contains illegal characters like '< >'!"),$(".errorMessage").css("display","block"),$(window).width()<=700&&$("rightSide").height(204);else{$(".errorMessage").text(""),$(".errorMessage").css("display","none"),$(window).width()<=700&&$("#rightSide").height(175);var r=parseInt(getTextType($("span.hiddenMessageCount")[0]));r++;{var c=getTextType($(".category").find("#facebookUserID")[0]),l=getTextType($(".category").find("#facebookUserName")[0]),v=$("#accountPic").attr("src"),u={id:r,message:s,sender:t,chatType:n,chatTime:i,senderPicURL:v,facebookUserID:c,facebookUserName:l};client.publish("/message",{id:"message"+r,chat:s,user:t,chatMessageType:n,chatTime:d,senderPicURL:v,facebookUserID:c,facebookUserName:l})}$("#questionField").val("");{$.ajax({data:{chatContent:u},type:"POST",url:"/create",dataType:"json",error:function(){e.preventDefault()},success:function(t){"true"==JSON.stringify(t)&&$("#sender").attr("src",v),e.preventDefault()}})}changeText($("span.hiddenMessageCount")[0],r)}else $(".errorMessage").text("You must fill in both your message and a message type!"),$(".errorMessage").css("display","block"),$(window).width()<=700&&$("#rightSide").height(204)}),$("#questionList").on("click",".voteUp",function(){var e="#"+$(this).parents(".questionItem")[0].id;$(e).data("votedup")===!1&&$(e).data("voteddown")===!1?($(e).data("votedup",!0),$(e).find(".voteUp").removeClass("up"),$(e).find(".voteUp").addClass("chosenUp"),voteMessage(e,"up","1up",!0,!1)):$(e).data("votedup")===!1&&$(e).data("voteddown")===!0?($(e).data("votedup",!0),$(e).data("voteddown",!1),$(e).find(".voteUp").removeClass("up"),$(e).find(".voteUp").addClass("chosenUp"),$(e).find(".voteDown").removeClass("chosenDown"),$(e).find(".voteDown").addClass("down"),voteMessage(e,"up","2up",!0,!1)):(setInitialVotingSituation(e),voteMessage(e,"up","1down",!1,!1))}),$("#questionList").on("click",".voteDown",function(){var e="#"+$(this).parents(".questionItem")[0].id;$(e).data("voteddown")===!1&&$(e).data("votedup")===!1?($(e).data("voteddown",!0),$(e).find(".voteDown").removeClass("down"),$(e).find(".voteDown").addClass("chosenDown"),voteMessage(e,"down","1down",!1,!0)):$(e).data("voteddown")===!1&&$(e).data("votedup")===!0?($(e).data("voteddown",!0),$(e).data("votedup",!1),$(e).find(".voteDown").removeClass("down"),$(e).find(".voteDown").addClass("chosenDown"),$(e).find(".voteUp").removeClass("chosenUp"),$(e).find(".voteUp").addClass("up"),voteMessage(e,"down","2down",!1,!0)):(setInitialVotingSituation(e),voteMessage(e,"down","1up",!1,!1))});client.subscribe("/vote",function(e){var t=$(e.chosenQuestion).find(".voteCounter")[0],s=e.chosenQuestion,o="#message",a=o.length,n=s.substr(a,s.length),i=parseInt(getTextType(t)),d=e.voteValue,r=getTextType($(".category").find("#facebookUserID")[0]);switch(d){case"1up":i++;break;case"2up":i+=2;break;case"1down":i--;break;case"2down":i-=2}changeText(t,i);{var c={voteValue:d,voteType:e.voteType,votedUp:e.votedUp,votedDown:e.votedDown,voterFacebookID:r};$.ajax({type:"POST",url:"/vote/"+n+"/"+i,data:{voteData:c},dataType:"json",error:function(e,t){console.log(t+",  unlucky"),event.preventDefault()},success:function(e){console.log("geluktsucces, "+e),event.preventDefault()}})}$("ul#questionList").children().length>1&&(sortMessages($(e.chosenQuestion),i),sortMessagesAsk($(e.chosenQuestion),i),sortMessagesModerator($(e.chosenQuestion),i))});$("#questionList").on("click",".delete",function(e){{var t="#"+$(this).parents(".questionItem")[0].id,s=$(this).parents(".questionItem")[0].id,o="message",a=o.length,n=s.substr(a,s.length);$.ajax({type:"POST",url:"/destroy/"+n,dataType:"json",error:function(){e.preventDefault()},success:function(s){"true"==JSON.stringify(s)&&deleteMessage(t),e.preventDefault()}})}});client.subscribe("/deleteVote",function(e){$("#questionList "+e.chosenQuestion).remove()})});