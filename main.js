console.log('hello spotify');
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
  return songs
}

async function main() {
  //get all songs
  let songs = await getSongs();
  console.log(songs)
  let songUl = document.querySelector('.songsList').getElementsByTagName('ul')[0];
  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML +`<li>${song.replaceAll("%20", '')}</li>`
  }

  //play first song
  var audio = new Audio(songs[2]);
  //audio.play();
  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log((duration))
    // The duration variable now holds the duration (in seconds) of the audio clip
  });

}
main()
