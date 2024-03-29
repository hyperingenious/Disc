// const mm = require('music-metadata');

// async function getAlbumArt(filePath) {
//   try {
//     const metadata = await mm.parseFile(filePath, { duration: true });

//     if (metadata && metadata.common && metadata.common.picture) {
//       const picture = metadata.common.picture[0];
//       const base64String = picture.data.toString('base64');
//       const mimeType = picture.format;

//       const albumArtUrl = `data:${mimeType};base64,${base64String}`;

//       return albumArtUrl;
//     } else {
//       console.log('No album art found.');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching album art:', error);
//     return null;
//   }
// }

// // Usage
// const filePath = 'https://normvgmusic.pythonanywhere.com/api/audio?id=10LC_ll-3y3wGdrRc3h1UphDS0fqcaQu6';
// getAlbumArt(filePath)
//   .then(albumArtUrl => {
//     if (albumArtUrl) {
//       console.log('Album art URL:', albumArtUrl);
//     }
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
const music = document.getElementById("music");
const barFull = document.getElementById("bar-full");
const barNow = document.getElementById("bar-now");
const loop = document.getElementById("loop");
const play = document.getElementById("play");
const shuffle = document.getElementById("shuff");

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${Math.floor(remainingSeconds)}`;
}

music.ontimeupdate = function (e) {
    document.getElementById("play-full").innerText = formatTime(music.duration);
    document.getElementById("play-now").innerText = formatTime(music.currentTime);
    barNow.style.width = Math.floor((music.currentTime * 100) / music.duration) + "%";
};

barFull.onclick = function (e) {
    music.currentTime = (e.offsetX / barFull.offsetWidth) * music.duration;
};

music.onended = function (e) {
    music.currentTime = 0;
    const playIcon = document.getElementById("play-ico");
    music.pause();
    playIcon.src = "/public/img/play.png";
    play.className = "off";
};

function togglePlay() {
    const playIcon = document.getElementById("play-ico");
    if (play.className === "on") {
        music.pause();
        playIcon.src = "/public/img/play.png";
        play.className = "off";
    } else if (play.className === "off") {
        playIcon.src = "/public/img/pause.png";
        play.className = "on";
        music.play();
    }
}

function toggleLoop() {
    const loopIcon = document.getElementById("loop-ico");
    music.loop = loop.className === "off";
    loopIcon.src = `./public/img/loop${music.loop ? "on" : "off"}.png`;
    loop.className = music.loop ? "on" : "off";
}

function toggleShuffle() {
    const shuffleIcon = document.getElementById("shuff-ico");
    shuffleIcon.src = `./public/img/shuff${shuffle.className === "off" ? "on" : "off"}.png`;
    shuffle.className = shuffle.className === "off" ? "on" : "off";
}

const navBarSet = `
<a onclick="NavBar('Folder')"><img class="nav-icon" src="./public/img/folder.png" alt=""></a>
<a onclick="NavBar('Music')"><img class="nav-icon" src="./public/img/music.png" alt=""></a>
<a onclick="NavBar('Playlist')"><img class="nav-icon" src="./public/img/playlist.png" alt=""></a>
<a onclick="NavBar('AddMusic')"><img class="nav-icon" src="./public/img/add.png" alt=""></a>
`;

function fullNav(icon) {
    return `
    <div>
        <button id="nav-back" onclick="NavBack()"><img src="./public/img/navback.png" alt=""></button>
        <button id="nav-full-icon" onclick="NavFullDefault('folder')"><img src="${icon}" alt=""></button>
    </div>
    <div id="system">
    </div>
    `;
}

function navBack() {
    const nav = document.getElementById("nav-bar");
    fullPlayer("on");
    nav.className = "nav-bar-off";
    nav.innerHTML = navBarSet;
}

function navFullDefault(type) {
    if (type === "folder") {
        setFolder();
    }
}

function fullPlayer(type) {
    const player = document.getElementById("player");
    const bar = document.getElementById("bar");
    player.style.width = type === "on" ? "95vw" : "80vw";
    bar.style.width = type === "on" ? "80vw" : "70vw";
}

function navBar(type) {
    const nav = document.getElementById("nav-bar");
    if (type === "Folder" || type === "Music" || type === "Playlist" || type === "AddMusic") {
        fullPlayer("off");
        nav.className = "nav-bar-on";
        nav.innerHTML = fullNav(`./public/img/${type.toLowerCase()}.png`);
    }
}

function setting() {
    const popup = document.getElementById("setting-sys");
    popup.showModal();
}

function folderItem(name, id) {
    return `<li onclick="setArtist('${id}')">${name}</li>`;
}

function setFolder() {
    let folderlist = "";
    fetch("https://normvgmusic.pythonanywhere.com/api/get-artist")
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                folderlist += folderItem(Object.keys(item)[0], item.id);
            });
            const home = `<div id="folder-element"><ul>${folderlist}</ul></div>`;
            document.getElementById("system").innerHTML = home;
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error.message);
        });
}

setFolder();

function setArtist(id) {
    let artistlist = "";
    fetch(`https://normvgmusic.pythonanywhere.com/api/audio-by-artist?id=${id}`)
        .then(response => response.json())
        .then(data => {
            data[0][Object.keys(data[0])[0]].forEach(item => {
                artistlist += `<li onclick="setPlayerAudio('${item.id}')" title="${item.name}"><span>${item.name}</span></li>`;
            });
            const home = `<div id="artist-element"><ul>${artistlist}</ul></div>`;
            document.getElementById("system").innerHTML = home;
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error.message);
        });
}

function setPlayerAudio(id) {
    fetch(`https://normvgmusic.pythonanywhere.com/api/audio-data?id=${id}`)
        .then(response => response.json())
        .then(data => {
            const item = data[0];
            document.getElementById("audio-title").innerText = item.name;
            document.getElementById("audio-art").src = `https://normvgmusic.pythonanywhere.com${item.art}`;
            document.getElementById("music").src = `https://normvgmusic.pythonanywhere.com/api/audio?id=${id}`;
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error.message);
        });
}

play.addEventListener("click", togglePlay);
loop.addEventListener("click", toggleLoop);
shuffle.addEventListener("click", toggleShuffle);
