/* Code goes here */
import './styles/app.scss';

class Mashed {
  constructor(element) {
    this.root = element;

    var searchBtn = document.getElementById('searchBtn')                // skapa en variabel koppla på id searchBtn
    searchBtn.addEventListener('click', () => {                         // lyssna efter click
     var searchRequest = document.getElementById('searchInput').value;  //spara input i searchRequest
     
     this.fetchFlickrPhotos(searchRequest);
     this.fetchWordlabWords('detest');

     console.log(searchRequest);
    })

  }

  flickerResponse(res){                                                 // Funktionen flickerResponse(parameter=res) mappar och renderar ut bilden
    let flickerPicture = '';                                            // Skapar en tom variabel som ska fyllas med innehåll(flickerPicture)
    res.photos.photo.map((photo) => {                                   // Här mappar vi till url_m
      flickerPicture += 
      `<li class="list-group-items" id="results">
          <p><img src="${photo.url_m}"></p>
       </li>`
    })
    document.querySelector('.list-group').innerHTML = flickerPicture;   //här sparar vi resultat som vi sedan skickar ut i DOMen
  }

  fetchFlickrPhotos(searchRequest) {                                  // Denna fetch kollar på variabeln searchRequest
    let resourceUrl =
      'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='
    let flickrAPIkey = process.env.myKittyKey

    let flickrQueryParams =
      '&text=' + searchRequest +                                        //Vad variabeln flickrQueryParams ska söka efter
      '&extras=url_m&format=json&nojsoncallback=1'
    let flickrUrl = resourceUrl + flickrAPIkey + flickrQueryParams

    fetch(flickrUrl)
      .then(res => res.json())
      .then(res => {
        // console.log('Got response from FlickR!')
        // console.log(res.photos.photo[0].url_q)                            // Using the console.log to traversing in i "the rabbithole"
      this.flickerResponse(res)                                              // fetchFlickerPhotots skickar response till funktioen flickerResponse
      })
      .catch(err => console.error(err))
  }

  fetchWordlabWords(query) {
    let wordLabAPIkey = '9d30c37acd6d49022f294eeff979f914'
    let wordLabUrl = `http://words.bighugelabs.com/api/2/${wordLabAPIkey}/${query}/json`

    fetch(wordLabUrl)
      .then(res => res.json())
      .then(res => {
        console.log('Got response from BigHugeLabs!')
        console.log(res)
      })
      .catch(err => console.error(err))
  }
}

(function() {
  new Mashed(document.querySelector('#mashed'))
})();

/* vad ska du ha för inputs? lyssna på enter eller key up, 
det ordet kopplar du ihop och skickar in i query param.
skicka en förfråga att du vill ha relevanta bilder på sök förfrågan och de bilderna vill du sedan visa i DOMen

*/