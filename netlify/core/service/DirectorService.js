const Service = require("./service");

class DirectorService extends Service {
    constructor() {
        super('Director');
        this.movieService = undefined;
    }

    postConstructor(movieService) {
        this.movieService = movieService;
    }

    delete(id) {
        if (this.listMoviesById(id).length > 0) {
            throw `This director is used by someone movie`;
        }
        console.log('aqui')
        return super.delete(id);
    }

    insertMovie(movie) {
        let director = this.find(movie.directorId);
        director.movies.push(movie.id);
        super.update(director, director.id);
    }

    deleteMovie(movie) {
        let director = this.find(movie.directorId);
        director.movies = director.movies.filter(id => id !== movie.id);
        super.update(director, director.id);
    }

    listMoviesById(id) {
        let director = this.find(id);
        if (director) {
            let movies = this.movieService.listByDirector(director.id);
            if (movies) return movies;
            throw 'Movies not found';
        }
        throw 'Director not found';
    }
}

module.exports = DirectorService;