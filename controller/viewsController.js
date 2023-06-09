const Product = require('../models/ProductsDB.js');
const User = require('../models/usersDB.js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const products = await Product.find();
  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.render('base', {title: "All products", products})
});

exports.getProduct = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const product = await Product.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!product) {
    return next(new AppError('There is no product with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.render('product', {title: product.title, product});
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});