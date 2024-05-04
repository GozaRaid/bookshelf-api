const { 
  AddBook, 
  GetAllBook, 
  GetBookById, 
  UpdateBook, 
  DeleteBook 
} = require("./handler");

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: AddBook,
  },

  {
    method: 'GET',
    path: '/books',
    handler: GetAllBook,
  },

  {
    method: 'GET',
    path: '/books/{id}',
    handler: GetBookById,
  },

  {
    method: 'PUT',
    path: '/books/{id}',
    handler: UpdateBook,
  },

  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: DeleteBook,
  },
];

module.exports = routes;