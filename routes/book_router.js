const express = require("express");
const { body, validationResult } = require("express-validator");
const Book = require("../models/books");

const router = express.Router();

// Validation middleware
const validateBook = [
  body("title", "Title is required").notEmpty(),
  body("author", "Author is required").notEmpty(),
  body("pages", "Pages is required").notEmpty(),
  body("genres", "Genres is required").notEmpty(),
  body("rating", "Rating is required").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Get all books
router.get("/", (req, res) => {
  Book.find({})
    .then(books => res.json(books))
    .catch(err => res.status(500).json({ error: "Internal Server Error" }));
});

// Add a new book
router.post("/", validateBook, (req, res) => {
  const { title, author, pages, genres, rating } = req.body;
  const newBook = new Book({ title, author, pages, genres, rating });

  newBook.save()
    .then(() => res.json({ message: "Successfully Added" }))
    .catch(err => res.status(500).json({ error: "Internal Server Error" }));
});

// Delete a book by ID
router.delete("/:id", (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.json({ message: "Successfully Deleted" });
      } else {
        res.status(404).json({ error: "Book not found" });
      }
    })
    .catch(err => res.status(500).json({ error: "Internal Server Error" }));
});

module.exports = router;
