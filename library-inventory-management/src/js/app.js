// JavaScript logic for managing the book inventory

let books = [];
let editIndex = null;

// Seleccionar elementos del DOM
const bookForm = document.getElementById('bookForm');
const bookTableBody = document.querySelector('#bookTable tbody');
const bookTitleInput = document.getElementById('bookTitle');
const bookDescriptionInput = document.getElementById('bookDescription');
const bookImageInput = document.getElementById('bookImage');

// Cargar libros desde Local Storage
document.addEventListener('DOMContentLoaded', renderBooks);

// Manejar el envío del formulario
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const bookTitle = bookTitleInput.value;
    const bookDescription = bookDescriptionInput.value;
    const file = bookImageInput.files[0];

    if (editIndex !== null) {
        // Editar libro existente
        const books = getBooksFromLocalStorage();
        // Si se selecciona una nueva imagen, actualizarla
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const bookImage = event.target.result;
                books[editIndex] = {
                    title: bookTitle,
                    description: bookDescription,
                    image: bookImage
                };
                localStorage.setItem('books', JSON.stringify(books));
                renderBooks();
                resetForm();
            };
            reader.readAsDataURL(file);
        } else {
            books[editIndex].title = bookTitle;
            books[editIndex].description = bookDescription;
            localStorage.setItem('books', JSON.stringify(books));
            renderBooks();
            resetForm();
        }
    } else {
        // Agregar nuevo libro
        if (!file) return; // Se requiere imagen
        const reader = new FileReader();
        reader.onload = function (event) {
            const bookImage = event.target.result;
            const book = {
                title: bookTitle,
                description: bookDescription,
                image: bookImage
            };
            addBookToLocalStorage(book);
            addBookToTable(book);
            bookForm.reset();
        };
        reader.readAsDataURL(file);
    }
});

// Agregar libro a la tabla
function addBookToTable(book) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${book.image}" alt="${book.title}" class="img-thumbnail" style="width: 100px;"></td>
        <td>${book.title}</td>
        <td>${book.description}</td>
        <td>
            <button class="btn btn-warning btn-sm edit-btn">Editar</button>
            <button class="btn btn-danger btn-sm delete">Eliminar</button>
        </td>
    `;
    bookTableBody.appendChild(row);

    // Manejar la eliminación del libro
    row.querySelector('.delete').addEventListener('click', () => {
        removeBookFromLocalStorage(book.title);
        row.remove();
    });

    // Manejar la edición del libro
    row.querySelector('.edit-btn').addEventListener('click', () => {
        const books = getBooksFromLocalStorage();
        const bookToEdit = books.find(b => b.title === book.title && b.description === book.description);
        bookTitleInput.value = bookToEdit.title;
        bookDescriptionInput.value = bookToEdit.description;
        editIndex = books.indexOf(bookToEdit);
        document.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    });
}

// Cargar libros desde Local Storage
function renderBooks() {
    const books = getBooksFromLocalStorage();
    bookTableBody.innerHTML = '';
    books.forEach(addBookToTable);
}

// Obtener libros desde Local Storage
function getBooksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('books')) || [];
}

// Agregar libro a Local Storage
function addBookToLocalStorage(book) {
    const books = getBooksFromLocalStorage();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
}

// Eliminar libro de Local Storage
function removeBookFromLocalStorage(title) {
    const books = getBooksFromLocalStorage();
    const filteredBooks = books.filter(book => book.title !== title);
    localStorage.setItem('books', JSON.stringify(filteredBooks));
}

// Función para resetear el formulario
function resetForm() {
    bookForm.reset();
    document.querySelector('button[type="submit"]').textContent = 'Add Book';
    editIndex = null;
}