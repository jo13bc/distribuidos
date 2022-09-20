const { equals } = require("../utils/Util");
const Service = require("./service");

class MovieService extends Service {
    constructor() {
        super('Movie');
        this.directorService = undefined;
        this.studyService = undefined;
    }

    postConstructor(directorService, studyService) {
        this.directorService = directorService;
        this.studyService = studyService;
    }

    insert(entity, id) {
        return super.insert(entity, id, movie => {
            this.directorService.insertMovie(movie);
            this.studyService.insertMovie(movie);
        });
    }

    update(entity, id) {
        let oldMovie = super.find(id);
        return super.update(entity, id, newMovie => {
            if (oldMovie.directorId != newMovie.directorId) {
                this.directorService.insertMovie(newMovie);
                this.directorService.deleteMovie(oldMovie);
            }
            if (!equals(newMovie.studies, oldMovie.studies)) {
                this.studyService.insertMovie(newMovie);
                this.studyService.deleteMovie(oldMovie);
            }
        });
    }

    delete(id) {
        return super.delete(id, movie => {
            this.directorService.deleteMovie(movie);
            this.studyService.deleteMovie(movie);
        });
    }

    listByDirector(directorId) {
        let list = this.entities.filter(m => m.directorId === directorId);
        if (list) return list;
        throw 'Movie not found';
    }

    listByStudy(studyId) {
        let list = this.entities.filter(m => m.studies.includes(studyId));
        if (list) return list;
        throw 'Movie not found';
    }

    findDirectorById(id) {
        let movie = super.find(id);
        if (movie) {
            let director = this.directorService.find(movie.directorId);
            if (director) return director;
            throw 'Director not found';
        }
        throw 'Movie not found';
    }

    findStudiesById(id) {
        let movie = super.find(id);
        if (movie) {
            let studies = this.studyService.findByMovie(movie);
            if (studies) return studies;
            throw 'Studies not found';
        }
        throw 'Movie not found';
    }
}

module.exports = MovieService;