const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
let books = require("./booksdb.js");
const findBookByParam = require("./general.js").findBookByParam;
const regd_users = express.Router();

let users = [{
  "username": "manon",
  "password": "manon#"
}
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(user => user.username === username && user.password === password);
  return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if(!username || !password) {
    return res.status(400).json({message: "Error loggging in: Username and password are required."});
  }

  if(authenticatedUser(username, password)) {
   //Generate jwt
    const token = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60});

    req.session.authorization = {
      token, username
    }
    return res.status(200).send("User Successfully logged in")
  } else {
      return res.status(401).json({message: "Invalid username or password." });

    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  // Vérifie si l'utilisateur est connecté
  if (!username) {
      return res.status(403).json({ message: "User needs to be logged in" });
  }

  // Vérifie si la critique est fournie
  if (!review) {
      return res.status(400).json({ message: "Review is required" });
  }

  // Trouve le livre par ISBN
  const bookFindByIsbn = findBookByParam(isbn);

  // Vérifie si le livre existe
  if (!bookFindByIsbn) {
      return res.status(404).json({ message: 'Book not found' });
  }

  // Si l'utilisateur a déjà posté une critique, mettez-la à jour
  if (bookFindByIsbn.reviews.hasOwnProperty(username)) {
      bookFindByIsbn.reviews[username] = review;
      return res.status(200).json({ message: "Review updated successfully" });
  } else {
      // Sinon, ajoute une nouvelle critique
      bookFindByIsbn.reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const username = req.session.authorization?.username;
  const bookFindByIsbn = findBookByParam(isbn)

  if (!username) {
    return res.status(401).json({ message: "The user need to register" });
  }

  if (!bookFindByIsbn) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Vérifier si l'utilisateur a déjà posté une critique pour ce livre
  if (!bookFindByIsbn.reviews || !bookFindByIsbn.reviews[username]) {
    return res.status(404).json({ message: "No review found" });
  }

  // Supprimer la critique de l'utilisateur
  delete books[isbn].reviews[username];

  // Répondre avec un message de succès
  return res.status(200).json({ message: "Review delete successfully" });
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
