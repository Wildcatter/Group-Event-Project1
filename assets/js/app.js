/*
----Authenticating requests
	Once you have an OAuth token, you must include it on all requests - every request to the OAuth API must be authenticated, no anonymous access is allowed.
	
	You have two options to pass the token: using the authentication header (preferred) or as a query string parameter
	
	Authorization header:
	Just include an Authorization header with the value Bearer MYTOKEN:
	
	Authorization: Bearer 5MWI565BZ5QH5UNU3XV7
	Query string parameter¶
	Include the token on the end of the URL as the token parameter:
	https://www.eventbriteapi.com/v3/users/me/?token=5MWI565BZ5QH5UNU3XV7

----Parameters
	The API accepts parameters in several ways:

	As query string parameters (commonly called “GET parameters”). These are just simple string keys with urlencoded values.
	As form-urlencoded POST body data. Keys here are usually dotted (for example event.name.html - you should include the dots as well.
	As JSON-format POST body data. This is accepted wherever form-encoded POST data is; it’s a series of nested objects with the keys matching the dotted paths of the variable names.
	For example, submitting this as a urlencoded POST body:
	
	event.name.html=Awesome%20Event&event.listed=true
	is the same as submitting this JSON body (notice how the keys match):
	
	{
	    "event": {
	        "name": {
	            "html": "Awesome Event"
	        },
	        "listed": true
	    }
	}
	You cannot mix and match JSON-style inputs and GET/POST style; if you pass a JSON body (or any request body with a Content-Type header set to application/json), all GET and POST parameters will be ignored.

----Getting Events from Eventrbrite
	** Note: go to the link below to see an example of event search parameters available:
	https://www.eventbrite.com/developer/v3/endpoints/events/#ebapi-get-events-search

	Notable items from documentation above:
		-start_date.range_start
		-start_date.range_end
		-location.address
		-location.within
		-categories


*/
// Eventbrite token: D5JWVCEPRXACNC6KHG
// Client Secret: WSRX6O2WIGCMZXHISX35DBDPI5X3IXJWNLDFDI7YRUUPFGQ3E3
// Personal OAuth token: 5MWI565BZ5QH5UNU3XV7
// Anonymout OAuth token: FE7TB42RH5HP5CBOINFE

// Get values from the form inputs
var city = $('#search-city').val();
var category = $('#search-category').val();
var date1 = $('#search-date1').val();
var date2 = $('#search-date2').val();
console.log("City: " + city + " Category: " + category + " Date 1: " + date1 + " Date 2: " + date2);
return false;

// Get the parent element which content will be prepended to
//var parent = $("div#ajax-results");

// Establish query URL, meeting Eventbrite API requirements
var queryUrl = "https://www.eventbriteapi.com/v3/events/?token=5MWI565BZ5QH5UNU3XV7&location= " + city + "&start_date.range_start=" + date1 + "&start_date.range_end=" + date2 + ";
console.log("queryUrl: " + queryUrl);

// AJAX call to get data
$.ajax({
	url: queryUrl, 
	method: "GET"
}).done(function(returnData) {
	console.log(returnData);

	// Throw stuff into main img container
	$('div#gif-content').html(stuff);
})