// JavaScript Document


$(document).ready(function () {

		 requestCurrentPosition();
});


function requestCurrentPosition() 
{ 
	if (navigator.geolocation) 
	{ 
		navigator.geolocation.getCurrentPosition(useGeoData);
	} 
	else
	{
		$(".container").text("Geolocation is not supported by this browser.");
      console.log("Geolocation is not supported by this browser.");
	} 
}


function useGeoData(position) 
{ 
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
	$("#now-degrees").text(today.currentTemp);
	var icon = weatherInfo.currently.icon;
   // localStorage.setItem("icon",icon);
    console.log(icon);

   // var icon = localStorage.getItem("icon");

	var skycons = new Skycons({"color": "white"});
	skycons.set("now-icon", icon);
	skycons.play();

}

//WEATHEROBJ DEFINIEREN
// ALLES NOG MET PROTOTYPE DOEN
var WeatherToday = function(information)
{
	this.longitude = information.longitude;
	this.latitude = information.latitude;
	var convertedDayDate = convertWeatherDate(information.currently.time);
	this.date = convertedDayDate;
	this.currentTemp = Math.round(information.currently.apparentTemperature) + '°';
	this.currentDesc = information.currently.summary;
	this.image = information.currently.icon;
	this.summary = information.hourly.summary;
	this.windspeed = information.currently.windSpeed;
	this.humidity = information.currently.humidity;
	this.tomorrow = information.daily.data[1];
}

function localStorageAvailable()
{
	var LSsupport = !(typeof window.localStorage == 'undefined');
	var result  = false;
	
	if (LSsupport) {
		console.log( "localStorage is available" );
		result = true;
	}
	else
	{
		console.log("localeStorage is not available");
	}
	
	return result;
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
		console.log(locData[1]);

// CHECK OF DE LOCALSTORAGE GESUPPORTEERD IS OF DAT DE LOCALSTORAGE LEEG/NOG NIET GESET IS
// DAN HET WEER OPHALEN VIA DE API
// ANDERS UIT DE LOCALSTORAGE HALEN
// HIERBIJ NOG EEN TIMER PLAATSEN VAN NA HOELANG HET WEER OPNIEUW OPGEHAALD MOET WORDEN, MET COURANTERE DATA !!!!!!!!!!
	if(!localStorageAvailable() || (localStorage.getItem('weatherObj') === null )
		/*|| localStorage.getItem('startHour')*/)
	{
		var request = $.ajax({
							  url: apiUrl,
							  type: "GET",
							  /*data: {latitude : latitude, longitude :longitude}, */
							  dataType: "jsonp",
							  jsonpCallback:"weather"
							});
	
							
		request.done(function(msg) {
			if(localStorageAvailable)
			{
				localStorage.setItem('weatherObj',JSON.stringify(msg));
				console.log(msg);
				// HIER EEN KEY IN LOCALSTORAGE ZETTEN WNR HET EERST IN LOCALSTORAGE GEZET WERD, DAN LATER CHECKEN OF ER
				// EEN UUR VOORBIJ GING EN DAN TERUG IN DEZE LUS GAAN ANDERS IN DE ELSE
				console.log();
			}
			else
			{
				console.log(msg);
			}
				fillInFields(msg);
		  
		});

		request.fail(function(jqXHR, textStatus) {
			   console.log("Request failed: " + textStatus );
			   console.log("Request exceeded");
		});	

	}
	// WNR LOCALSTORAGE WEL AVAILABLE IS, HET UIT DE LOCALSTORAGE HALEN
	// EN HET ADRES VAN DE COORDINATEN OPHALEN
	else
	{
		fillInFields(JSON.parse(localStorage.getItem('weatherObj')));
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

function checkSwitchStatus(p_element)
{
	if(p_element.innerHTML == 'Tomorrow')
	 		p_element.innerHTML = 'Today';
	 	else
	 		p_element.innerHTML = 'Tomorrow';
}
