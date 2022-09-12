const Service = require("./service");

class AuthorService extends Service {
    constructor() {
        super('Author');
        this.bookService = undefined;
    }

    postConstructor(bookService) {
        this.bookService = bookService;
    }

    update(entity, id) {
        return super.update(entity, id, author => {
            this.bookService.updateAuthor(author);
        });
    }

    delete(id) {
        if (this.listBook(id).lenght > 0) {
            throw `This author is used by someone book`;
        }
        return super.delete(id);
    }

    insertBook(book) {
        let author = this.find(book.author_id);
        author.books.push({ book_id: book.id, title: book.title });
        super.update(author, author.id);
    }

    updateBook(book) {
        let author = this.find(book.author_id);
        author.books = author.books.map(a => a.id === book.author_id ? { book_id: book.id, title: book.title } : a);
        super.update(author, author.id);
    }

    deleteBook(book) {
        let author = this.find(book.author_id);
        author.books = author.books.filter(b => b.book_id !== author.book_id);
        super.update(author, author.id);
    }

    listBookById(id) {
        let author = this.find(id);
        if (author) {
            let books = this.bookService.listByAuthor(author.id);
            if (books) return books;
            throw 'Books not found';
        }
        throw 'Author not found';
    }
}

module.exports = AuthorService;