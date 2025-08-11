const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Serve static files from the 'public' directory
// This line makes all files inside the 'public' folder accessible
// directly from the root URL.
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store for books
let books = [
    { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
    { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

// Helper function to generate a unique ID
const getNextId = () => {
    if (books.length === 0) {
        return 1;
    }
    const maxId = Math.max(...books.map(book => book.id));
    return maxId + 1;
};

// --- API Endpoints ---

// GET /books: Retrieve all books
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

// GET /books/:id: Retrieve a single book by its ID
app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({ message: `Book with ID ${id} not found.` });
    }
    res.status(200).json(book);
});

// POST /books: Create a new book
app.post('/books', (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and author are required.' });
    }
    const newBook = { id: getNextId(), title, author };
    books.push(newBook);
    res.status(201).json(newBook);
});

// PUT /books/:id: Update an existing book
app.put('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, author } = req.body;
    let book = books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({ message: `Book with ID ${id} not found.` });
    }
    if (title) book.title = title;
    if (author) book.author = author;
    res.status(200).json(book);
});

// DELETE /books/:id: Delete a book
app.delete('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = books.length;
    books = books.filter(b => b.id !== id);
    if (books.length === initialLength) {
        return res.status(404).json({ message: `Book with ID ${id} not found.` });
    }
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});