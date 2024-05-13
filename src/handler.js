/* eslint-disable no-shadow */
const { nanoid } = require('nanoid');
const books = require('./books');

const AddBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  const isSuccess = !books.find((book) => book.id === id) && name && pageCount >= readPage;

  if (isSuccess) {
    books.push(newBook);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku',
  });
  response.code(500);
  return response;
};

const GetAllBooks = (request, h) => {
  const book = books.filter((bookfilter) => {
    const queryKeys = Object.keys(request.query);

    for (let i = 0; i < queryKeys.length; i += 1) {
      const key = queryKeys[i];
      let value = request.query[key];

      if (value === '1') value = true;
      if (value === '0') value = false;

      if (key !== 'finished' && key !== 'reading') {
        if (bookfilter[key].toLowerCase().indexOf(value.toLowerCase()) !== -1) return true;
      }

      if (bookfilter[key] !== value) {
        return false;
      }
    }
    return true;
  });

  const response = h.response({
    status: 'success',
    data: {
      books: book.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher })),
    },
  });
  response.code(200);
  return response;
};

const GetBookById = (request, h) => {
  const { id } = request.params;

  const book = books.filter((bookfilter) => bookfilter.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const UpdateBook = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const indexBook = books.findIndex((book) => book.id === id);

  if (indexBook !== -1 && name && pageCount >= readPage) {
    books[indexBook] = {
      ...books[indexBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const DeleteBook = (request, h) => {
  const { id } = request.params;
  const indexBook = books.findIndex((book) => book.id === id);

  if (indexBook !== -1) {
    books.splice(indexBook, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  AddBook,
  GetAllBooks,
  GetBookById,
  UpdateBook,
  DeleteBook,
};
