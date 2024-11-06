const BASE_URL = "http://localhost:8081";

class MovieService {

    constructor(showErrorMessage, searchResults, searchPaginatorTotalResults) {
        this.showErrorMessage = showErrorMessage;
        this.searchResults = searchResults;
        this.searchPaginatorTotalResults = searchPaginatorTotalResults;
    }

    static DeleteFavorite(imdbID) {
        fetch(BASE_URL + '/movie-favorite/delete?' + new URLSearchParams({imdbID: imdbID}).toString(),
        {
            method: 'DELETE',
        })
    }

    static GetFavorites(favorites) {
        fetch(BASE_URL + '/movie-favorite/favorites',
        {
            method: 'GET',
        })
        .then(response => {
                response.json().then((res) => {
                    favorites.value = res;
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    static SaveFavorite(movieData) {
        fetch(BASE_URL + '/movie-favorite/favorite', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imdbID: movieData.imdbID,
                title: movieData.Title,
                year: movieData.Year
            })
        })
            .then(() => {
                movieData.isFavorite = true;
            })
            .catch(err => {
                console.error(err);
            });
    }

    searchMovies(title, year, page) {
        if (!year) {
            year = "";
        }
        if (!title || title === "") {
            this.showErrorMessage.value = true;
        } else {
            this.showErrorMessage.value = false;
            fetch(BASE_URL + '/movie-search/movie?' + new URLSearchParams({
                                                                    title: title,
                                                                    year: year,
                                                                    page: page
                                                                    }).toString(),
        {
            method: 'GET',
        })
            .then(response => {
                response.json().then((res) => {
                    this.searchResults.value = res.Search;
                    this.searchPaginatorTotalResults.value = Number(res.totalResults);
                });
            })
            .catch(err => {
                console.error(err);
            }); 
        }
    }
}

export {MovieService};