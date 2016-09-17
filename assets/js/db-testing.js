$(document).ready(function() {

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
  
  // Establish database references
  var usersRef = db.ref("users");
  var nameRef = db.ref("users/name")
  var musicRef = db.ref("users").child("favCategories");
  
  // Retrieve every user's information on page load
  usersRef.on('child_added', function(snapshot) {
    var content = "<p> User key: " + snapshot.key + " User name: " + snapshot.val().name + " User email: " + 
    snapshot.val().email + " User favCategories: " + snapshot.val().favCategories + "</p>";
    $('.drunk-ass-div').append(content);
  });

  // Retrieve just the first two users' information
  usersRef.limitToFirst(2).on('child_added', function(snapshot) {
    var content = "<p> User key: " + snapshot.key + " User name: " + snapshot.val().name + " User email: " + 
    snapshot.val().email + " User favCategories: " + snapshot.val().favCategories + "</p>";
    $('.first-user').append(content);
  });

  // Retrieve all favorites for user 757827487
  usersRef.child('757827487').child("favCategories").on('child_added', function(snapshot) {
    var faves = snapshot.key + "<br>";
    $('.faves').append(faves);
  });

  // Retrieve all music events
  usersRef.on('child_added', function(snapshot) {
    var username = snapshot.val().name;
    var musicEvent = snapshot.val().favCategories.music;
    var content = "<p> User: " + username + "<br>";
    musicEvent.forEach(function(item, index, arr) {
      content += "<span> Event #" + index + ": " + item.desc + "</span><br>";
    });
    content += "</p>";
    $('.music').append(content);
  });

    /* This is the actual starter database (may have added/altered since) 
    db.ref().set({
      users: {
        4738473827: {
          name: "Jeff",
          email: "mt@m.com",
          favCategories: {
            music: [
              {
                name: "Blades of Glory",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },

              {
                name: "Blades of Jazz",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Nast",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],
          
            arts: [
              {
                name: "Blades of Bitches",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },

              {
                name: "Blades of Fayyyce",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Dodge",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],

            sports: [
              {
                name: "Blades of Soccer",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Golf",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Pinball",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ]
          } // favCategories
        },

        757827487: {
          name: "Michael",
          email: "m@h.com",
          favCategories: {
            music: [
              {
                name: "Blades of 1",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of 2",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of 3",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],
  
            arts: [
              {
                name: "Blades of 1",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of 2",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of 3",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],

            sports: [
              {
                name: "Blades of 1",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of 2",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of 3",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ]
          } // favCategories
        },

        888828838: {
          name: "Harry",
          email: "m@harry.com",
          favCategories: {
            music: [
              {
                name: "Blades of Glory",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Jazz",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Nast",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],
    
            arts: [
              {
                name: "Blades of Bitches",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Fayyyce",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Dodge",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],

            sports: [
              {
                name: "Blades of Soccer",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Golf",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Pinball",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ]
          } // favCategories
        },

        111627626: {
          name: "Isaac",
          email: "m@isaac.com",
          favCategories: {
            music: [
              {
                name: "Blades of Glory",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },

              {
                name: "Blades of Jazz",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },

              {
                name: "Blades of Nast",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],
    
            arts: [
              {
                name: "Blades of Bitches",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Fayyyce",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Dodge",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],

            sports: [
              {
                name: "Blades of Soccer",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Golf",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Pinball",
                date: "07/07/16",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ]
          } // favCategories
        } // player unique id
      } // users
    }); // set function */
}); // $(document).ready() {}