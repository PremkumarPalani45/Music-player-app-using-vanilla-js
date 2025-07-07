// Updated music.js with playlist playback functionality

const toggleButton = document.querySelector('.dark-mode-toggle');
const toggleText = document.querySelector('.toggle-text');

const selectKey = document.querySelector('#allsongs');
const genre = document.querySelector('#genre');

const botton = document.querySelector("#cards")
const botton1 = document.querySelector("#playLists")

let selectedPlaylist = null;
let currentPlaylistSongs = [];
let playlistIndex = 0;

// Toggle Dark Mode

toggleButton.addEventListener('click', () => {
  toggleButton.classList.toggle('active');
  if (toggleButton.classList.contains('active')) {
    document.body.classList.add('dark-mode');
    toggleText.textContent = "Light";
    selectKey.style.backgroundColor = "#6699CC";
    genre.style.backgroundColor = "lightblue";
    botton.style.backgroundColor = "#6699CC";
    botton1.style.backgroundColor = "#6699CC";
  } else {
    document.body.classList.remove('dark-mode');
    toggleText.textContent = "Dark";
    selectKey.style.backgroundColor = "lightblue";
    genre.style.backgroundColor = "#6699CC";
    botton.style.backgroundColor = "lightblue";
    botton1.style.backgroundColor = "lightblue";
  }
});

// Genre filter

document.getElementById("genre").addEventListener("change", function () {
  fetch('songs.json')
    .then(Response => Response.json())
    .then(data => {
      const filteredSongs = this.value === "all"
        ? data
        : data.filter((song) => song.genre === this.value);
      allSongs(filteredSongs);
    })
    .catch(error => console.error('Error fetching products:', error));
});

// On DOM load

document.addEventListener('DOMContentLoaded', () => {
  fetch('songs.json')
    .then(Response => Response.json())
    .then(data => {
      allSongs(data);
      cardDisplay(data);
      loadPlaylists();
    })
    .catch(error => console.error('Error fetching products:', error));
});

// Display All Songs

function allSongs(data) {
  const songs = document.querySelector('.displaySong');
  songs.innerHTML = '';

  data.forEach(song => {
    const newdiv = document.createElement('div');
    newdiv.classList.add("displayData");
    newdiv.innerHTML = `
      <button class=song-display>${song.title}</button>
    `;
    songs.appendChild(newdiv);
  });
}

// Main Card Display

function cardDisplay(data) {
  let picture = data[0];
  MiddlePart(picture);
}

// On song click from all songs

document.querySelector('.displaySong').addEventListener('click', function (event) {
  if (event.target.classList.contains('song-display')) {
    fetch('songs.json')
      .then(Response => Response.json())
      .then(data => {
        const selectSong = data.find(item => item.title === event.target.textContent);
        if (selectSong) {
          MiddlePart(selectSong);
        }
      })
      .catch(error => console.error('Error:', error));
  }
});

// Playlist Forward & Backward

let imageCount = 0;

function displayImages() {
  fetch('songs.json')
    .then(Response => Response.json())
    .then(data => {
      const image = data[imageCount];
      MiddlePart(image);
    })
    .catch(error => console.error('Error fetching:', error));
}

document.querySelector(".backward").addEventListener('click', () => {
  if (selectedPlaylist && currentPlaylistSongs.length > 0) {
    playlistIndex = (playlistIndex - 1 + currentPlaylistSongs.length) % currentPlaylistSongs.length;
    playSongFromPlaylist();
  } else {
    imageCount = imageCount === 0 ? 5 : imageCount - 1;
    displayImages();
  }
});

document.querySelector(".forward").addEventListener('click', () => {
  if (selectedPlaylist && currentPlaylistSongs.length > 0) {
    playlistIndex = (playlistIndex + 1) % currentPlaylistSongs.length;
    playSongFromPlaylist();
  } else {
    imageCount = imageCount === 5 ? 0 : imageCount + 1;
    displayImages();
  }
});

function MiddlePart(data) {
  const audio = document.querySelector('.audio-pic');
  const audiofile = document.querySelector('.audio-file');
  audio.innerHTML = '';
  audiofile.innerHTML = '';

  const newdiv1 = document.createElement('div');
  newdiv1.classList.add("displayAudio");
  newdiv1.innerHTML = `
    <img src=${data.artwork} alt="Profile Image" />
    <div>
      <h2 class="song-title">${data.title}</h2>
      <p>${data.artist}</p>
    </div>
  `;
  audio.appendChild(newdiv1);

  const newdiv2 = document.createElement('div');
  newdiv2.className = "audioFile";
  newdiv2.innerHTML = `
    <audio controls autoplay>
      <source src=${data.url} type="audio/mpeg">
      Your browser does not support the audio tag.
    </audio>
  `;
  audiofile.appendChild(newdiv2);
}

// Playlist Logic

const createPlayList = document.querySelector(".createPlaylist");
const textPlayList = document.querySelector("#playlist");
const createPlay = document.querySelector(".displayPlayList");

createPlayList.addEventListener('click', () => {
  let playlistName = textPlayList.value.trim();
  if (playlistName !== "") {
    if (!localStorage.getItem('playlists')) {
      localStorage.setItem('playlists', JSON.stringify([]));
    }
    let playlist = JSON.parse(localStorage.getItem('playlists'));
    if (!playlist.includes(playlistName)) {
      playlist.push(playlistName);
      localStorage.setItem("playlists", JSON.stringify(playlist));
      localStorage.setItem(playlistName, JSON.stringify([]));
      loadPlaylists();
    } else {
      alert("Playlist already exists!");
    }
    textPlayList.value = '';
  } else {
    alert("Please enter a playlist name.");
  }
});

function loadPlaylists() {
  let allStorage = JSON.parse(localStorage.getItem('playlists')) || [];
  createPlay.innerHTML = '';
  allStorage.forEach(playlist => {
    let playListbutton = document.createElement('button');
    playListbutton.textContent = playlist;
    playListbutton.classList.add("playList-button");
    playListbutton.onclick = () => {
      selectedPlaylist = playlist;
      displayPlaylistSongs(playlist);
      currentPlaylistSongs = JSON.parse(localStorage.getItem(playlist)) || [];
      playlistIndex = 0;
      playSongFromPlaylist();
    };
    createPlay.appendChild(playListbutton);
  });
}

function addSongToPlaylist() {
  if (!selectedPlaylist) {
    alert("Please select a playlist.");
    return;
  }
  let songElement = document.querySelector(".song-title");
  if (!songElement) {
    alert("No song selected! Please play a song first.");
    return;
  }
  let songTitle = songElement.textContent.trim();

  let playlist = JSON.parse(localStorage.getItem(selectedPlaylist)) || [];
  playlist.push(songTitle);
  localStorage.setItem(selectedPlaylist, JSON.stringify(playlist));

  displayPlaylistSongs(selectedPlaylist);
}

function displayPlaylistSongs(playlistName) {
  let songList = document.querySelector("#playlistSongs");
  songList.innerHTML = "";

  let playlist = JSON.parse(localStorage.getItem(playlistName)) || [];
  playlist.forEach(song => {
    let button = document.createElement("button");
    button.classList.add("song-button");
    button.textContent = song;
    button.onclick = () => {
      fetch('songs.json')
        .then(Response => Response.json())
        .then(data => {
          const found = data.find(item => item.title === song);
          if (found) {
            MiddlePart(found);
          }
        });
    };
    songList.appendChild(button);
  });
}

function playSongFromPlaylist() {
  if (currentPlaylistSongs.length === 0) return;
  const songTitle = currentPlaylistSongs[playlistIndex];

  fetch('songs.json')
    .then(Response => Response.json())
    .then(data => {
      const found = data.find(item => item.title === songTitle);
      if (found) {
        MiddlePart(found);
      }
    });
}
