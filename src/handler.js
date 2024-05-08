const { nanoid } = require("nanoid");
const books = require("./Books");

const AddBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };

  const isSuccess = !books.find((book) => book.id === id) &&  name && pageCount >= readPage;;

  if(isSuccess){
    books.push(newBook);
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
  
  if (readPage > pageCount){
    const response = h.response({
      status : "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    });
    response.code(400);
    return response;
  } else if (!name) {
    const response = h.response({
      status : "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku"
    });
    response.code(400);
    return response;
  } else {
    const response = h.response({
      status : "fail",
      message: "Gagal menambahkan buku"
    });
    response.code(500);
    return response;
  }
  
};

// const GetAllBooks = (request, h) => {
//   const queryParams = Object.keys(request.query);
//   const value = request.query[queryParams[0]];

//   console.log(queryParams,value);

//   console.log(request.query);

//   const filter = books.filter((book)=> book.queryParams === value);

//   console.log(filter);

//   const detailbook = books.map((book) => {
//     return {
//       id: book.id,
//       name: book.name,
//       publisher: book.publisher
//     };
//   });

//   const response = h.response({
//     status: "success",
//     data: {
//       books: detailbook
//     },
//   });
//   response.code(200);
//   return response;
// };




// const GetAllBooks = (request, h) => {
//   const b = books.filter((book) => {
//       for (const key in request.queries) {
//         if (book[key] != request.queries[key]) {
//             return false;
//         }
//     }
    
//     return true;
//   });
  
//   console.log("=======================================================")
//   console.log(request.queries)
//   console.log(b);

//   const detailbook = books.map((book) => {
//     return {
//       id: book.id,
//       name: book.name,
//       publisher: book.publisher
//     };
//   });

//   const response = h.response({
//     status: "success",
//     data: {
//       books: detailbook
//     },
//   });
//   response.code(200);
//   return response;
// };

const GetAllBooks = (request, h) => {
  const b = books.filter((book) => {
    for (const key in request.query) {
      let value = request.query[key];
      if (value === '1') value = true;
      if (value === '0') value = false;
      if (key !== 'finished' && key != 'reading') {
        if (book[key].toLowerCase().indexOf(value.toLowerCase()) !== -1) return true;
      }
      if (book[key] != value) {
        return false;
      }
    }
    return true;
  });

  const response = h.response({
    status: "success",
    data: {
      books: b.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }))
    },
  });
  response.code(200);
  return response;
};

const GetBookById = (request, h) => {
  const { id } = request.params;

  const book = books.filter((book) => book.id === id)[0];

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
  response.code(404);
  return response;
};

const UpdateBook = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();
  
  const indexBook = books.findIndex((book) => book.id === id);

  if (indexBook !== -1 && name && pageCount >= readPage){
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
  };

  if (readPage > pageCount){
    const response = h.response({
      status : "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
    });
    response.code(400);
    return response;
  } else if (!name) {
    const response = h.response({
      status : "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku"
    });
    response.code(400);
    return response;
  } else {
    const response = h.response({
      status : "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan"
    });
    response.code(404);
    return response;
  }
};

const DeleteBook = (request, h) => {
  const { id } = request.params;
  const indexBook = books.findIndex((book) => book.id === id);

  if (indexBook !== -1 ){
    books.splice(indexBook, 1);
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
  GetAllBooks, 
  GetBookById, 
  UpdateBook,
  DeleteBook
};