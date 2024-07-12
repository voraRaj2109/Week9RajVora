//Raj Vora
//N01597884

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.log("DB Error:", err);
});

// Routes
const bookRouter = require("./routes/book_router");
app.use("/books", bookRouter);

// Serve the add_book.html file
app.get("/add-book", (req, res) => {
  res.sendFile(path.join(__dirname, "views/add_book.html"));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
