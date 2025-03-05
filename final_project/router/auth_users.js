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

  if (!username) {
    return res.status(403).json({ message: "User need to logged in" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if(typeof findBookByParam === "object") {
    
  } else {
    res.status(404).json({ message: 'Book not found'})
  }

});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Récupère l'ISBN du livre
  const review = req.body.review; // Récupère la critique depuis le corps de la requête
  const username = req.session.authorization?.username; // Récupère le nom d'utilisateur depuis la session

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // Supposons que `books` est un objet global qui stocke les livres et leurs critiques
  if (!books[isbn]) {
    books[isbn] = { reviews: [] }; // Initialise l'objet livre s'il n'existe pas
  }

  // Recherche si l'utilisateur a déjà posté une critique pour ce livre
  const userReviewIndex = books[isbn].reviews.findIndex(
    (r) => r.username === username
  );

  if (userReviewIndex !== -1) {
    // Met à jour la critique existante
    books[isbn].reviews[userReviewIndex].review = review;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    // Ajoute une nouvelle critique
    books[isbn].reviews.push({ username, review });
    return res.status(200).json({ message: "Review added successfully" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
