const fs = require("fs")
const dotenv = require("dotenv").config();
const axios = require("axios");
const moment = require("moment");
const keys = require("./keys.js");
const Spotify = require('node-spotify-api')
const spotify = new Spotify(keys.spotify);

const action = process.argv[2];
let searchQuery = process.argv.slice(3).join(" ");
console.log(searchQuery)

if (!process.argv[2]) {

  console.log(`

======================================================
You Can Do a Few Things With This App.

Use the following commands to search:

How To: Command / Search Term

1. concert-this / band name
To search upcoming concerts

2. spotify-this / song name
To search track information

3. movie-this / movie name
To search movie info

4. just-do-it: 
Randomly selects one of the above searches
======================================================
`)
}


// use switch case to determine what action we want to perform
switch (action) {
  case "concert-this":
    concert();
    break;
  case "spotify-this":
    spotifyThis();
    break;
  case "movie-this":
    movie();
    break;
  case "just-do-it":
    justDoIt();
    break;
  default:
    return "You don't know how to search right";
    break;
}

function concert() {
  axios
    .get(`https://rest.bandsintown.com/artists/${searchQuery.trim()}/events?app_id=codingbootcamp`)
    .then(function (response) {

      if (!searchQuery) {
        console.log(`

      You forgot to search for a band name. You lose. You get nothing. Good day, sir.

      ====================
      Venue Name:
      Location:
      Event Date:
      ====================
`)
      } else if (!response.data[1].venue) {

        console.log(`Sorry, that artist doesn't have any upcoming events`);

      } else {

        for (var i = 0; i < response.data.length; i++) {
          console.log(`
      
      =================================
      Venue Name: ${response.data[1].venue.name}
      Location: ${response.data[1].venue.city}, ${response.data[1].venue.region}, ${response.data[1].venue.country}
      Event Date: ${moment(response.data[3]).format("MM-DD-YYYY")}
      =================================
`);
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

function spotifyThis() {
  spotify
    .search({
      type: "track",
      limit: 50,
      query: searchQuery,
    })
    .then(function (response) {

      var artist = response.tracks.items[0].artists[0].name
      var title = response.tracks.items[0].name;
      var album = response.tracks.items[0].album.name;
      var previewLink = response.tracks.items[0].preview_url;

      if (!searchQuery) {
        console.log(`

      You forgot to search for a song. You ought to know better.

      ============================================
      Artist: Alanis Morissette
      Song Title: You Oughta Know - 2015 Remaster
      Album Name: Jagged Little Pill (Remastered)
      Preview: https://p.scdn.co/mp3-preview/02c878f0d34bbcc4bf6a41236b6db697e52df11e?cid=b5ab8bcde06d410dbb01f07d9a8675a2
      ============================================
`)
      } else {
        console.log(`

      ============================================
      Artist: ${artist}
      Song Title: ${title}
      Album Name: ${album}
      Preview: ${previewLink}
      ============================================
`);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

function movie() {
  axios
    .get(`http://www.omdbapi.com/?t=${searchQuery}&apikey=trilogy`)
    .then(function (response) {
      if (!searchQuery) {
        console.log(`

      Yoy forgot to search for a movie title. So you get this.

      ===================================================================================================================================
      Movie Title: Mr. Nobody
      Release Date: 09-26-2013
      IMDB Rating: 7.8/10
      Rotten Tomatoes Rating: 67%
      Country of Origin: Belgium, Germany, Canada, France, USA, UK
      Language: English, Mohawk
      Plot Summary: A boy stands on a station platform as a train is about to leave. Should he go with his mother or stay with his father? Infinite possibilities arise from this decision. As long as he doesn't ch
      oose, anything is possible.      
      Actors: Jared Leto, Sarah Polley, Diane Kruger, Linh Dan Pham
      ===================================================================================================================================
`)

      } else {
        console.log(`
    
      ====================
      Movie Title: ${response.data.Title}
      Release Date: ${moment(response.data.Released).format("MM-DD-YYYY")}
      IMDB Rating: ${response.data.Ratings[0].Value}
      Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
      Country of Origin: ${response.data.Country}
      Language: ${response.data.Language}
      Plot Summary: ${response.data.Plot}
      Actors: ${response.data.Actors}
      ====================
`);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

function justDoIt() {
  fs.readFile("random.txt", "utf8", function (err, data) {

    // check for an error
    if (err) {
      return console.log(err);
    }

    // split our randomData into an array
    console.log(data);
    const dataArray = data.split(",");

    var command = dataArray[0];
    searchQuery = dataArray[1];

    switch (command) {
      case "concert-this":
        concert();
        break;
      case "spotify-this":
        spotifyThis();
        break;
      case "movie-this":
        movie();
        break;
    }
  });
}