const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if(!username || !password) {
    return res.status(400).send('username and password are required')
  }
  const userExists = users.find(user => user.username === username);

  if(userExists) {
    return res.status(400).send('This username already exists')
  }

  users.push({
    username: req.body.username,
    password: req.body.password,
  });
  return res.status(201).send("User " + req.body.username + " registered successfully." )
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  res.send(JSON.stringify({ books }, null, 3))
});

// reuse   function to get book by different criteria

 const  findBookByParam = (param) => {
  for (let key in books) {
    let book = books[key];
    if(book.isbn === param || book.author === param || book.title === param) {
      return book;
    }
  }
  return null;
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

  if(findBookByIsbn && typeof findBookByIsbn === 'object'){

    if(Object.keys(findBookByIsbn.reviews).length === 0) {
      console.log('No review available');
      res.send('No review available')
    }
    else {
      res.send(JSON.stringify(findBookByIsbn.reviews, null, 3));
    }

  } else{
    res.send('book not found please check and try again')
  }
});

module.exports.general = public_users;
module.exports.findBookByParam = findBookByParam;