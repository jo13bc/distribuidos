const AuthorService = require('./AuthorService');
const PublisherService = require('./PublisherService');
const BookService = require('./BookService');

const authorService = new AuthorService();
const publisherService = new PublisherService();
const bookService = new BookService();

authorService.postConstructor(bookService);
publisherService.postConstructor(bookService);
bookService.postConstructor(authorService, publisherService);

const Service = { author: authorService, publisher: publisherService, book: bookService };

module.exports = Service;