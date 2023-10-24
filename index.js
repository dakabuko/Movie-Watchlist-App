/* selectors */

const formEl = document.getElementById('form')

const searchInput = document.getElementById('search-input')

const moviesContainer = document.getElementById('movies-container')

let requestUrl = ''
let movieHtml = ''
let movieArray = []
let movieArrayDetailed = []
let watchlist = JSON.parse(localStorage.getItem('wacthlist') || '[]')

formEl.addEventListener('submit', (e) => {
    e.preventDefault()
    let searchString = searchInput.value

    requestUrl = `https://www.omdbapi.com/?s=${searchString}&?type=movie&apikey=b35db64b`

    fetch(requestUrl)
        .then(res => res.json())
        .then(data => {
            movieHtml = ''
            if(data.Response == 'False'){
                renderApology()
            }else{
                movieArray=data.Search
                // console.log(movieArray)
                for(let movie of movieArray){
                    getMovieDetails(movie.imdbID)
                }
            }
        })
        moviesContainer.innerHTML = ``

})

document.addEventListener('click', (e) => {
    if(e.target.dataset.id){
        const targetMovieObj = movieArrayDetailed.filter(movie => movie.imdbID === e.target.dataset.id)[0]
        if(!watchlist.includes(targetMovieObj)){
            watchlist.push(targetMovieObj)
        }
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
    }
})

function getMovieDetails(movieId){
    requestUrl = `https://www.omdbapi.com/?i=${movieId}&?type=movie&apikey=b35db64b`
    fetch(requestUrl)
        .then(res => res.json())
        .then(data => {
            movieArrayDetailed.push(data)
            // renderResults()
            console.log(movieArrayDetailed)
            updatedResultsHtml(data)
        })
    }
    
function updatedResultsHtml(movie) {
    moviesContainer.innerHTML += `
        <div class="movie">
            <div class="movie-poster">
                <img  src=${movie.Poster} />
            </div>
            <div class="movie-body">
                <div class="movie-data">
                    <h2 class="movie-title">${movie.Title}</h2>
                    <p class="movie-rating">⭐${movie.imdbRating}</p>
                </div>
                <div class="movie-details">
                    <p class="movie-runtime">${movie.Runtime}</p>
                    <p class="movie-genre">${movie.Genre}</P>
                    <button class="add-remove-btn" data-id=${movie.imdbID}>Watchlist</button>
                </div>
                <p class="movie-description">
                    ${movie.Plot}
                </p>
            </div>
        </div>
        
        
    `
}



function renderApology(){
    moviesContainer.innerHTML = `<h2>Please enter movies of your choice</h2>`
}