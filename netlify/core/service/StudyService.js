const Service = require("./service");

class StudyService extends Service {
    constructor() {
        super('Study');
        this.movieService = undefined;
    }

    postConstructor(movieService) {
        this.movieService = movieService;
    }

    delete(id) {
        if (this.listMoviesById(id).length > 0) {
            throw `This study is used by someone book`;
        }
        return super.delete(id);
    }

    insertMovie(movie) {
        movie.studies.forEach(id => {
            let study = this.find(id);
            study.movies.push(movie.id);
            super.update(study, study.id);
        });
    }

    deleteMovie(movie) {
        movie.studies.forEach(id => {
            let study = this.find(id);
            study.movies = study.movies.filter(id => id !== movie.id);
            super.update(study, study.id);
        });
    }

    findByMovie(movie) {
        let result = [];
        movie.studies.forEach(id => {
            let study = this.find(id);
            if (study) {
                result.push(study);
            }
        });
        return result;
    }

    listMoviesById(id) {
        let study = this.find(id);
        if (study) {
            let movies = this.movieService.listByStudy(study.id);
            if (movies) return movies;
            throw 'Movies not found';
        }
        throw 'Study not found';
    }
}

module.exports = StudyService;