const Service = require("./service");

class PublisherService extends Service {
    constructor() {
        super('Publisher');
        this.bookService = undefined;
    }

    postConstructor(bookService) {
        this.bookService = bookService;
    }

    update(entity, id) {
        return super.update(entity, id, publisher => {
            this.bookService.updatePublisher(publisher);
        });
    }

    delete(id) {
        if (this.listBook(id).lenght > 0) {
            throw `This publisher is used by someone book`;
        }
        return super.delete(id);
    }

    insertBook(book) {
        let publisher = this.find(book.publisher_id);
        publisher.books.push({ book_id: book.id, title: book.title });
        super.update(publisher, publisher.id, undefined);
    }

    updateBook(book) {
        let publisher = this.find(book.publisher_id);
        publisher.books = publisher.books.map(a => a.id === book.publisher_id ? { book_id: book.id, title: book.title } : a);
        super.update(publisher, publisher.id, undefined);
    }

    deleteBook(book) {
        let publisher = this.find(book.publisher_id);
        publisher.books = publisher.books.filter(b => b.book_id !== publisher.book_id);
        super.update(publisher, publisher.id, undefined);
    }

    listBookById(id) {
        let publisher = this.find(id);
        if (publisher) {
            let books = this.bookService.listByPublisher(publisher.id);
            if (books) return books;
            throw 'Books not found';
        }
        throw 'Publisher not found';
    }
}

module.exports = PublisherService;