

'use strict';

// jquery function to to load app
$(document).ready(function () {
	// moment js and 
	// moment current date
	let currentMoment = moment().format("l");

	// moment var's for 5 days of the week, increase each day by 1
	let firstDay = moment().add(1, "days").format("l");
	let secDay = moment().add(2, "days").format("l");
	let thirdDay = moment().add(3, "days").format("l");
	let fourthDay = moment().add(4, "days").format("l");
	let fifthDay = moment().add(5, "days").format("l");

	//global values for city input and city input list

	// city input (user search)
	let cityValue;
	// city input list (past searches list)
	let cityValueList;

	// function to get most recent city search from localStorage 
	function recentSearchLoad() {
		// a variable set to localStorage  get 'mostRecent"
		let latestSearchInput = localStorage.getItem("mostRecent");
		// test for true 
		if (latestSearchInput) {
			// set value to  recent city var 'cityValue'
			cityValue = latestSearchInput;
			citySearch();
			// if none exists city name is "honolulu"
		} else {
			cityValue = "Honolulu";
			// send search value to fetch function
			citySearch();


		}
	};
	// get most recent city search from local storage or set in place text "Honolulu"
	recentSearchLoad();

	// function adds localStorage to city list variable or empty bracket

	function cityListLoad() {
		// variable for get city list 
		let recentCitiesList = JSON.parse(localStorage.getItem("cityValueList"));
		// test true
		if (recentCitiesList) {
			// city list = city value stored parsed
			cityValueList = recentCitiesList;
			// if not set to empty bracket 
		} else {
			cityValueList = [];
		}



	} cityListLoad();


	// submit button on click  to capture event submitted value entered by user
	//event parameter to capture the input
	$('#submitBtnId').on("click", (event) => {
		// prevent default after 'click' fires 
		event.preventDefault();
		//   get submitted value
		getCityValue();
		// sends value to fetch function 
		citySearch();
		// clear input form 
		$('#cityValueId').val("");
		//add cityValue to table td
		tableList();

	});




	// function citySearch() will fetch the chosen city
	function citySearch() {
		let queryURL = "https://leeward-generated-tabletop.glitch.me/weather/"+ cityValue+"&units=imperial" 
		let coordsFetch = [];
		$.ajax({
			url: queryURL,
			method: "GET",


		}).then(function (response) {
			coordsFetch.push(response.coord.lat);
			coordsFetch.push(response.coord.lon);
			// check coordinates
			console.log(response.coord.lat);
			// var's for city response endpoints
			let nameCity = response.name;
			let conditionCity = response.weather[0].description.toUpperCase();
			let tempCity = response.main.temp;
			let humCity = response.main.humidity;
			let windCity = response.wind.speed;
			let icon = response.weather[0].icon;
			//id's assigned to endpoint variables
			$('#icon').html(
				`<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`
			);
			$("#cityNameId").html(nameCity + " " + "(" + currentMoment + ")");
			$("#cityConditionId").text("Current Conditions: " + " " + conditionCity);
			$("#tempId").text("Current Temp (F): " + tempCity.toFixed(1));
			$('#humidityId').text("Humidity: " + humCity + "%");
			$('#windSpeedId').text("Wind Speed:  " + windCity + " mph");
			// daily weather cards time moment js var(1-5 day) as text
			$('#card-1').text(firstDay);
			$('#card-2').text(secDay);
			$('#card-3').text(thirdDay);
			$('#card-4').text(fourthDay);
			$('#card-5').text(fifthDay);
			getUvIndex(response.coord.lat, response.coord.lon);
console.log(getUvIndex(response.coord.lat, response.coord.lon))
		}).fail(function () {
			alert("Could not get data")
		})


	};


	function getUvIndex(lat, lon) {
		 $.ajax({
      url:
        `https://leeward-generated-tabletop.glitch.me/weather/coords/${lat}/${lon}`,

      method: "GET",


		}).then(function (response) {
			// code for UV index scale
			let uvIndex = response.current.uvi;
			$("#uvIndexId").text("Uv Index:" + " " + uvIndex);
			if (uvIndex >= 8) {
				$('#uvIndexId').css("color", "red");
			} else if (uvIndex > 4 && uvIndex < 8) {
				$('#uvIndexId').css("color", "yellow");
			} else {
				$('#uvIndexId').css('color', "lime");
			}
			let highTemp = response.daily[0].temp.max;
			$("#highTemp").text("Expected High (F):" + " " + highTemp);

			// 5-day temperature variables

			let day1Temp = response.daily[1].temp.max;
			let day2Temp = response.daily[2].temp.max;
			let day3Temp = response.daily[3].temp.max;
			let day4Temp = response.daily[4].temp.max;
			let day5Temp = response.daily[5].temp.max;

			// 5-days humidity variables

			let day1humidity = response.daily[1].humidity;
			let day2humidity = response.daily[2].humidity;
			let day3humidity = response.daily[3].humidity;
			let day4humidity = response.daily[4].humidity;
			let day5humidity = response.daily[5].humidity;

			// 5-day weather icons variables

			let day1Icon = response.daily[1].weather[0].icon;
			let day2Icon = response.daily[2].weather[0].icon;
			let day3Icon = response.daily[3].weather[0].icon;
			let day4Icon = response.daily[4].weather[0].icon;
			let day5Icon = response.daily[5].weather[0].icon;

			// 5-day temperature
			$("#temp-1").text("Temp(F): " + "" + day1Temp.toFixed(1));
			$("#temp-2").text("Temp(F): " + "" + day2Temp.toFixed(1));
			$("#temp-3").text("Temp(F): " + "" + day3Temp.toFixed(1));
			$("#temp-4").text("Temp(F): " + "" + day4Temp.toFixed(1));
			$("#temp-5").text("Temp(F): " + "" + day5Temp.toFixed(1));

			// 5-day humidity
			$("#humid-1").text("Hum: " + "" + day1humidity + "%");
			$("#humid-2").text("Hum: " + "" + day2humidity + "%");
			$("#humid-3").text("Hum: " + "" + day3humidity + "%");
			$("#humid-4").text("Hum: " + "" + day4humidity + "%");
			$("#humid-5").text("Hum:" + "" + day5humidity + "%");


			// 5-day icons
			$("#icon-1").html(`<img src="http://openweathermap.org/img/wn/${day1Icon}@2x.png">`);
			$("#icon-2").html(`<img src="http://openweathermap.org/img/wn/${day2Icon}@2x.png">`);
			$("#icon-3").html(`<img src="http://openweathermap.org/img/wn/${day3Icon}@2x.png">`);
			$("#icon-4").html(`<img src="http://openweathermap.org/img/wn/${day4Icon}@2x.png">`);
			$("#icon-5").html(`<img src="http://openweathermap.org/img/wn/${day5Icon}@2x.png">`);








		})
	}










	//function to capture submitted city entry from user
	function getCityValue() {
		// get the id from the input form holding user input set = to global cityValue variable
		cityValue = $('#cityValueId').val();
		// if city list value doesn't include recent input save to local storage function called
		if (cityValue && cityValueList.includes(cityValue) === false) {
			citySaveToLocalStore();
			return cityValue;
			// no city value entered trigger alert
		} else if (!cityValue)

			alert("Please enter a city name, or a city name   (separate with a comma) and state if search applies or city (with a comma) and country")

	}

	// function to save key values: most recent city and push to city list / set list to localStorage
	function citySaveToLocalStore() {
		// set key pair cityValue input
		localStorage.setItem("mostRecentCity", cityValue);
		// push to past city search list 'cityValueList' array
		cityValueList.push(cityValue);
		// set key pair for city past search 'cityValueList' stringified for the dom
		localStorage.setItem("cityValueList", JSON.stringify(cityValueList))



	};
	// function clear cityList text  for each new city input render to html table-row - table- data
	function tableList() {
		// clear table text
		$("#th-PastCitiesId").text("");
		cityValueList.forEach((cityValue) => {
			$("#th-PastCitiesId").prepend("<tr><td>" + cityValue + "</td></tr>")
		});
	} tableList();

	// when document is loaded on click event, takes value of table date
	$(document).on("click", "td", (e) => {
		// prevent default() 
		e.preventDefault();
		// a var set created for event target of the td text
		let getList = $(e.target).text();

		//set the city value variable to the td text in 'getList'
		cityValue = getList;
		citySearch();

	});


	// clear button click handler to remove city past search list, save to local storage city value and city list value
	$('#clearBtnId').on("click", () => {
		//local storage remove past city search list
		localStorage.removeItem('cityValueList');
		//load latest city search
		cityListLoad();
		//load table list
		tableList();





	});





});

















