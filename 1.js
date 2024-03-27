
var music = document.getElementById("music")
const barFull = document.getElementById("bar-full")
const barNow = document.getElementById("bar-now")



function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    return `${minutes}:${Math.floor(remainingSeconds)}`;
}



music.ontimeupdate = function (e){
    document.getElementById("play-full").innerText = formatTime(music.duration) 
    document.getElementById("play-now").innerText = formatTime( music.currentTime)
    barNow.style.width = Math.floor(music.currentTime*100/music.duration)+"%";
    
}

function playmusic(){
    var play = document.getElementById("play")
    if (play.className == "on"){
        var play_icon = document.getElementById("play-ico")
        
        music.pause()
        play_icon.src = "img/play.png"
        play.className = "off"
        return
    }
    if (play.className == "off"){
        var play_icon = document.getElementById("play-ico")
        
        play_icon.src = "img/pause.png"
        play.className = "on"
        music.play()
        return
    }
}