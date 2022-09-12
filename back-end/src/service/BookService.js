const Service = require("./service");

class BookService extends Service {
    constructor() {
        super('Book');
        this.authorService = undefined;
        this.publisherService = undefined;
    }

    postConstructor(authorService, publisherService) {
        this.authorService = authorService;
        this.publisherService = publisherService;
    }

    insert(entity, id) {
        return super.insert(entity, id, book => {
            this.authorService.insertBook(book);
            this.publisherService.insertBook(book);
        });
    }

    update(entity, id) {
        let oldBook = super.find(id);
        return super.update(entity, id, newBook => {
            if (oldBook.author_id != newBook.author_id) {
                this.authorService.insertBook(newBook);
                this.authorService.deleteBook(oldBook);
            } else {
                this.authorService.updateBook(newBook);
            }
            if (oldBook.publisher_id != newBook.publisher_id) {
                this.publisherService.insertBook(newBook);
                this.publisherService.deleteBook(oldBook);
            } else {
                this.publisherService.updateBook(newBook);
            }
        });
    }

    delete(id) {
        return super.delete(id, book => {
            this.authorService.deleteBook(book);
            this.publisherService.deleteBook(book);
        });
    }

    listByAuthor(authorId) {
        let list = this.entities.filter(b => b.author_id === authorId);
        if (list) return list;
        throw 'Book not found';
    }

    listByPublisher(publisherId) {
        let list = this.entities.filter(b => b.publisher_id === publisherId);
        if (list) return list;
        throw 'Book not found';
    }

    findAuthorById(id) {
        let book = super.find(id);
        if (book) {
            let author = this.authorService.find(book.author_id);
            if (author) return author;
            throw 'Author not found';
        }
        throw 'Book not found';
    }

    findPublisherById(id) {
        let book = super.find(id);
        if (book) {
            let publisher = this.publisherService.find(book.publisher_id);
            if (publisher) return publisher;
            throw 'Publisher not found';
        }
        throw 'Book not found';
    }

    updateAuthor(author) {
        this.listByAuthor(author.id)
            .forEach(book => {
                book.author = author.author;
                this.update(book);
            });
    }

    updatePublisher(publisher) {
        this.listByAuthor(publisher.id)
            .forEach(book => {
                book.author = publisher.publisher;
                this.update(book);
            });
    }
}

module.exports = BookService;