const mongoose = require('mongoose');
mogoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  // name
  // slug
  // description
  // tags
});

module.exports = mongoose.model('Store', storeSchema);
