const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({ books }, null, 4))
});

// reuse   function to get book by different criteria

 function findBookByParam(param) {
  for (let key in books) {
    let book = books[key];
    if(book.isbn === param || book.author === param || book.title === param) {
      return book;
    }
  }
  return `No book found`
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const bookFoundWitnIsbn = findBookByParam(isbn)
  res.send(bookFoundWitnIsbn)
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookFindByAuthor = findBookByParam(author)
  res.send(bookFindByAuthor)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookFindByTitle = findBookByParam(title);
  res.send(bookFindByTitle)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const findBookByIsbn = findBookByParam(isbn);

  if(typeof findBookByIsbn == 'object'){
    res.send(findBookByIsbn.review);
  } else{
    res.send('book review not found')
  }
});

module.exports.general = public_users;
