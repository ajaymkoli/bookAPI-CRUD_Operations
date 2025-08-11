document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('book-list');
    const bookForm = document.getElementById('book-form');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const bookIdInput = document.getElementById('book-id');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    const API_URL = '/books';
    let books = []; // Use a local variable to store the books

    // Fetch and render all books
    const fetchBooks = async () => {
        const response = await fetch(API_URL);
        books = await response.json(); // Assign the fetched data to the local 'books' array
        renderBooks(books);
    };

    // Render books to the DOM
    const renderBooks = (booksToRender) => {
        bookList.innerHTML = '';
        booksToRender.forEach(book => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${book.title}</strong> by ${book.author}</span>
                <div class="book-actions">
                    <button class="edit-btn" data-id="${book.id}">Edit</button>
                    <button class="delete-btn" data-id="${book.id}">Delete</button>
                </div>
            `;
            bookList.appendChild(li);
        });
    };

    // Handle form submission (Add or Update)
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = bookIdInput.value;
        const title = titleInput.value;
        const author = authorInput.value;

        if (id) {
            // Update an existing book
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author })
            });
        } else {
            // Add a new book
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author })
            });
        }

        bookForm.reset();
        bookIdInput.value = '';
        submitBtn.textContent = 'Add Book';
        cancelBtn.style.display = 'none';
        fetchBooks(); // Refresh the list
    });

    // Handle Edit and Delete button clicks
    bookList.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('delete-btn')) {
            // Delete a book
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchBooks(); // Refresh the list
        } else if (e.target.classList.contains('edit-btn')) {
            // Find the book and populate the form for editing
            // The books array is guaranteed to be up-to-date due to the fetchBooks() call
            const bookToEdit = books.find(b => b.id === parseInt(id));
            if (bookToEdit) {
                bookIdInput.value = bookToEdit.id;
                titleInput.value = bookToEdit.title;
                authorInput.value = bookToEdit.author;
                submitBtn.textContent = 'Update Book';
                cancelBtn.style.display = 'inline-block';
            }
        }
    });

    // Handle Cancel Update button
    cancelBtn.addEventListener('click', () => {
        bookForm.reset();
        bookIdInput.value = '';
        submitBtn.textContent = 'Add Book';
        cancelBtn.style.display = 'none';
    });

    // Initial fetch of books when the page loads
    fetchBooks();
});