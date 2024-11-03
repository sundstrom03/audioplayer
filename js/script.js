// Array of song objects containing information for each track
const songList = [
  {
    name: "Cornfield Chase",
    artist: "Hans Zimmer",
    imageSrc: "img/bild1.jpg",
    soundSrc: "audio/Cornfield Chase.mp3",
    trackLength: "2:07",
  },
  {
    name: "Can You Hear The Music",
    artist: "Ludwig Göransson",
    imageSrc: "img/bild2.jpg",
    soundSrc: "audio/Can You Hear The Music.mp3",
    trackLength: "1:50",
  },
  {
    name: "End Title",
    artist: "Thomas Newman",
    imageSrc: "img/bild3.jpg",
    soundSrc: "audio/End Title.mp3",
    trackLength: "4:05",
  },
  {
    name: "i feel lost",
    artist: "Aaron Hibell",
    imageSrc: "img/bild4.jpg",
    soundSrc: "audio/i feel lost.mp3",
    trackLength: "2:27",
  },
  {
    name: "snowfall",
    artist: "Øneheart, reidenshi",
    imageSrc: "img/bild5.jpg",
    soundSrc: "audio/snowfall.mp3",
    trackLength: "2:03",
  },
  {
    name: "One Day",
    artist: "Hans Zimmer",
    imageSrc: "img/bild6.jpg",
    soundSrc: "audio/One Day.mp3",
    trackLength: "4:01",
  },
];

// DOM element references
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPause");
const previousTrackBtn = document.getElementById("previousTrack");
const nextTrackBtn = document.getElementById("nextTrack");
const muteAudioBtn = document.getElementById("mute-button");
const volumeControl = document.getElementById("volume-control");
const stopBtn = document.getElementById("stopBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const progressBar = document.getElementById("progress-bar");
const playlistBtn = document.getElementById("playlistBtn");
const returnBtn = document.getElementById("returnBtn");
const playlistProgressBar = document.getElementById("playlist-progress-bar");
const playlistPlayPauseBtn = document.getElementById("playlist-playPause");
const playlistPreviousTrackBtn = document.getElementById(
  "playlist-previousTrack"
);
// Constants for icon HTML
const playlistNextTrackBtn = document.getElementById("playlist-nextTrack");
const PLAY_ICON = '<i class="fa-solid fa-play"></i>';
const PAUSE_ICON = '<i class="fa-solid fa-pause"></i>';
const VOLUME_HIGH_ICON = '<i class="fa-solid fa-volume-high"></i>';
const VOLUME_MUTE_ICON = '<i class="fa-solid fa-volume-xmark"></i>';
const ACTIVE_COLOR = "#528ea8";

// Global variables
let currentTrack = 0;
let isShuffleActive = false;
let previousVolume = 1;

// Event listeners for main player controls
playPauseBtn.addEventListener("click", playPause);
previousTrackBtn.addEventListener("click", previousTrack);
nextTrackBtn.addEventListener("click", nextTrack);
muteAudioBtn.addEventListener("click", muteUnmute);
stopBtn.addEventListener("click", stop);
volumeControl.addEventListener("input", changeVolume);
shuffleBtn.addEventListener("click", shuffle);
repeatBtn.addEventListener("click", repeat);
audio.addEventListener("ended", nextTrack);
audio.addEventListener("timeupdate", updateProgressBar);
playlistBtn.addEventListener("click", playList);

// Event listener for progress bar interaction
progressBar.addEventListener("click", (event) => {
  const progressBarWidth = progressBar.offsetWidth;
  const clickX = event.offsetX;
  const duration = audio.duration;
  const newTime = (clickX / progressBarWidth) * duration;
  audio.currentTime = newTime;
});

// Event listeners for playlist controls
playlistPlayPauseBtn.addEventListener("click", playPause);
playlistPreviousTrackBtn.addEventListener("click", previousTrack);
playlistNextTrackBtn.addEventListener("click", nextTrack);
returnBtn.addEventListener("click", returnMain);

// Event listener for playlist progress bar interaction
playlistProgressBar.addEventListener("click", (event) => {
  const progressBarWidth = playlistProgressBar.offsetWidth;
  const clickX = event.offsetX;
  const duration = audio.duration;
  const newTime = (clickX / progressBarWidth) * duration;
  audio.currentTime = newTime;
});

// Function to toggle play/pause
function playPause() {
  if (audio.paused) {
    audioPlay();
  } else {
    audioPause();
  }
}

// Function to play audio
function audioPlay() {
  audio.play();
  playPauseBtn.innerHTML = PAUSE_ICON;
  playlistPlayPauseBtn.innerHTML = PAUSE_ICON;
}

// Function to pause audio
function audioPause() {
  audio.pause();
  playPauseBtn.innerHTML = PLAY_ICON;
  playlistPlayPauseBtn.innerHTML = PLAY_ICON;
}

// Function to toggle mute/unmute
function muteUnmute() {
  if (audio.muted) {
    audio.muted = false;
    muteAudioBtn.innerHTML = VOLUME_HIGH_ICON;
    volumeControl.value = previousVolume;
  } else {
    audio.muted = true;
    muteAudioBtn.innerHTML = VOLUME_MUTE_ICON;
    previousVolume = volumeControl.value;
    volumeControl.value = 0;
  }
}

// Function to play the previous track
function previousTrack() {
  currentTrack = (currentTrack - 1 + songList.length) % songList.length;
  updatePlayer();
  audioPlay();
}

// Function to play the next track
function nextTrack() {
  if (isShuffleActive) {
    let newTrack;
    do {
      newTrack = Math.floor(Math.random() * songList.length);
    } while (newTrack === currentTrack);
    currentTrack = newTrack;
  } else {
    currentTrack = (currentTrack + 1) % songList.length;
  }
  updatePlayer();
  audioPlay();
}

// Function to stop playback and reset to first track
function stop() {
  currentTrack = 0;
  updatePlayer();
  audioPause();
}

// Function to update player with current track information
function updatePlayer() {
  const currentSong = songList[currentTrack];
  Object.assign(document.getElementById("cover"), {
    src: currentSong.imageSrc,
  });
  Object.assign(document.getElementById("name"), {
    textContent: currentSong.name,
  });
  Object.assign(document.getElementById("artist"), {
    textContent: currentSong.artist,
  });
  Object.assign(audio, { src: currentSong.soundSrc });

  audio.onloadedmetadata = () => {
    document.getElementById("timer-total").textContent = formatTime(
      audio.duration
    );
  };

  playListStyle();
}

// Function to change volume
function changeVolume() {
  audio.volume = volumeControl.value / 100;
}

// Function to toggle shuffle mode
function shuffle() {
  isShuffleActive = !isShuffleActive;

  if (isShuffleActive) {
    document.getElementById("shuffleBtn").style.color = ACTIVE_COLOR;
  } else {
    document.getElementById("shuffleBtn").style.color = "";
  }
}

// Function to toggle repeat mode
function repeat() {
  audio.loop = !audio.loop;
  if (audio.loop) {
    document.getElementById("repeatBtn").style.color = ACTIVE_COLOR;
  } else {
    document.getElementById("repeatBtn").style.color = "";
  }
}

// Function to format time in minutes:seconds
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Function to update progress bars and time displays
function updateProgressBar() {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  const progressPercent = (currentTime / duration) * 100;
  progressBar.value = progressPercent;

  progressBar.value = progressPercent;
  playlistProgressBar.value = progressPercent;

  document.getElementById("timer-now").textContent = formatTime(currentTime);
  document.getElementById("timer-total").textContent = formatTime(duration);
}

// Function to display playlist
function playList() {
  document.getElementById("player-area").style.display = "none";
  document.getElementById("playlist-area").style.display = "flex";

  const trackList = document.getElementById("trackList");
  trackList.innerHTML = "";

  for (let i = 0; i < songList.length; i++) {
    let trackName = songList[i].name;
    let artist = songList[i].artist;
    let trackLength = songList[i].trackLength;

    const listItem = document.createElement("div");
    listItem.classList.add("tracklist");
    listItem.innerHTML = `
            <h3 class="trackName">${trackName}</h3>
            <span class="artistName">${artist}</span> <span class="trackLength">${trackLength}</span>
        `;

    listItem.addEventListener("click", () => {
      if (currentTrack !== i) {
        currentTrack = i;
        updatePlayer();
        audioPlay();
      }
    });

    if (i === currentTrack) {
      listItem.classList.add("active");
    }

    trackList.appendChild(listItem);
  }
  playListStyle();
}

// Function to style the active track in the playlist
function playListStyle() {
  const trackList = document.getElementById("trackList");
  Array.from(trackList.getElementsByClassName("tracklist")).forEach(
    (item, index) => {
      item.classList.toggle("active", index === currentTrack);
      item.style.color = index === currentTrack ? ACTIVE_COLOR : "";
    }
  );
}

// Function to return to main player view
function returnMain() {
  document.getElementById("player-area").style.display = "flex";
  document.getElementById("playlist-area").style.display = "none";
}
