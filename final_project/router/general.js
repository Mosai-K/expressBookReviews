const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Register a new user
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

// Get the book list available in the shop (using Axios)
public_users.get('/', function (req, res) {
  return axios.get(`${BASE_URL}/books`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(err => {
      return res.status(500).json({ message: "Error fetching books" });
    });
});

// Get book details based on ISBN (using Axios)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return axios.get(`${BASE_URL}/books`)
    .then(response => {
      const booksData = response.data;
      const book = booksData[isbn];

      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(err => {
      return res.status(500).json({ message: "Error fetching book" });
    });
});

// Get book details based on author (using Axios)
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  return axios.get(`${BASE_URL}/books`)
    .then(response => {
      const booksArray = Object.values(response.data);

      const filteredBooks = booksArray.filter(book =>
        book.author.toLowerCase() === author.toLowerCase()
      );

      if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
      } else {
        return res.status(404).json({ message: "Author not found" });
      }
    })
    .catch(err => {
      return res.status(500).json({ message: "Error fetching books" });
    });
});

// Get all books based on title (using Axios)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  return axios.get(`${BASE_URL}/books`)
    .then(response => {
      const booksArray = Object.values(response.data);

      const filteredBooks = booksArray.filter(book =>
        book.title.toLowerCase() === title.toLowerCase()
      );

      if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(err => {
      return res.status(500).json({ message: "Error fetching books" });
    });
});

// Get book review (using Axios)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return axios.get(`${BASE_URL}/books`)
    .then(response => {
      const booksData = response.data;
      const book = booksData[isbn];

      if (book) {
        return res.status(200).json(book.reviews);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(err => {
      return res.status(500).json({ message: "Error fetching reviews" });
    });
});

module.exports.general = public_users;
