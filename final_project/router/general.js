const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users[username] = password;
      return res.status(200).json({ message: "User registered successfully" });
    } else {
      return res.status(404).json({ message: "User already exists" });
    }
  } else {
    return res.status(404).json({ message: "Username and password are required" });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return new Promise((resolve, reject) => {
    resolve(books);
  }).then((books) => {
    return res.send(JSON.stringify(books, null, 4));
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return new Promise((resolve, reject) => {
    resolve(books[isbn]);
  }).then((book) => {
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  return new Promise((resolve, reject) => {
    resolve(books[author]);
  }).then((book) => {
    const filteredBooks = Object.values(books).filter(book => 
        book.author.toLowerCase() === author.toLowerCase()
      );
  
      if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
      } else {
        return res.status(404).json({ message: "Author not found" });
      }
  })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    return new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      }
    })
    .then((books) => {
      const booksArray = Object.values(books);
  
      const filteredBooks = booksArray.filter(book => 
        book.title.toLowerCase() === title.toLowerCase()
      );
  
      if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  console.log(book);
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
