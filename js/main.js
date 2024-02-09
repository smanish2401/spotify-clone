console.log("hello spotify");
let currentSong = new Audio();
let currentFolder;
let songs;


function secondsToMinutesSeconds(totalSeconds) {
  // Calculate minutes and remaining seconds
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return "00:00"
  }
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = Math.floor(totalSeconds % 60);

  // Ensure minutes and seconds are displayed with leading zeros if needed
  var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  var formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  // Combine minutes and seconds into the "minutes:seconds" format
  var result = formattedMinutes + ":" + formattedSeconds;

  return result;
}


async function getSongs(folder) {
  currentFolder = folder;
  let a = await fetch(`/${currentFolder}/`);
  let response = await a.text();
  //console.log("kamal",response);
  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");
  //console.warn(as)
  songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currentFolder}/`)[1]);
    }
  }
  //console.log(songs)
  let songUl = document .querySelector(".songsList").getElementsByTagName("ul")[0];
  songUl.innerHTML = '';
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      ` <li>             
                          <img src="img/music-icon.svg" class="" alt=""></img>
                          <div class="info" id="songInfo">
                          ${song.replaceAll("%20", " ")}
                          </div>
                     </li>`;
  }
  //attach eventListener all songs
  Array.from(
    document.querySelector(".songsList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
     // console.log(e.querySelector(".info").innerHTML);
      playMusic(e.querySelector(".info").innerHTML.trim());

    });
  })
  return songs
}
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/"+track);
  currentSong.src = `/${currentFolder}/` + track;

  if (!pause) {
    currentSong.play();
    play.src = "img/pause-btn.svg";
  }

  document.querySelector(".songInfo").innerHTML =
    '<img src ="img/m.svg"></img>' + decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";

  
};

// display all the albums on the page
async function displayAlbums(){

  let a = await fetch(`/songs/`);
  let response = await a.text();
  //console.log("kamal",response);
  let div = document.createElement("div");
  div.innerHTML = response;
 // console.log(div);
 let cardContainer = document.querySelector(".card-container")
  let anchors = div.getElementsByTagName('a');
  //console.log(anchors)
 let array = Array.from(anchors)
  //console.log(e.href)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
  if(e.href.includes("/songs/") && !e.href.includes(".htaccess")){
  let folder =   e.href.split('/').slice(-2)[0];

  //get the meta data of the folder
  let a = await fetch(`/songs/${folder}/info.json`);
  let response = await a.json();
  //console.log(response)
  cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card  rounded" data-folder=${folder}>
  <div class="play">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" fill="black" height="24"
          viewBox="0 0 24 24" fill="none" class="injected-svg"
          data-src="/icons/play-stroke-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          role="img" color="#000000">
          <path d="M5 20V4L19 12L5 20Z" stroke="#000000" stroke-width="1.5"
              stroke-linejoin="round"></path>
      </svg>
      
  </div>

  <img src="/songs/${folder}/cover.jpg">
  <h4>${response.title}</h4>
  <p>${response.description}</p>

</div>
  `
  }
 }
  // load palylist when card is clicked;
  // document.querySelectorAll(".card")
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
    //  console.log(item.currentTarget)
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0])
    })

  })
  
}

async function main() {
  //get all songs
  await getSongs(`songs/ncs`);
  playMusic(songs[0], true);
  //console.log(songs)
  displayAlbums()


  

  

  // add eventListener on buttons
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause-btn.svg";
      play.title = "pause";

    } else {
      currentSong.pause();
      play.src = "img/play btn.svg";
      play.title = "play"


    }
  });
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime,currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    let value = document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    document.querySelector("#seekbar-fill").style.width = value
  });
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + '%';

    currentSong.currentTime = ((currentSong.duration) * percent) / 100;



  })
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
  })
  //add event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-130%"
  })
  //add event listener for previous btn
  previous.addEventListener("click", () => {
    console.log("previous clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    console.log(songs, index);
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
    }
  })
  //add event listener for next btn
  next.addEventListener("click", () => {
    currentSong.pause()
    console.log("next clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    //console.log(songs,index);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
    }
  
  })

  // add event listener for volume
  document.getElementById("range").addEventListener("change", (e) => {
    console.log("setting volume to", e.target.value, "/100");
    currentSong.volume = parseInt(e.target.value) / 100;
    //range.title = parseInt(e.target.value)+"%";

  })
  // add event listener for mute
  document.getElementById("vol").addEventListener("click", () => {
    currentSong.muted = !currentSong.muted;
    if (currentSong.muted) {
      vol.src = "img/volume-off.svg";
      vol.title = "Unmute"
      document.getElementById("range").value = 0
    } else {
      vol.src = "img/volume.svg"
      vol.title = "Mute"
      document.getElementById("range").value = 50
    }
  })
 
}

main();

/* //play first song
  var audio = new Audio(songs[2]);
  //audio.play();
  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log((duration))
    // The duration variable now holds the duration (in seconds) of the audio clip
  });*/
