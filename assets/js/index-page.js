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

$(document).ready(function() {

	// Include the backstretch plugin to make the background images fully responsive and rotating
	$.backstretch(
		[
  	      "assets/img/chicago-new.jpg",
  	      "assets/img/flaming-lips.jpg",
  	      "assets/img/concert-image-02.jpg"
  		],
  		// Duration == pause time, fade == transition time
  		{
  			duration: 6000,
  			fade: 1400
  		}
  	);

  	// Include the datepicker, from jQuery UI library
  	$("#search-date1").datepicker();
  	$("#search-date2").datepicker();

    // Produce event result content when user submits main page form
    /*
    db.ref().set({
      users: {
        4738473827: {
          name: "Jeff",
          email: "mt@m.com",
          favCategories: {
            music: {
              event1: {
                name: "Blades of Glory",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event2: {
                name: "Blades of Jazz",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event3: {
                name: "Blades of Nast",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            },

            arts: {
              event1: {
                name: "Blades of Bitches",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event2: {
                name: "Blades of Fayyyce",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event3: {
                name: "Blades of Dodge",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            },
            sports: {
              event1: {
                name: "Blades of Soccer",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event2: {
                name: "Blades of Golf",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event3: {
                name: "Blades of Pinball",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            }
          } // favCategories
        },
        757827487: {
          name: "Michael",
          email: "m@h.com",
          favCategories: {
            music: {
              event1: {
                name: "Blades of 1",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event2: {
                name: "Blades of 2",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event3: {
                name: "Blades of 3",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            },

            arts: {
              event1: {
                name: "Blades of 1",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event2: {
                name: "Blades of 2",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event3: {
                name: "Blades of 3",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            },
            sports: {
              event1: {
                name: "Blades of 1",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event2: {
                name: "Blades of 2",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event3: {
                name: "Blades of 3",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            }
          } // favCategories
        },
        888828838: {
          name: "Harry",
          email: "m@harry.com",
          favCategories: {
            music: {
              event1: {
                name: "Blades of Glory",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event2: {
                name: "Blades of Jazz",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event3: {
                name: "Blades of Nast",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            },

            arts: {
              event1: {
                name: "Blades of Bitches",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event2: {
                name: "Blades of Fayyyce",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event3: {
                name: "Blades of Dodge",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            },
            sports: {
              event1: {
                name: "Blades of Soccer",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event2: {
                name: "Blades of Golf",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event3: {
                name: "Blades of Pinball",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            }
          } // favCategories
        },
        111627626: {
          name: "Isaac",
          email: "m@isaac.com",
          favCategores: {
            music: {
              event1: {
                name: "Blades of Glory",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event2: {
                name: "Blades of Jazz",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event3: {
                name: "Blades of Nast",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            },

            arts: {
              event1: {
                name: "Blades of Bitches",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event2: {
                name: "Blades of Fayyyce",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event3: {
                name: "Blades of Dodge",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            },
            sports: {
              event1: {
                name: "Blades of Soccer",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event2: {
                name: "Blades of Golf",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              event3: {
                name: "Blades of Pinball",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            }
          } // favCategories
        } // player unique id
      } // users
    });*/

    // Db testing
    var ref = db.ref("users");
    ref.on('child_added', function(snapshot) {
      console.log("User key: " + snapshot.key + " User name: " + snapshot.val().name + " User email: " + snapshot.val().email + " User favCategories: " + snapshot.val().favCategories);
    });
});
