"use strict";
// Buat nyimpen buku-bukunya
const books = [];
let filteredBooks = books;
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const generateId = () => +new Date();
document.addEventListener(RENDER_EVENT, () => {
    const incompleteBookLength = books.filter((book) => !book.isComplete).length;
    const completeBookLength = books.filter((book) => book.isComplete).length;
    const incompleteBookList = document.getElementById('incompleteBookshelfList');
    incompleteBookList.innerHTML = '';
    const completeBookList = document.getElementById('completeBookshelfList');
    completeBookList.innerHTML = '';
    if (incompleteBookLength) {
        for (const book of filteredBooks) {
            !book.isComplete && (incompleteBookList.innerHTML += makeBook(book));
        }
    }
    else {
        incompleteBookList.innerHTML = 'Buku tidak ada.';
    }
    if (completeBookLength) {
        for (const book of filteredBooks) {
            book.isComplete && (completeBookList.innerHTML += makeBook(book));
        }
    }
    else {
        completeBookList.innerHTML = 'Buku tidak ada.';
    }
    // Buat trigger tombol selesai sama delete kalo diklik
    const buttons = document.querySelectorAll('.btn-action');
    buttons.forEach((btn) => {
        const id = parseInt(btn.parentElement.dataset.id);
        const btnCheck = btn.children[0];
        const btnDel = btn.children[1];
        btnCheck.addEventListener('click', () => btnCheckHandler(id));
        btnDel.addEventListener('click', () => btnDeleteHandler(id));
    });
});
const isStorageExist = () => typeof Storage !== undefined;
// Ngambil buku dari local storage
const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(serializedData || '{}');
    if (data !== null)
        for (const book of data)
            books.push(book);
    document.dispatchEvent(new Event(RENDER_EVENT));
};
// Nyimpen buku ke local storage
const saveData = () => {
    if (isStorageExist()) {
        const parsedData = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsedData);
    }
};
// Buat nambah buku ke array of object
const addBook = () => {
    const book = {
        title: document.querySelector('#title').value,
        author: document.querySelector('#author').value,
        year: parseInt(document.querySelector('#year').value),
        isComplete: document.querySelector('#isComplete')
            .checked,
        id: generateId(),
    };
    books.push(book);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};
// Buat bikin element bukunya
const makeBook = ({ id, title, author, year, isComplete }) => {
    let output = `
    <article class='book-item card' data-id=${id}>
      <h3>${title}</h3>
      <p>Penulis: ${author}</p>
      <p>Tahun: ${year}</p>
      <div class='btn-action'>
        <button class='btn-success btn-check'>
          ${isComplete ? 'Belum Selesai' : 'Selesai'}
        </button>
        <button class='btn-danger btn-delete'>Hapus</button>
      </div>
    </article>`;
    return output;
};
// Buat Nyari Buku
const findBookId = (id) => books.find((book) => book.id === id) || null;
const findBookTitle = (keyword) => books.filter((book) => keyword ? book.title.toLowerCase().includes(keyword) : book);
const findBookIndex = (id) => {
    for (const index in books) {
        if (books[index].id === id)
            return parseInt(index);
    }
    return -1;
};
// Buat tombol selesai
const btnCheckHandler = (id) => {
    const selectedId = findBookId(id);
    if (selectedId == null)
        return;
    selectedId.isComplete = !selectedId.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};
// Buat tombol hapus
const btnDeleteHandler = (id) => {
    const selectedIndex = findBookIndex(id);
    if (selectedIndex == -1)
        return;
    const selectedBook = books[selectedIndex];
    const dialogText = `Apakah anda yakin ingin menghapus Buku ${selectedBook.title}?`;
    if (confirm(dialogText)) {
        books.splice(selectedIndex, 1);
        filteredBooks = books;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
};
const searchBook = () => {
    const keyword = (document.querySelector('#search')).value.toLowerCase();
    filteredBooks = findBookTitle(keyword);
    document.dispatchEvent(new Event(RENDER_EVENT));
};
document.addEventListener('DOMContentLoaded', () => {
    // Buat ngambil data dari lokal storage
    isStorageExist() && loadDataFromStorage();
    // Buat form input
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();
        // Ngosongin isi formulir setelah disubmit
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#year').value = '';
        document.querySelector('#isComplete').checked = false;
    });
    // Buat form cari buku
    const inputSearch = document.getElementById('search');
    inputSearch.addEventListener('input', () => searchBook());
});
