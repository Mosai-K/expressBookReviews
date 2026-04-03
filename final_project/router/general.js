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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
 });const express = require('express');
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
    if (book) {
      return res.status(200).json(book);
    }
  })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let list = [];
  return new Promise((resolve, reject) => {
    resolve(books);
  }).then((books) => {
    if (title) {
      books.forEach(book => {
        if (book.title === title) {
          list.push(book);
        }
      });
      return res.status(200).json(list);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
