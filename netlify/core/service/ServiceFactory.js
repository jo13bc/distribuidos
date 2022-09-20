const StudyService = require('./StudyService');
const DirectorService = require('./DirectorService');
const MovieService = require('./MovieService');

const studyService = new StudyService();
const directorService = new DirectorService();
const movieService = new MovieService();

studyService.postConstructor(movieService);
directorService.postConstructor(movieService);
movieService.postConstructor(directorService, studyService);

const Service = { study: studyService, director: directorService, movie: movieService };

module.exports = Service;