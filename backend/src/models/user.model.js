const mongoose = require('mongoose');

const GeoSchema = new mongoose.Schema({
  lat: { type: String, default: '' },
  lng: { type: String, default: '' },
});

const AddressSchema = new mongoose.Schema({
  city: { type: String, default: '' },
  zipcode: { type: String, default: '' },
  geo: { type: GeoSchema, default: () => ({}) },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/.+@.+\..+/, 'Please provide a valid email address'],
      unique: true,
    },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    address: { type: AddressSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
