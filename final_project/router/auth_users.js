const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        username: "Johnny",
        password: "mypassword123"
    }
];

const isValid = (username) => {
  let validUser = users.filter((user) => {
    return user.username === username;
  });
  if (validUser.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  let validUser = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validUser.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 })
      req.session.authorization = {
        accessToken,
        username
      }
      return res.status(200).json({ message: "User logged in successfully" });
    } else {
      return res.status(404).json({ message: "Invalid username or password" });
    }
  } else {
    return res.status(404).json({ message: "Username and password are required" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  if (isbn && username) {
    if (books[isbn]) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully" });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(404).json({ message: "ISBN, review and username are required" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const session = req.session.authorization;
  
    if (!session || !session.username) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    const username = session.username;
    if (books[isbn]) {
      let book = books[isbn];
      if (book.reviews[username]) {
        delete book.reviews[username];
        
        return res.status(200).json({ 
          message: `Review by user ${username} deleted successfully.` 
        });
      } else {
        return res.status(404).json({ message: "No review found for this user on this book." });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
