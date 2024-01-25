console.log('hello spotify');
let currentSong = new Audio()
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/")
  let response = await a.text()
  //console.log(response);
  let div = document.createElement('div');
  div.innerHTML = response;
  let as = div.getElementsByTagName('a');
  //console.warn(as)
  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split('/songs/')[1])
    }

  }
//console.log(songs)

  return songs;

}
const playMusic = (track)=>{
 // let audio = new Audio("/songs/"+track);
  currentSong.src = "/songs/"+track;
  currentSong.play();
  
  play.src = 'pause-btn.svg'
  document.querySelector(".songInfo").innerHTML = '<img src ="m.svg"></img>'+ track 
  document.querySelector(".songTime").innerHTML =   '00:00/00:00'
}
async function main() {

  //get all songs
  let songs = await getSongs();
  //console.log(songs)
  let songUl = document.querySelector('.songsList').getElementsByTagName('ul')[0];
  
  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML +
      ` <li>
                            <img src="music-icon.svg" class="" alt=""></img>
                            <div class="info">
                            ${song.replaceAll("%20",' ')}
                            </div>
                           

                            <img src="favicon.ico" class="spt"  alt="">

                            </img> 
                                                      
                        </li>`
                       
  }
  Array.from(document.querySelector('.songsList').getElementsByTagName('li')).forEach(e=>{
    e.addEventListener('click',element=>{
      console.log(e.querySelector('.info').innerHTML);
      playMusic(e.querySelector('.info').innerHTML.trim())
    })
   
  });
play.addEventListener("click",()=>{
  if(currentSong.paused){
    currentSong.play();
    play.src = 'pause-btn.svg'
  }
  else{
    currentSong.pause();
    play.src = 'play btn.svg'
  }
})
}

main()


/* //play first song
  var audio = new Audio(songs[2]);
  //audio.play();
  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log((duration))
    // The duration variable now holds the duration (in seconds) of the audio clip
  });*/
