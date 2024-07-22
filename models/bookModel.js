const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    discount: {
      type: Number,
    },
    page: {
      type: Number,
    },
    publishDate: {
      type: Date,
    },
    imageLink: {
      type: String,
    },
    imagePublicId: String,
    calculatedPrice:{
      type: Number,
      default: function() {
        if (this.discount > 0) {
          return this.price * (1 - this.discount / 100);
        }
        return this.price;
      }
    },
  },
  { versionKey: false }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
