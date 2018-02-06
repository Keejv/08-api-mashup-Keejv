/* Code goes here */
import './styles/app.scss';
import {
  map
} from 'benchmark';

class Mashed {
  constructor(element) {
    this.root = element;

    var searchBtn = document.getElementById('searchBtn')                        // skapa en variabel koppla på id searchBtn
    searchBtn.addEventListener('click', () => {                                 // lyssna efter click
      var searchRequest = document.getElementById('searchInput').value;         //spara input i searchRequest

      this.fetchFlickrPhotos(searchRequest);
      this.fetchWordlabWords(searchRequest);

      //  console.log(searchRequest);
    })

    var keyEnter = document.getElementById('searchInput')                    
    keyEnter.addEventListener('keyup', (e) => {                               
      e.preventDefault();
      if(e.keyCode === 13) {
        
        var searchRequest = document.getElementById('searchInput').value;         
  
        this.fetchFlickrPhotos(searchRequest);
        this.fetchWordlabWords(searchRequest);
  
        //  console.log(searchRequest);
      }
    })

  }

  flickerResponse(res) {                                                      // Funktionen flickerResponse(parameter=res) mappar och renderar ut bilden
    let flickerPicture = '';                                                  // Skapar en tom variabel som ska fyllas med innehåll(flickerPicture)
    res.photos.photo.map((photo) => {                                         // Här mappar vi till url_m
      flickerPicture +=
        `<li class="list-group-items" id="results">
          <p><img src="${photo.url_m}"></p>
       </li>`
    })
    document.querySelector('.list-group').innerHTML = flickerPicture;         //här sparar vi resultat som vi sedan skickar ut i DOMen
  }

  worldlabwordsRespons(res) {
    let words = Object.keys(res).map(key => {                                 // kollar igenom arrays i object och mappar ut keys och tar sedan keys vaule som sparars i egen array.
      return Object.values(res[key]).map(word => {
        return word;
      });
    });

    words = flatten(words);
    // console.log(words)

    var wordList = document.querySelector('.wordList');
    wordList.innerHTML = '';
    let newWords = '';
    words.map((word) => {
      newWords +=
        `<li>
    <a href="#">${word}</a>
    </li>`
    })

    wordList.innerHTML = newWords;

    document.querySelectorAll('.wordList li a').forEach(element => {          //Pekar på .wordList class där varje element jag klickar på
      element.addEventListener('click', event => {                            //tar det value och söker det mot flicker api och worldlab api.
        // this.fetchFlickrPhotos(event.target.text);
        // this.fetchWordlabWords(event.target.text);
        Promise.all([
          this.fetchFlickrPhotos(event.target.text),
          this.fetchWordlabWords(event.target.text)
        ])
      })
    })
  }


  fetchFlickrPhotos(searchRequest) {                                          // Denna fetch kollar på variabeln searchRequest
    let resourceUrl =
      'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='
    let flickrAPIkey = process.env.myKittyKey

    let flickrQueryParams =
      '&text=' + searchRequest +                                              //Vad variabeln flickrQueryParams ska söka efter
      '&extras=url_m&format=json&nojsoncallback=1'
    let flickrUrl = resourceUrl + flickrAPIkey + flickrQueryParams

    fetch(flickrUrl)
      .then(res => res.json())
      .then(res => {
        // console.log('Got response from FlickR!')
        // console.log(res.photos.photo[0].url_q)                            // Using the console.log to traversing in i "the rabbithole"
        this.flickerResponse(res)                                            // fetchFlickerPhotots skickar response till funktioen flickerResponse
      })
      .catch(err => console.error(err))
  }

  fetchWordlabWords(query) {
    let wordLabAPIkey = process.env.wordLabApi
    let wordLabUrl = `http://words.bighugelabs.com/api/2/${wordLabAPIkey}/${query}/json`;

    fetch(wordLabUrl)
      .then(res => res.json())
      .then(res => {
        // console.log('Got response from BigHugeLabs!')
        // console.log(res)
        this.worldlabwordsRespons(res);
      })
      .catch(err => console.error(err))
  }
}

function flatten(words) {                                       // high-tech funktion från Axel, men om jag förstår det rätt 
  const flat = [].concat(...words);                             // så kollar den efter värden i array från api och även om det
  return flat.some(Array.isArray) ? flatten(flat) : flat;       // finns listor i listan och sparar värdet i en array som jag sedan kan kalla på i words  
}                                                               // rekursiv, en funktion som ropar på sig själv.

(function () {
  new Mashed(document.querySelector('#mashed'))
})();