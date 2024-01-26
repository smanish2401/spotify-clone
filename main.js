console.log("hello spotify");
let currentSong = new Audio();

function secondsToMinutesSeconds(totalSeconds) {
  // Calculate minutes and remaining seconds
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = Math.floor(totalSeconds % 60);

  // Ensure minutes and seconds are displayed with leading zeros if needed
  var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  var formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  // Combine minutes and seconds into the "minutes:seconds" format
  var result = formattedMinutes + ":" + formattedSeconds;

  return result;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  //console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  //console.warn(as)
  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  //console.log(songs)

  return songs;
}
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/"+track);
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause-btn.svg";
   
  }

  document.querySelector(".songInfo").innerHTML =
    '<img src ="m.svg"></img>' + decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};
async function main() {
  //get all songs
  let songs = await getSongs();
  playMusic(songs[0], true);
  //console.log(songs)
  let songUl = document
    .querySelector(".songsList")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      ` <li>
                            <img src="music-icon.svg" class="" alt=""></img>
                            <div class="info">
                            ${song.replaceAll("%20", " ")}
                            </div>
                           

                            <img src="favicon.ico" class="spt"   alt="">

                            </img> 
                                                      
                        </li>`;
  }
  Array.from(
    document.querySelector(".songsList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").innerHTML);
      playMusic(e.querySelector(".info").innerHTML.trim());
    });
  });
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause-btn.svg";
    } else {
      currentSong.pause();
      play.src = "play btn.svg";
    }
  });
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime,currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
  });
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
