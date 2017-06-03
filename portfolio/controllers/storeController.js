const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype is not allowed' }, false);
    }
  }
}


exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.createStore = async (req, res) => {
  const store = await(new Store(req.body)).save();
  await store.save();
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // Query database for a list of all stores
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
  // Find store given ID
  const store = await Store.findOne({ _id: req.params.id });
  // Confirm user is the owner of the store

  // Render edit form so user can update store
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // set location data to be a point
  req.body.location.type = 'point';
  // find and update store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body,
    {
    new: true,  // returns the new store rather than old one
    runValidators: true // forces model to run validators
    }).exec();
  // redirect user to store and flash it was successful
  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`);
  res.redirect(`/stores/${store._id}/edit`);
};
