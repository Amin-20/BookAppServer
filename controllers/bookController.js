const Book = require("./../models/bookModel");
const { catchAsync, catchAsyncWithFile } = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const {
  uploadImage,
  deleteImage,
  updateImage,
} = require("../services/cloudinaryService");

exports.checkId = (req, res, next, val) => {
  next();
};

exports.checkBody = (req, res, next) => {
  next();
};

exports.getAll = catchAsync(async (req, res) => {
  const page = req.query.page * 1;
  const limit = req.query.limit * 1;
  const skip = (page - 1) * limit;
  const totalBooks = await Book.countDocuments();
  const totalPages = Math.ceil(totalBooks / limit);
  let books;
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    books = await Book.find().sort(sortBy).skip(skip).limit(limit);
  
  } else {
    books = await Book.find().skip(skip).limit(limit);
  }
  res.status(200).json({
    status: "success",
    count: books.length,
    requestAt: req.requestTime,
    totalPages,
    currentPage: page,
    data: {
      books,
    },
  });
});

exports.create = catchAsyncWithFile(async (req, res, next) => {
  let result;

  if (req.file) {
    result = await uploadImage(req.file.path);
  } else if (req.body.imageLink) {
    const imageExtensionsRegex = /\.(jpg|jpeg|png|gif)$/i;
    if (imageExtensionsRegex.test(req.body.imageLink))
      try {
        result = await uploadImage(req.body.imageLink);
      } catch (error) {
        return next(new AppError("File not found", 400));
      }
    else {
      return next(new AppError("Link is not an image"));
    }
  } else {
    return next(new AppError("Image is required", 400));
  }
  if (result) {
    req.body.imageLink = result.secure_url;
    req.body.imagePublicId = result.public_id;
  }

  const newBook = await Book.create(req.body);

  return res.status(201).json({
    status: "success",
    requestAt: req.requestTime,
    data: {
      book: newBook,
    },
  });
});

exports.getById = catchAsync(async (req, res, next) => {
  let book = await Book.findById(req.params.id);
  if (!book) {
    return next(new AppError(`No book find with that ID: ${req.params.id}`));
  }
  return res.status(200).json({
    status: "succes",
    requestAt: req.requestTime,
    data: {
      book,
    },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  let book = await Book.findById(req.params.id);
  if (!book) {
    return next(new AppError(`No book find with that ID: ${req.params.id}`));
  }
  await Book.findByIdAndDelete(req.params.id);
  if (book.imagePublicId) {
    await deleteImage(book.imagePublicId);
  }
  res.status(204).json({
    status: "success",
    requestAt: req.requestTime,
  });
});

exports.update = catchAsyncWithFile(async (req, res, next) => {
  let result;

  let book = await Book.findById(req.params.id);
  if (!book) {
    return next(new AppError(`No book find with that ID: ${req.params.id}`));
  }

  if (req.file) {
    result = await updateImage(req.file.path, book.imagePublicId);
  } else if (req.body.imageLink && req.body.imageLink !== "") {
    const imageExtensionsRegex = /\.(jpg|jpeg|png|gif)$/i;
    if (imageExtensionsRegex.test(req.body.imageLink))
      try {
        result = await updateImage(req.body.imageLink, book.imagePublicId);
      } catch (error) {
        return next(new AppError("File not found", 400));
      }
    else return next(new AppError("Link is not image", 400));
  } else {
    return next(new AppError("Image is required", 400));
  }

  if (result) {
    req.body.imageLink = result.secure_url;
    req.body.imagePublicId = result.public_id;
  }

  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: "success",
    requestAt: req.requestTime,
    data: {
      book: updatedBook,
    },
  });
});
