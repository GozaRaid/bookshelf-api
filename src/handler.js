const { nanoid } = require("nanoid");
const shelves = require("./shelf");

const AddBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updateAt = insertedAt;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updateAt
  };

  shelves.push(newBook);

  const isSuccess = shelves.filter((book) => book.id === id).length > 0;
  if(isSuccess){
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status : "fail",
    message: "Gagal menambahkan buku"
  });
  response.code(400);
  if (readPage > pageCount){
    response.message = "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount";
  } else if (!name) {
    response.message = "Gagal menambahkan buku. Mohon isi nama buku";
  }
  return response;
};

//blm selesai (menambahkan response cdoe 200 dan deklare name tidak adapat digunakan)
const GetAllBook = () => ({
  status: "success",
  data: {
    shelves: {
      id,
      name,
      publisher
    },
  },
});

const GetBookById = (request, h) => {
  const { id } = request.params;

  const book = shelves.filter((book) => book.id === id)[0];

  if(book !== undefined){
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  };

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan"
  });
  response.code(400);
  return response;
};

const UpdateBook = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload();
  const updateAt = new Date().toISOString();
  
  const indexBook = shelves.findIndex((book) => book.id === id);

  if (indexBook !== -1){
    shelves[indexBook] = {
      ...shelves[indexBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updateAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  };

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  if (readPage > pageCount){
    response.message = "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount";
    response.code(400);
  } else if (!name) {
    response.message = "Gagal memperbarui buku. Mohon isi nama buku";
    response.code(400);
  };
  return response;
};

const DeleteBook = (request, h) => {
  const { id } = request.params;
  const indexBook = shelves.findIndex((book) => book.id === id);

  if (indexBook !== -1 ){
    shelves.splice(indexBook, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus"
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan"
  });
  response.code(404);
  return response;
};

module.exports = {
  AddBook, 
  GetAllBook, 
  GetBookById, 
  UpdateBook,
  DeleteBook
};