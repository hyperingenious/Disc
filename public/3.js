
function FolderItem(name,id){
    
    const item = `
    <li onclick="SetArtist('${id}')">${name}</li>
    `
    return item
}

function SetFolder(){
    var folderlist = ""
    

    fetch('https://normvgmusic.pythonanywhere.com/api/get-artist')
    .then(response => response.json())
    .then(data => {
        data.forEach((item) => {

            folderlist = folderlist+FolderItem(Object.keys(item)[0],item.id)
          });
          const home = `<div id="folder-element"><ul >${folderlist}</ul></div>`
          document.getElementById("system").innerHTML = home
    })
    .catch(error => {
      console.log('There was a problem with the fetch operation:', error.message);
    });
    
}

SetFolder()

function SetArtist(id){
    var artistlist = ""

    fetch('https://normvgmusic.pythonanywhere.com/api/audio-by-artist?id='+id)
    .then(response => response.json()) 
    .then(data => {
        var data = data[0][Object.keys(data[0])[0]]
        data.forEach((item) => {
            
            artistlist = artistlist+`<li onclick="SetPlayerAudio('${item.id}')" title="${item.name}"><span>${item.name}</span></li>`
            
          });
        
        const home = `<div id="artist-element"> <ul > ${artistlist} </ul></div>`
        document.getElementById("system").innerHTML = home
          
    })
    .catch(error => {
      console.log('There was a problem with the fetch operation:', error.message);
    });
}


function SetPlayerAudio(id){
  
  fetch('https://normvgmusic.pythonanywhere.com/api/album-art?id='+id)
  fetch('https://normvgmusic.pythonanywhere.com/api/audio-data?id='+id)
    .then(response => response.json()) 
    .then(data => {
        var data = data
        data.forEach((item) => {
            console.log(item.id,item.name)
            document.getElementById("audio-title").innerText = item.name

            document.getElementById("audio-art").src = "https://normvgmusic.pythonanywhere.com"+item.art
            document.getElementById("music").src = "https://normvgmusic.pythonanywhere.com/api/audio?id="+id
          });
          
    })
    .catch(error => {
      console.log('There was a problem with the fetch operation:', error.message);
    });
  
    
}