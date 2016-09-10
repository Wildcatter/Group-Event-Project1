

 		// Get the parent element which content will be prepended to
 		var parent = $("div#ajax-results");

 		// Your token with Eventbrite for stuff: D5JWVCEPRXACNC6KHG

 		// Establish query URL, metting Eventbrite API
 		var queryUrl = "http://api.";
 		console.log("queryUrl: " + queryUrl);

 		// AJAX call to get data
 		$.ajax({
 			url: queryUrl, 
 			method: "GET"
 		}).done(function(returnData) {
 			console.log(returnData);
 			var stuff = "";

 			// Loop through returnData.  Note:  is an object.  Must reference 'data' to access the array
 			returnData.data.forEach(function(item,index,arr) {
 				// Make sure that there is text for rating.  If not, will throw off layout rows. Make all ratings upper-case for good presentation
 				var rating = (arr[index].rating == "") ? "N/A" : arr[index].rating.toUpperCase();

 				// Add all html into var stuff
 				stuff += '<div class="col-xs-6 col-sm-6 col-md-4 col-lg-3 placeholder">' +
                        	'<img src="' + arr[index].images.fixed_height_still.url + '" data-still="' + arr[index].images.fixed_height_still.url + '" data-animate="' + arr[index].images.fixed_height.url + '" width="auto" height="200" class="img-responsive" alt="Generic placeholder thumbnail">' +
                        	'<h4>Rating</h4>' + 
                        	'<span class="rating">' + rating + '</span>' +
                    	  '</div>';
 				//console.log("img animated string: " + arr[index].images.fixed_height.url + "\n img still string: " + arr[index].images.fixed_height_still.url + "\n + rating: " + arr[index].rating);
 			});

 			// Throw stuff into main img container
 			$('div#gif-content').html(stuff);
 		})
 	}, 