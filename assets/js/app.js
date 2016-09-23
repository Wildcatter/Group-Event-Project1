// Initialize Firebase
var config = {
  apiKey: "AIzaSyA9gw81RM2br5S9X55E0G6ZGjJMo1oDVRs",
  authDomain: "eventi-testing-db.firebaseapp.com",
  databaseURL: "https://eventi-testing-db.firebaseio.com",
  storageBucket: "eventi-testing-db.appspot.com",
  messagingSenderId: "393804341426"
};

firebase.initializeApp(config);

// Establish easy access to db object
var db = firebase.database();

// For testing purposes, for testing of modal that pops up if user tries to 'Add Favorite', but they are not logged in
var userLoggedIn = false;

// Establish global for database user reference
var usersRef = db.ref("users");

// For testing purposes, to obtain user informtion as if user were logged in
var userId = "757827487";

// Object for storing event properties and methods specific to any event actions, searching, etc
var eventObj = {

	// Set delay interval for ajaxCall(), so the spinner is visible for a minimum period of time (otherwise will go away too fast)
	timeDelay: 530,

    // Set delay interval for generateFavContent() to longer period thatn timeDelay, as it will be too short because there is no ajax call taking up time
    timeDelayFavContent: 930,

	// Set query url as global so that ajaxCall() method may access it without receiving url as parameter 
	// (setTimeout does not allow for passing parameters to fn's)
	queryUrl: "",

    // Set favArray as global so that generateFavContent() may be called inside of setTimeout function
    // (setTimeout does not allow for passing parameters to fn's)
    favArray: [],

	/**
	 * Build the query url string, and execute ajaxCall(), based on dataObj params. 
	 * Separated out from main ajaxCall() function, to properly execute processing spinner
	 * @param {object} dataObj Object containing search params
	 * @return N/A
	 */
	executeQueryUrl: function(dataObj) {
		// Set variables from dataObj items
  	    var city 	        = dataObj.city;
  	    var categoryId      = dataObj.categoryId;
  	    var queryStartDate  = dataObj.queryStartDate;
  	    var queryEndDate    = dataObj.queryEndDate;
	  
  	    // Build url query
  	    eventObj.queryUrl = "https://www.eventbriteapi.com/v3/events/search/?token=IVKXSGGHO6MZSHMF5QZZ&location.address=" + city + "&categories=" + categoryId + "&start_date.range_start=" + queryStartDate + "&start_date.range_end=" + queryEndDate + "&location.within=10mi";
	  
	  	// Load the spinner to indicate processing
		$('div.spinner-div').html('<div class="spinner">Loading...</div>');

		// Run the ajaxCall() method, after timeDelay interval. The spinner is removed once the ajax call is complete.
		setTimeout(eventObj.ajaxCall, eventObj.timeDelay);
	},

	/**
	 * Format the dates to send to the api query, and for updating the main page header
	 * Put in separate function so that it may be used for in several different query form submit scenarios
	 * Note: used for the following scenarios: 
	 * @param
	 * @return
	 */
	formatQueryDates: function(firstDate, lastDate) {
		// Set default date ranges if firstDate == null. Start date == today, end date == 6 months from now
		// Otherwise, set dates based on user input
		// Note: Eventbrite requires date to be in datetime format: "2010-01-31T13:00:00".
        // Default moment.format() function returns "MMMM-DD-YYT00:00:00-00:00". Cut of extra content so that api query works
        // Do not apply moment formatting to the date if the date has not been entered.  moment will return an error if so
        // Note: revisit the possibility of setting localStorage vars for start and end dates, so that category click will return dates from search?
        if(firstDate == null) {
        	firstDate   = new Date();
        	lastDate = moment(firstDate).add(6, 'months');
        } else {
        	firstDate = new Date(firstDate);
        	lastDate = new Date(lastDate);
        }

		var queryStartDate = moment(firstDate).format().slice(0, -6);
		var startDate      = moment(firstDate).format('MM/DD/YYYY');
		var queryEndDate   = moment(lastDate).format().slice(0, -6);
		var endDate        = moment(lastDate).format('MM/DD/YYYY');
		console.log("startDate: " + startDate + " queryStartDate: " + queryStartDate + " endDate: " + endDate + " queryEndDate: " + queryEndDate);
		
		// Return an object containing all correctly formatted date references
		return {
			queryStartDate: queryStartDate,
			startDate: startDate,
			queryEndDate: queryEndDate,
			endDate: endDate
		}
	},

    /**
     * Run the ajax call to the Eventbrite api
     * @param N/A
     * @return N/A
     * Note: this method is executed inside of executeQueryUrl() method
     */
  	ajaxCall: function() {
  	    $.ajax({
  	     url: eventObj.queryUrl,
  	     //url: "https://www.eventbriteapi.com/v3/events/search/?token=IVKXSGGHO6MZSHMF5QZZ&location.address=Austin&categories=103&start_date.range_start=2016-09-22T00:00:00&start_date.range_end=2016-10-25T00:00:00&location.within=10mi",
  	      method: "GET",
  	    }).done(function(response) {
  	    	console.log("typeof response: " + typeof response);
  	    	if(response != undefined) {
  	    		console.log("entered response != '' block");

  	    		// Remove the spinner
  	    		eventObj.removeSpinner();

  	        	// Empty out existing event content
  	        	$('.event-boxes').empty();
	    	
  	        	console.log("Response: " + response.events[1]);
	    	
  	        	// Save the response object as a session variable
  	        	localStorage.setItem("homePage-results", JSON.stringify(response));
	    	
  	        	//console.log("localStorage 'search-results': " + JSON.stringify(response));
  	
  	        	// Now generate the new content, and append it to the main section, replacing existing content
  	        	eventObj.generateSearchContent(response);
  					
  	        } else {
  	        	// This else block doesn't work. Never executes.  Can't figure out how to check for undefined, bc it is always logging as an object
  	        	console.log("entered response false block");
  	        	$('.event-boxes').html('<h3 style="color: #FEDC32;"> Sorry, but there were no events found for your search! </h3>');
  	        }
	    
  	        // Redirect to dashboard page, now that search results have been returned
  	        //window.location="file:///Users/Yo/Desktop/Bootcamp/homework/group-projects/Group-Event-Project1/dashboard.html";
  	    });
  	}, // ajaxCall()

  	/**
  	 * Remove the spinner when the ajax call returns a response
  	 * Item removed inside of div.spinner-div is actually <div class="spinner"></div>
  	 * Put this in a function for ease of readability, and for reuse in case name or structure of spinner operation changes
  	 * @param N/A
  	 * @return N/A
  	 */
  	removeSpinner: function() {
  		$('div.spinner-div').empty();
  	},

  	/**
	 * Create the search event box content cards from an event response data object
	 * This is used by ajaxCall(), as well as the default dashboard page load from the localStorage "response" item
	 * @param {object} response Data containing all of the event search results
	 * @return N/A
	 */
	generateSearchContent: function(response) {
        console.log("event 1: " , response.events[1]);
        console.log("response: " , response);
		// Loop through each event item from the event search response object
		response.events.forEach(function(item, index, arr) {

			// Set easy access to name
			var name = item.name.text;

			// Set easy access to date. Format it using moment.js plugin
			var date = moment(item.start.local).format('MMMM Do YYYY');

            // Set easy access to event time.  Format it using moment.js plugin
            var startTime = moment(item.start.local).format('LT');
            var endTime   = moment(item.end.local).format('LT');
            var time      = startTime + " - " + endTime;

			// Set easy access to event description
			var desc = item.description.text;
			var shorDesc = "";
			var fullDesc = "";

            // Set easy access to event cost. Couldn't get anything to work
            //var cost = "";

            // Set easy access to event category name. Couln't get anything to work
            //var category = "";

            // Set easy acces to event address.  Couldn't get anything to work
            // var address = "";

			// If there is no item description, set default message. Save long description for modal dropdown
			if (item.description.text != null) {
				longDesc  = desc;
				shortDesc = desc.slice(0, 100) + "...";
			} else {
				longDesc = shortDesc = "No description available.";
			}

			// Build string of html content, filling in variable content with response items. fullDesc will be used for modal dropdown of full description
			var html = '<div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 event-box">' +
                            '<div class="panel event-content text-center card-image" id="event' + index + '">' +
                                '<h3 class="event-name" data-name="' + name + '">' + name + '</h3>' +
                                '<p class="event-date" data-date="' + date + '">' + date + '</p>' +
                                '<p class="event-time" data-time="' + time + '">' + time + '</p>' +
                                '<p class="event-desc" data-desc="' + longDesc + '">' + shortDesc + '</p>' +
                                //'<p class="event-cost" data-cost="' + cost + '">' + cost + '</p>' +
                                //'<p class="event-cost" data-category="' + category + '">' + category + '</p>' +
                                //'<p class="event-cost" data-address="' + address + '">' + address + '</p>' +
                            '</div>' +
                            '<button type="button" class="btn btn-lg btn-block fav-button show">add favorite</button>' +
                            '<div class="card-reveal">' +
                                '<span class="card-title">Card Title</span><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>' +
                                '<p>Here is some more information about this product that is only revealed once clicked on.</p>' +
                            '</div>' +
                        '</div>';

		     // Append new event block to div.main
		     $(".event-boxes").append(html);
		});
	}, // generateSearchContent()

    /** 
     * After user clicks their favorite from the side favorites slider, db call generates array of event favorites.  Loop through those and generate content with this function
     * May need to integrate this back into the main generateSearchContent() function, but not sure.  Just strong-arm it for now...
     * the favArray variable is global, as setTimeout doesn't like to have functions inside that are passed params.....
     * @param N/A
     * @return N/A
     */
    generateFavContent: function() {
        // Loop through each event object inside of the events array, creating event cards to put into .event-boxes div container
        eventObj.favArray.forEach(function(item, index, arr) {

            // Set easy access to name
            var name = item.name;

            // Set easy access to date. Format it using moment.js plugin
            var date = item.date;

            // Set easy access to event time.  Format it using moment.js plugin
            var time = item.time;

            // Set easy access to event description. Note:  in other code, this is var desc.  When I tried to do that, it grabbed the last previous desc from the last generated event content box.  Weird.  Some global thing
            //console.log("item desc: " + item.desc);
            var desc = item.desc;
            console.log("desc: " + desc);
            var shortDescription = desc.slice(0, 100) + "...";
            var longDescription = desc;

            // Set easy access to event cost. Couldn't get anything to work
            //var cost = "";

            // Set easy access to event category name. Couln't get anything to work
            //var category = "";

            // Set easy acces to event address.  Couldn't get anything to work
            // var address = "";

            // Note: below is duplicated code.  You need to make this a function in itself to conform to DRY principle
            // Build string of html content, filling in variable content with response items. fullDesc will be used for modal dropdown of full description
            var html = '<div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 event-box">' +
                            '<div class="panel event-content text-center card-image" id="event' + index + '">' +
                                '<h3 class="event-name" data-name="' + name + '">' + name + '</h3>' +
                                '<p class="event-date" data-date="' + date + '">' + date + '</p>' +
                                '<p class="event-time" data-time="' + time + '">' + time + '</p>' +
                                '<p class="event-desc" data-desc="' + longDescription + '">' + shortDescription + '</p>' +
                                //'<p class="event-cost" data-cost="' + cost + '">' + cost + '</p>' +
                                //'<p class="event-cost" data-category="' + category + '">' + category + '</p>' +
                                //'<p class="event-cost" data-address="' + address + '">' + address + '</p>' +
                            '</div>' +
                            '<button type="button" class="btn btn-lg btn-block fav-button show">add favorite</button>' +
                            '<div class="card-reveal">' +
                                '<span class="card-title">Card Title</span><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>' +
                                '<p>Here is some more information about this product that is only revealed once clicked on.</p>' +
                            '</div>' +
                        '</div>';

            // Append new event block to div.main
            $(".event-boxes").append(html);
        });

        // Clear out the global va favArray so that next time favs are clicked, it won't include the previously viewed items....
        eventObj.favArray = [];

        // Remove the spinner
        eventObj.removeSpinner();
    },

    /**
     * Process search field inputs - prepare them for ajax call
     * @param
     * @return {object} dataObj Contains all form input data
     */
    getSearchInputData: function() {
        // Get form inputs. Trim whitespace
        var city         = $('#search-city').val().trim();
        var categoryId   = $('#search-category').val().trim();
        var categoryName = $('#search-category option:selected').data("category");
        var firstDate    = $('#search-date-start').val().trim();
        var lastDate     = $('#search-date-end').val().trim();
        console.log("city: " + city + " categoryId: " + categoryId + " categoryName: " + categoryName + " date1: " + firstDate + " date2: " + lastDate);
  		
  		// Prevent form submit if all inputs are empty
        if(city == "" && categoryId == "" && firstDate == "" && lastDate == "") {
        	// Close the search modal, and then show the alert modal
        	$('.searchModal').modal("hide");
            contentObj.showAlertModal("You didn't enter any search criteria!");
            return false;
        }
  
        // Prevent form submit if there was no city entered.  This is the minimum search requirement
        if(city == "") {
        	// Close the search modal, and then show the alert modal
        	$('.searchModal').modal("hide");
            contentObj.showAlertModal("You must at least enter a city for your search!");
            return false;
        }

  		// Set city location to session var. Note: this is also set in other places. You want to overrite it every time a new search occurs
  		localStorage.setItem("city-location", city);

  		// All inputs are good to go; now format dates for query string and search feedback msg string
  		var dateObj = eventObj.formatQueryDates(firstDate, lastDate);     
        
        // Send search inputs to ajaxCall. Note: ajaxCall will set response data as localStorage item for dashboard.html content generation
        var dataObj = {
            city: city,
            categoryId: 	categoryId,
            categoryName: 	categoryName,
            startDate: 		dateObj.startDate,
            queryStartDate: dateObj.queryStartDate,
            endDate: 		dateObj.endDate,
            queryEndDate: 	dateObj.queryEndDate
        }
  
        return dataObj;
    },

    /**
     * Set search results feedback heading based on searched items
     * @param {object} dataObj All search parameters
     * @return N/A
     */
    getFeedbackMsg: function(dataObj) {
      
        // First, build beginning default string.  
        var msg = '';
    
        // If user entered a category, add that as well
        if(dataObj.categoryName != null) {
            msg += dataObj.categoryName;
        }
    
        // City will ALWAYS be required
        msg += ' events in ' + dataObj.city;
    
        // If date range was entered, add that as well. First, format it back 
        msg += ' ' + dataObj.startDate + ' - ' + dataObj.endDate;
    
        // Set search feedback as localStorage item
        localStorage.setItem("search-feedback", msg);

        // Note: main heading with favorites feedback is updated inside of favorites click handler
    },

    /**
     * Get logged-in user's favorites information, for use in side favorites slider, and event card slider <select> options, and event cards
     * Note: usersRef and userId are global vars established at top of program. userId gets set when user logs in
     * User will not be able to access this function if he/she is not logged in already, so no need to check for login at this point
     *
     */
    getUserFavoritesData: function() {                                                                                          
        // Establish favTitles array for storing titles alone
        var favTitleArray  = [];
        var favEventsArray = [];
        usersRef.child(userId).child("favCategories").on('child_added', function(snapshot) {
            favTitleArray.push(snapshot.key);
            favEventsArray.push(snapshot.val());
            $('.slider-favs').append('<li data-category="' + snapshot.key + '">' + snapshot.key + '</li>');
        });                        
        console.log("favTitleArray: " , favTitleArray);
        console.log("favEventsArray: " , favEventsArray);
    },

    /**
     * Create category dropdowns inside of user side favorites slider
     * 
     *
     */
     /*
    generateUserFavSliderLinks: function(favTitleArray) {
        var content = "<ul>";
        favTitleArray.forEach(function(item) {
            content += "<li>" + item + "</li>";
        });
        content += "</ul>";
        $('.slider-favs').html(content);
    }*/

} // eventObj

var contentObj = {
	/**
	 * Show modal for any system alerts
	 * @param {string} msg The alert message to display
	 * @return N/A
	 */
	showAlertModal: function(msg) {
		// Replace content with param
		$('.alertModal p#modal-alert-msg').text(msg);

		// Show the modal
		$('.alertModal').modal("show");
	}
}

$(document).ready(function() {
    eventObj.getUserFavoritesData();

	// Include the datepicker, from jQuery UI library
  	$("#search-date-start").datepicker();
  	$("#search-date-end").datepicker();

  	// Slide Reveal function for favorites side content
    $("#slider").slideReveal({
        trigger: $("#trigger"),
        push: false,
        overlay: true,
        position: "right",
        speed: 600
    });

    // Card slider for my favorites options
    var slider;

    $('.event-boxes').on('click','.show', function(){
        console.log(this);
        console.log("I clicked");
        var slider = $(this);
        slider.siblings('.card-reveal').slideToggle('slow');
    });
    
    $('.event-boxes').on('click','.close', function(){
        $(this).parent().slideToggle('slow');
    });

	// Get the events on initial page load, if the user used the search form on the main homepage (comes from localStorage var)
	// If user chose to login instead, do not show any events, but show a welcome message
	if(localStorage.getItem("homePage-results") != "") {
		var response = JSON.parse(localStorage.getItem("homePage-results"));
		eventObj.generateSearchContent(response);

		// Now insert the feedback search results into the main heading
		$('.header-span').text(localStorage.getItem("search-feedback"));

		console.log("The page should have loaded the homepage search results!");
	} else {
		$(".event-boxes").append("<h3> Hello, [username]!  What are you looking for today? </h3>");
	}

	// If the user clicks on an event box, show modal with event info (giving greater detail of description etc)
	// Had to start with div.main parent, then narrow down, due to DOM being updated dynamically with events after initial page load
	$('.event-boxes').on('click', 'div.event-content', function() {
		console.log("this: " + this);

		// Get the parent element for reference
		var parentId = "#" + $(this).attr("id");
		console.log("parentId: " + parentId);

		// Fill in the div.eventModal elements with updated content
		var data;

		// Get event name
		data = $(parentId + ' h3').data("name");
		$('#modal-event-name').text(data);

		// Get event date
		data = $(parentId + ' p.event-date').data("date");
		$('#modal-event-date').text(data);

        // Get event time
        data = $(parentId + ' p.event-time').data("time");
        $('#modal-event-time').text(data);

		// Get event description
		data = $(parentId + ' p.event-desc').data("desc");
		$('#modal-event-desc').text(data);

		// Now show the modal
		$('.eventModal').modal("show");
	});

	// On click function to display only the events within that specific category
	// Note: user's location will be based on session var, which is based on either A) auto location at login, or B) via event search form
	$('.click-option').on('click', function(){
		// Set city based on location session var
		if(localStorage.getItem("city-location") != null) {
			var city = localStorage.getItem("city-location");
		} else {
			// Note: just as a fail-safe, set a default city.  YOU DON"T want to ever actually have to use this, dude!!
			var city = "Austin";
		}

		// Assign the data from the button to eventInfo
		var categoryId = $(this).data("id");
		console.log("categoryId: " + categoryId);

		// Get the category name
		var categoryName = $(this).data("category");
		console.log("categoryName: " + categoryName);

		// Set and format default date range for query search and search feedback heading string. Function will return object with date properties
		var firstDate = null;
		var lastDate  = null;
		var dateObj   = eventObj.formatQueryDates(firstDate, lastDate);		
		
        // Run Ajax function
        var dataObj = {
            city: 			city,
            categoryId: 	categoryId,
            categoryName: 	categoryName,
            startDate: 		dateObj.startDate,
            queryStartDate: dateObj.queryStartDate,
            endDate: 		dateObj.endDate,
            queryEndDate: 	dateObj.queryEndDate
        }

        eventObj.executeQueryUrl(dataObj);

        // Update the search feedback main heading
        eventObj.getFeedbackMsg(dataObj);
	});

	// Process search modal submit
    $('#modal-search-submit').on('click', function() {
        // Get form input data and process so it is ready to send to the api ajax call
        var dataObj = eventObj.getSearchInputData();

        // Check for false return from getSearchInputData(), to prevent spinner from executing
        if(!dataObj) {
          return false;
        }

        // Execute the ajax call, and save response to localStorage
        eventObj.executeQueryUrl(dataObj);

        // Set the search feedback message, and save to localStorage
        eventObj.getFeedbackMsg(dataObj);

    });

	// If user clicks 'Add Favorite' button, show alert modal if user is not logged in yet
	$('.fav-button').on('click', function(){
		if(!userLoggedIn) {
			contentObj.showAlertModal("You must be logged in to save favorites!");
		}
	});

	// If user clicks "Find Events" button, show event search modal
	$('button#find-events-btn').on('click', function() {
		$('.searchModal').modal("show");
	});

	// If user enters new city into location input, set localStorage item to that city
	// To-do:  Do we want to make it so that this action also populates 'all events' in that location by default?? Sure!!
	$('.location-icon').on('click', function() {
		// Get the text in the input
		var city = $('.location-input').val().trim();

		// Set city to local storage
		localStorage.setItem("city-location", city);
		console.log("localStorage city: " + city);

		// Set categoryId == "", as default load for change location action == all categories
		var categoryId = "";

		// Set categoryName == "all events" for change location main heading feedback
		var categoryName = "all events";

		// Show fadeIn/fadeOut feedback to user for successful location set
		$('p.location-input-feedback').text(city + " location Set Successfully!").fadeIn(1000).fadeOut(2000);

		// Empty out the text that user just submitted
		$('.location-input').val("");

		// Set and format default date range for query search and search feedback heading string. Function will return object with date properties
		// Note: might want to revisit the possibility of setting date range to == localStorage dates, instead of default, in some cases
		var firstDate = null;
		var lastDate  = null;
		var dateObj   = eventObj.formatQueryDates(firstDate, lastDate);	

		// Generate new result set, setting event categoryId to null & categoryName to "all events" to retrieve 'all events', and new city location as the location
		var dataObj = {
			city: city,
            categoryId: 	categoryId,
            categoryName: 	categoryName,
            startDate: 		dateObj.startDate,
            queryStartDate: dateObj.queryStartDate,
            endDate: 		dateObj.endDate,
            queryEndDate: 	dateObj.queryEndDate
		}
		// Execute the query
		eventObj.executeQueryUrl(dataObj);

		// Generate feedback message
		eventObj.getFeedbackMsg(dataObj);
	});

    // If user clicks on a favorites link from the right-side slider menu, get and generate event content boxes 
    // Event box content comes from data stored in the db; the key associated with the event will be the exact string of the data-category attr
    // This category string is plugged into the data retrieval db function
    $('.slider-favs').on('click', 'li', function() {

        // Close the slider panel
        $('#slider').slideReveal("hide");

        // Get the category name (same as db key) for the favorites bucket
        var category = $(this).data("category");
        console.log("category from li: " + category);

        // Find the category in the db under the user's record. THIS WORKS!!
        // Note: switched to favArray global, so that setTimeout generateFavContent() doesn't have to be passed a param (setTimeout doesn't like that)
        //var events = [];

        usersRef.child(userId).child("favCategories").child(category).on("child_added", function(snapshot) {
            eventObj.favArray.push(snapshot.val());
        });
        console.log("user events from fav slider click: " , eventObj.favArray);
        console.log("typeof Events: " + typeof eventObj.favArray);

        /* this gets the object, but I can't loop through it, I need to access it at the next level, and put each object into an array instead
        usersRef.child(userId).child("favCategories").child(category).once("value").then(function(snapshot) {
            events = snapshot.val();
            console.log("user events from fav slider click: " , events);
            console.log("typof Events: " + typeof events);
        });*/

        // Load the spinner to indicate processing. Note: spinner is removed inside of generateFavContent() function
        $('div.spinner-div').html('<div class="spinner">Loading...</div>');

        // Empty content here, before adding content
        $('.event-boxes').empty();

        // Update the heading (incorporate this into getFeedbackMsg() function eventually). or maybe not...bc it's pretty different...
        $('.header-span').text("Browsing your " + category + " event favorites");

        // Fake the 'delay', to simulate processing, or it will happen too fast
        setTimeout(eventObj.generateFavContent, eventObj.timeDelayFavContent);

        /* I put this inside of generateFavContent() method....
        // Empty out existing event content
        $('.event-boxes').empty();
        // Loop through each event object inside of the events array, creating event cards to put into .event-boxes div container
        events.forEach(function(item, index, arr) {

            // Set easy access to name
            var name = item.name;

            // Set easy access to date. Format it using moment.js plugin
            var date = item.date;

            // Set easy access to event time.  Format it using moment.js plugin
            var time = item.time;

            // Set easy access to event description. Note:  in other code, this is var desc.  When I tried to do that, it grabbed the last previous desc from the last generated event content box.  Weird.  Some global thing
            //console.log("item desc: " + item.desc);
            var desc = item.desc;
            console.log("desc: " + desc);
            var shortDescription = desc.slice(0, 100) + "...";
            var longDescription = desc;

            // Set easy access to event cost. Couldn't get anything to work
            //var cost = "";

            // Set easy access to event category name. Couln't get anything to work
            //var category = "";

            // Set easy acces to event address.  Couldn't get anything to work
            // var address = "";

            // Build string of html content, filling in variable content with response items. fullDesc will be used for modal dropdown of full description
            let html = '<div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 event-box">' +
                            '<div class="panel event-content text-center card-image" id="event' + index + '">' +
                                '<h3 class="event-name" data-name="' + name + '">' + name + '</h3>' +
                                '<p class="event-date" data-date="' + date + '">' + date + '</p>' +
                                '<p class="event-time" data-time="' + time + '">' + time + '</p>' +
                                '<p class="event-desc" data-desc="' + longDescription + '">' + shortDescription + '</p>' +
                                //'<p class="event-cost" data-cost="' + cost + '">' + cost + '</p>' +
                                //'<p class="event-cost" data-category="' + category + '">' + category + '</p>' +
                                //'<p class="event-cost" data-address="' + address + '">' + address + '</p>' +
                            '</div>' +
                            '<button type="button" class="btn btn-lg btn-block fav-button show">add favorite</button>' +
                            '<div class="card-reveal">' +
                                '<span class="card-title">Card Title</span><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>' +
                                '<p>Here is some more information about this product that is only revealed once clicked on.</p>' +
                            '</div>' +
                        '</div>';

             // Append new event block to div.main
             $(".event-boxes").append(html);
        });*/

        /*
        db.ref("users/" + userId + "/favCategories/" + category).once("value").then(function(snapshot) {
            var events = snapshot.child(category).val();
            console.log("user events from fav slider click: " , events);
        });*/
    });

	// Also allow user to submit city location input via keyboard enter key
	$('.location-input').keypress(function(e) {
		if(e.which == 13) {
			// Run the click handler for location input action
			$('.location-icon').click();
		}
	});

    /* db test data */
    /* This is the actual starter database (may have added/altered since) 
    db.ref().set({
      users: {
        4738473827: {
          name: "Jeff",
          email: "mt@m.com",
          favCategories: {
            "DC Trip": [
              {
                name: "Blades of Glory",
                date: "07/07/16",
                Time: "7:15pm",
                desc: "Presentation by author Michael Reyes, where he discusses the livelihood of hog farming.",
                location: "2025 E 7th St, Washington, DC 20002"
              },

              {
                name: "Jazz in the Garden",
                date: "07/08/16",
                time: "5:30pm",
                desc: "Get down with some funk jazz, courtesy of the Robert Hickman band, man!",
                location: "700 Georgia St, Austin, Tx 78702"
              },
              
              {
                name: "Nasty Cereal",
                date: "07/10/16",
                time: "7:00pm",
                desc: "Author Michael Pollen explains why eating cereal is bad for you in the engaging presentation.",
                location: "Haper Ave, Austin, TX 23438"
              }
            ],
          
            "October Must-Dos": [
              {
                name: "Sun Britches",
                date: "10/01/16",
                time: "7:00pm",
                desc: "Scientist Sarah Gaslschak explains why being out in the sun is healthy for you.",
                location: "2025 E 7th St"
              },

              {
                name: "Blades of Fayyyce",
                date: "10/07/16",
                time: "4:30pm",
                desc: "A modern play satirizing the popularity of dogs.",
                location: "13 Bitch St, Houston, TX 28394"
              },
              
              {
                name: "The Dodge Paradox",
                date: "10/15/16",
                time: "10:00am",
                desc: "Watch a movie about the only dodge project ever that was aimed at producing a spaceship.",
                location: "10 Service St, Washi"
              }
            ],

            "Spring '16 NYC Trip": [
              {
                name: "Blades of Soccer",
                date: "03/07/16",
                time: "07:15pm",
                desc: "Go down in blades of glory, with Brazil football club celebration, man!",
                location: "1 NYC Drive, New York, NY 28391 "
              },
              
              {
                name: "The Mormon Tabernacle",
                date: "03/09/16",
                time: "8:15pm",
                desc: "Sing hymns with the mormon historical society!",
                location: "10 Geneve St, New York, NY 39405"
              },
              
              {
                name: "Pinballs Over Brooklyn",
                date: "03/10/16",
                time: "5:30pm",
                desc: "Go see a bunch of vintage pinball machines!",
                location: "12 Balls St, New York, NY 94839"
              }
            ]
          } // favCategories
        },
        // Note: this is the one that's used for the system testing.  
        // This information source (before insertion) comes from the data atrributes on the event card, 
        // so the data here in the db will be exactly as presented inside of the html data attributes
        757827487: {
          name: "Michael",
          email: "m@h.com",
          favCategories: {
            "Bday Month": [
              {
                name: "DJ Strong",
                date: "September 21st 2016",
                time: "9:00 PM - 2:00 AM",
                desc: "Empire is a 15,000 square foot modern music space at 7th and Red River, dedicated to presenting quirky, warehouse style events that feel more like adventurous discoveries than everyday affairs. Doors: 9:00PM Age: Free w/ RSVP or $5 at door without RSVP // 18+ $5 surcharge"
              },
              
              {
                name: "Blades of They Infinite Knowledge",
                date: "October 18th 2016",
                time: "6:45 PM - 11:15 PM",
                desc: "See the new men's razor blades Blades of Z exhibit.  They will convince you to strut your stuff, and flaunt your longest beard hairs, no doubt.  You are going to rock out with your cock out, and the event will kick major ass."
              },
              
              {
                name: "Tony Hawk Competition",
                date: "November 21st 2016",
                time: "3:30 PM - 7:45 PM",
                desc: "Go play Tony Hawk like you used to, against other Tony Hawk enthusiasts!  Get some serious air with Officer Dick, and do some aeoli surprises, to wow the crowd.  The best performer will get front-row tickets to the hottest music event of the season, 'Enya Performs Live at Luther College'"
              }
            ],
  
            "Nov '16 Fall Trip": [
              {
                name: "Hit The Links Extravaganza",
                date: "September 10th 2016",
                time: "7:15 PM - 1:30 AM",
                desc: "Go play some golf at night-time, recently voted 'The Best Time Ever To Play Golf', by Gentlemen's Quarterly magazine.  You will use glow-in-the-dark golf balls, and if you hit any fellow competitors, you get extra points, and some dates with Victoria's Secret models.  Don't miss it!"
              },
              
              {
                name: "Blades of They Knowledge 2",
                date: "July 15th 2017",
                time: "2:30 AM = 7:15 AM",
                desc: "See Belmont University's hottest band, 'Blades of Kaaaaawledge', play Enya covers, rap style.  This is the only event of its kind, c/o Belmont University's awesome student musicians.  You won't forget this event; bring friends!"
              },
              
              {
                name: "Coming To Terms With Eating Fruit",
                date: "August 13th 2017",
                time: "5:30 PM - 2:00 AM",
                desc: "Have you ever wondered why some people eat fruit and some don't? Well you are not alone!  There are lots of people out there, just like you.  Come join us to talk about this fruit anxiety, and become comfortable with the fact that you eat more fruit than most people out there!"
              }
            ],

            "LR Work Trip" : [
              {
                name: "Eat Italian Night",
                date: "October 21st 2016",
                time: "8:00 PM - 11:45 PM",
                desc: "Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian Italian food"
              },
              
              {
                name: "Wizard of Oz Meets Dark Side of The Moon",
                date: "December 21st 2016",
                time: "5:45 PM - 12:30 AM",
                desc: "Come watch the ever-so-creepy Wizard of Oz with us, while we play Pink Floyd's 'Dark Side of the Moon' album, which ever-so-creepily goes right along with the ever-so-creepy, kids-shouldn't-watch-this-scary-movie movie.  You will be amazed!"
              },
              
              {
                name: "The Time Has Come For Comptetition Canoeing",
                date: "November 5th 2016",
                time: "4:30 PM - 7:30 PM",
                desc: "Were you inspired by the power-canoeing in this year's recent Summer Olympics?  Well, we were too.  So we decided to get an event together where normal people that aren't so great at canoeing will fight to the death to get to the finish line first, before their fellowing canoers.  This is a 'Don't miss' one of a kind event!"
              }
            ]
          } // favCategories
        },

        888828838: {
          name: "Harry",
          email: "m@harry.com",
          favCategories: {
            "Piano Fest": [
              {
                name: "Blades of Glory",
                date: "07/07/16",
                time: "10:00pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Jazz",
                date: "07/07/16",
                time: "6:30pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Nast",
                date: "07/07/16",
                time: "4:45pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],
    
            "Music To See": [
              {
                name: "Blades of Bitches",
                date: "07/07/16",
                time: "8:00pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Fayyyce",
                date: "07/07/16",
                time: "8:15pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Dodge",
                date: "07/07/16",
                time: "9:00pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],

            "Plays To See": [
              {
                name: "Blades of The Sista",
                date: "07/22/16",
                time: "9:00pm",
                desc: "Play commenting on the social norm of 'couter-challenging' in America.",
                location: "2025 E 7th St, Austin, TX 894838"
              },
              
              {
                name: "Golf's Greatest Mysteries",
                date: "11/07/16",
                time: "8:30pm",
                desc: "Watch the infamous Isaac Bich Take on Rutherford B. Hayes.",
                location: "80 Jefferson St, Austin, TX 38473"
              },
              
              {
                name: "Tom's Malfunctions",
                date: "12/09/16",
                time: "7:30pm",
                desc: "Go down in blades of glory, man!",
                location: "40 E Gary St., Austin, Tx 38483"
              }
            ]
          } // favCategories
        },

        111627626: {
          name: "Isaac",
          email: "m@isaac.com",
          favCategories: {
            "Talks To See": [
              {
                name: "Blades of Glory",
                date: "07/07/16",
                time: "7:15pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },

              {
                name: "Blades of Jazz",
                date: "07/07/16",
                time: "6:15pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },

              {
                name: "Blades of Nast",
                date: "07/07/16",
                time: "7:30pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],
    
            "Art Exhibits To See": [
              {
                name: "Blades of Bitches",
                date: "07/07/16",
                time: "7:15pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Fayyyce",
                date: "07/07/16",
                time: "10:15am",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Dodge",
                date: "07/07/16",
                time: "7:25pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],

            "Winter CO Ski Trip": [
              {
                name: "Blades of Soccer",
                date: "07/07/16",
                time: "6:45pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Golf",
                date: "07/07/16",
                time: "5:30pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Pinball",
                date: "07/07/16",
                time: "4:30pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ]
          } // favCategories
        } // player unique id
      } // users
    }); // set function */
});