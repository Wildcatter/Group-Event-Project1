// Firebase database config info
var config = {
    apiKey: "AIzaSyDaPvYALiV1qQwyDxIrIfkwCUerTu_uSiA",
    authDomain: "firstproject-b5d04.firebaseapp.com",
    databaseURL: "https://firstproject-b5d04.firebaseio.com",
    storageBucket: "firstproject-b5d04.appspot.com",
 };
 
// Initialize Firebase for use in app 	
firebase.initializeApp(config);
var database = firebase.database();
const auth = firebase.auth();

// Object for storing event properties and methods specific to any event actions 
var eventObj = {

	/**
	 * Run the ajax call to the Eventbrite api
	 * @param {object} dataObj Contains parameters as an object
	 * @return N/A
	 */
	ajaxCall: function(dataObj) {
		// Retrieve dataObj parameters for easy readability
		var city = dataObj.city;

		// Build query url string
		//var url = "https://www.eventbriteapi.com/v3/events/search/?token=IVKXSGGHO6MZSHMF5QZZ&location.address=" + city + "&categories.id=" + categories + "&location.within=10mi";
		var url = "https://www.eventbriteapi.com/v3/events/search/?token=IVKXSGGHO6MZSHMF5QZZ&location.address=" + city + "&location.within=10mi";
		
		// Run the AJAX call
		$.ajax({
			url: url,
			method: "GET",
		}).done(function(response) {
		
			console.log("Response: " + response.events[1]);
		
			// Loop through each event item
			response.events.forEach(function(item, index, arr) {
		
				// Set easy access to name
				var name = item.name.text;
		
				// Set easy access to date. Format it using moment.js plugin
				var date = moment(item.start.local).format('MMMM Do YYYY');
		
				// Set easy access to event description
				var desc = item.description.text;
				var shorDesc = "";
				var fullDesc = "";
		
				// If there is no item description, set default message. Save long description for modal dropdown
				if (item.description.text != null) {
					longDesc  = desc;
					shortDesc = desc.slice(0, 100) + "...";
				} else {
					longDesc = shortDesc = "No description available.";
				}
				
				// Build string of html content, filling in variable content with response items. fullDesc will be used for modal dropdown of full description
				let html = '<div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 event-box">' +
		                  		'<div class="panel event-content text-center" id="event' + index + '">' +
		                    		'<h3 class="event-name" data-name="' + name + '">' + name + '</h3>' +
		                    		'<p class="event-date" data-date="' + date + '">' + date + '</p>' +
		                    		'<p class="event-desc" data-desc="' + longDesc + '">' + shortDesc + '</p>' +
		                  		'</div>' +
		                  		'<button type="button" class="btn btn-lg btn-block fav-button">Add Favorite</button>' +
		        		  '</div>';
		
		        // Append new event block to div.main
		        $(".main").append(html);
			});
		});
	}
}

$(document).ready(function() {

	// Get the events on initial page load (50 of the first "All" events from the api, all categories)
	var dataObj = {
		city: "austin"
	}
	eventObj.ajaxCall(dataObj);

	// If the user clicks on an event box, show modal with event info (giving greater detail of description etc)
	// Had to start with div.main parent, then narrow down, due to DOM being updated dynamically with events after initial page load
	$('.main').on('click', 'div.event-content', function() {
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

		// Get event description
		data = $(parentId + ' p.event-desc').data("desc");
		$('#modal-event-desc').text(data);

		// Now show the modal
		$('.eventModal').modal("show");
	});
});
// q = events with keyword
// start_date.range_start
// start_date.range_end
//location.address
// location.within
// categories
//response.events[i].description.text
//response.events[i].end.local
// "".name.text
// "" start.local
// "" 

