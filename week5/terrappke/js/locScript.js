// JavaScript Document

var receivedPosition=false;

$(document).ready(function () {
	var d = new Date();
	var thirtyMinsAgo = d.getTime() - 3600000; //3600000 milisec = 60 mins
	
	if(localStorageAvailable())
	{
		var information = localStorage.getItem('weatherObj');
    	var weatherTimestamp = localStorage.getItem("weatherTimestamp");

    	if (information === null)
	    {
	    	requestCurrentPosition();
	    }
	    else
	    {
	        // als timestamp in mili groter is dan nu-30mins
	        if(weatherTimestamp>thirtyMinsAgo)
	        {
	            fillInFields(JSON.parse(information));
	        }
	        else
	        {
	        	//opnieuw gegevens ophalen
	        	requestCurrentPosition();  
	        }
	    }    
	}
	else
	{
		requestCurrentPosition();  
	}

    
    
});


function requestCurrentPosition() 
{ 
	if (navigator.geolocation) 
	{ 
		setTimeout(function() { waitShowError() }, 5000);
		navigator.geolocation.getCurrentPosition(useGeoData,showError);
	} 
	else
	{
		getDefaultLocForWeather();
		$("#dynamic").text("Geolocation is not supported by this browser.");
      //console.log("Geolocation is not supported by this browser.");
	} 
}

// Firefox geeft bij locatie sharing de mogelijkheden 'share', 'not share' en 'not now'
// de rest van de weigeringen of fouten worden goed opgevangen, enkel 'not now' niet
// vandaar deze functie, 'not now' = bug in firefox en geeft niet echt een beslissing weer
// daarom dat we effe wachten op antwoord, wanneer er niets komt, wordt automatisch een error opgevangen
// bij deze wordt dus ook default alles van mechelen opgehaald
function waitShowError()
{
    if(!receivedPosition){
        var err = new Error();
        err.code=1;
        showError(err);
        //showError();
    }
}


function useGeoData(position) 
{ 
	receivedPosition=true;
	var longitude = position.coords.longitude; 
	var latitude = position.coords.latitude; 
	//console.log(longitude + " " + latitude); 

	var locData = new Array();
	locData.push(latitude, longitude);
	
// METHODE OM SOMS DE LOCALSTORAGE TE CLEAREN OM DE ONDERSTAANDE CODE TE TESTEN
//	clearLocalStorage();
	
	// VB: https://api.forecast.io/forecast/54317a33b94f022482a2bc22463cc986/37.8267,-122.423
	//     https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE

	var apiUrl = "https://api.forecast.io/forecast/54317a33b94f022482a2bc22463cc986/" + latitude + "," + longitude + "?callback=?&units=si";
	locData.push(apiUrl);
	getApiData(locData);
		//console.log(apiUrl);
}


function fillInFields(weatherInfo)
{
	var today = new WeatherToday(weatherInfo);
// IN JQUERY ZETTEN
	$("#now-degrees").text(today.currentTemp + '°');
	var icon = weatherInfo.currently.icon;
   // localStorage.setItem("icon",icon);
    //console.log(icon);

   // var icon = localStorage.getItem("icon");

	var skycons = new Skycons({"color": "white"});
	skycons.set("now-icon", icon);
	skycons.play();

	console.log(today.currentTemp);

	//dynamische achtergrondkleur en h1
	if(today.currentTemp<0){
	  $("#dynamic").text("Jammer genoeg nog veel te koud voor terrappkes weer. Stay tuned!");
	  $('body').css('background-color', '#b6d8ec');
	}else if(today.currentTemp>0 && today.currentTemp<=5){
	  $("#dynamic").text("Het is berenkoud! Nog even geduld en het is terrappkes weer.");
	  $('body').css('background-color', '#81bcde');
	}else if(today.currentTemp>5 && today.currentTemp<=10){
	  $("#dynamic").text("Op dit moment is het nog te koud voor een terrappke. Hang on!");
	  $('body').css('background-color', '#81bcde');
	}else if(today.currentTemp>10 && today.currentTemp<=15){
	  $("#dynamic").text("Nog een paar graden hier en het is terrappkes tijd!");
	  $('body').css('background-color', '#40d0bd');
	}else if(today.currentTemp>15 && today.currentTemp<=20){
	  $("#dynamic").text("Warm genoeg voor een terrappke!");
	  $('body').css('background-color','#faaa37');
	}else if(today.currentTemp>20 && today.currentTemp<=25){
	  $("#dynamic").text("Warm weer betekent terrappkes tijd!");
	  $('body').css('background-color','#f9832d');
	}else if(today.currentTemp>25 && today.currentTemp<=30){
	  $("#dynamic").text("Het is nu super goed weer. Klaar voor een terrappke!");
	  $('body').css('background-color', '#f9672d');
	}else if(today.currentTemp>30){
	  $("#dynamic").text("Het is geweldig warm hier. Kom mee een terrappke doen!");
	  $('body').css('background-color', '#f94f2d');
	}
}

//WEATHEROBJ DEFINIEREN
// ALLES NOG MET PROTOTYPE DOEN
var WeatherToday = function(information)
{
	this.longitude = information.longitude;
	this.latitude = information.latitude;
	var convertedDayDate = convertWeatherDate(information.currently.time);
	this.date = convertedDayDate;
	this.currentTemp = Math.round(information.currently.apparentTemperature);
	this.currentDesc = information.currently.summary;
	this.image = information.currently.icon;
	this.summary = information.hourly.summary;
	this.windspeed = information.currently.windSpeed;
	this.humidity = information.currently.humidity;
	this.tomorrow = information.daily.data[1];
}

function localStorageAvailable()
{
	/*var LSsupport = !(typeof window.localStorage == 'undefined');
	var result  = false;
	
	if (LSsupport) {
		//console.log( "localStorage is available" );
		result = true;
	}/*
	/*else
	{
		console.log("localeStorage is not available");
	}*/
	
	//return result;

	if (Modernizr.localstorage) {
	  // window.localStorage is available!
	  return true;
	} else {
	  // no native support for local storage :(
	  // try a fallback or another third-party solution
	  return false;
	}
}

function clearLocalStorage()
{
	localStorage.clear();
}


function getApiData(locData)
{
	
		var longitude = locData[1];
		var latitude = locData[0];
		var apiUrl = locData[2];
		//console.log(locData[1]);

// CHECK OF DE LOCALSTORAGE GESUPPORTEERD IS OF DAT DE LOCALSTORAGE LEEG/NOG NIET GESET IS
// DAN HET WEER OPHALEN VIA DE API
// ANDERS UIT DE LOCALSTORAGE HALEN
// HIERBIJ NOG EEN TIMER PLAATSEN VAN NA HOELANG HET WEER OPNIEUW OPGEHAALD MOET WORDEN, MET COURANTERE DATA !!!!!!!!!!
	if(!localStorageAvailable() || (localStorage.getItem('weatherObj') === null )
		/*|| localStorage.getItem('startHour')*/)
	{
		$(".loadingImage").show();
		var request = $.ajax({
							  url: apiUrl,
							  type: "GET",
							  /*data: {latitude : latitude, longitude :longitude}, */
							  dataType: "jsonp",
							  jsonpCallback:"weather"
							});
	
							
		request.done(function(msg) {
			if(localStorageAvailable())
			{
				localStorage.setItem('weatherObj',JSON.stringify(msg));
				//console.log(msg);
				// HIER EEN KEY IN LOCALSTORAGE ZETTEN WNR HET EERST IN LOCALSTORAGE GEZET WERD, DAN LATER CHECKEN OF ER
				// EEN UUR VOORBIJ GING EN DAN TERUG IN DEZE LUS GAAN ANDERS IN DE ELSE
				//console.log();

				//timestamp zetten
            	var d = new Date();
            	localStorage.setItem("weatherTimestamp",d.getTime());  
			}
			/*else
			{
				console.log(msg);
			}*/

				fillInFields(msg);
		  		$(".loadingImage").hide();
		});

		request.fail(function(jqXHR, textStatus) {
			   console.log("Request failed: " + textStatus );
			   console.log("Request exceeded");

		  		$(".loadingImage").hide();
		});	

	}
	// WNR LOCALSTORAGE WEL AVAILABLE IS, HET UIT DE LOCALSTORAGE HALEN
	// EN HET ADRES VAN DE COORDINATEN OPHALEN
	else
	{
		fillInFields(JSON.parse(localStorage.getItem('weatherObj')));

		$(".loadingImage").hide();
	}
}


function convertWeatherDate(currentDate)
{
	var weekday=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
	var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");

	var now = new Date(currentDate *1000); 
	var convertedDt = weekday[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()]
	//console.log(convertedDt);
	return convertedDt;
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}



function getDefaultLocForWeather()
{
	var defaultLocation = "mechelen";
		var lookUpCoordinatesURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + defaultLocation + "&sensor=true&key=AIzaSyDUIM8sdw7oiw5UlzVPHOm84Xmaue3rl4g";
		//console.log(lookUpCoordinatesURL);

		var request = $.ajax({
							url: lookUpCoordinatesURL,
							type: "GET",
							/*data: {latitude : latitude, longitude :longitude}, */
							dataType: "json"
		});

		request.done(function(msg) {

						console.log(msg);
						currentLat = msg.results[0].geometry.location.lat;
						currentLon = msg.results[0].geometry.location.lng;
						//console.log(currentLat);
						//console.log(currentLon);

						var locWeather = Array();
						locWeather.push(currentLat,currentLon );

						var newUrl = "https://api.forecast.io/forecast/54317a33b94f022482a2bc22463cc986/" + currentLat + "," + currentLon + "?callback=?&units=si";
						locWeather.push(newUrl);
						//console.log(newUrl);
						getApiData(locWeather);
				});

				request.fail(function(jqXHR, textStatus) {
					   console.log("Request failed: " + textStatus );
					   console.log("Request exceeded");
				});
}

function showError(error)
  {
  /*switch(error.code)
    {
    case error.PERMISSION_DENIED:
      getDefaultLocForWeather();
      break;
    case error.POSITION_UNAVAILABLE:
     getDefaultLocForWeather();
      break;
    case error.TIMEOUT:
      getDefaultLocForWeather();
      break;*/
  /*  case error.UNKNOWN_ERROR:*/
  console.log("error");
      getDefaultLocForWeather();
     /* break;
    }*/
  }
