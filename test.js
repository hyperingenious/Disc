const mm = require('music-metadata');

async function getAlbumArt(filePath) {
  try {
    const metadata = await mm.parseFile(filePath, { duration: true });
    
    if (metadata && metadata.common && metadata.common.picture) {
      const picture = metadata.common.picture[0];
      const base64String = picture.data.toString('base64');
      const mimeType = picture.format;

      const albumArtUrl = `data:${mimeType};base64,${base64String}`;
      
      return albumArtUrl;
    } else {
      console.log('No album art found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching album art:', error);
    return null;
  }
}

// Usage
const filePath = 'https://normvgmusic.pythonanywhere.com/api/audio?id=10LC_ll-3y3wGdrRc3h1UphDS0fqcaQu6';
getAlbumArt(filePath)
  .then(albumArtUrl => {
    if (albumArtUrl) {
      console.log('Album art URL:', albumArtUrl);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
