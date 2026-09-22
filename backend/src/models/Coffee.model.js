const mongoose = require('mongoose');

const coffeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Coffee name is required'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Espresso', 'Cappuccino', 'Latte', 'Cold Brew', 'Americano', 'Mocha', 'Tea', 'Pastries', 'Breakfast', 'Desserts'],
    },
    roastLevel: {
      type: String,
      enum: ['Light Roast', 'Medium Roast', 'Dark Roast', 'N/A'],
      default: 'Medium Roast',
    },
    origin: {
      type: String,
      default: 'Ethiopia & Colombia Blend',
    },
    flavorNotes: {
      type: [String],
      default: ['Dark Chocolate', 'Caramel', 'Hazelnut'],
    },
    sizes: {
      type: [String],
      default: ['Small (250ml)', 'Medium (350ml)', 'Large (450ml)'],
    },
    images: {
      type: [String],
      required: true,
    },
    stock: {
      type: Number,
      default: 50,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

coffeeSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Coffee', coffeeSchema);
