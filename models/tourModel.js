const mongoose = require('mongoose');
const slugify = require('slugify');

// Creating a Tour Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to calculate weeks out of months
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document Middleware runs before .save() and .create() but not insertMany()
tourSchema.pre('save', function (next) {
  // The this keyword points to the document currently being processed (saved)
  // Adding a slug field by slugifying the document name
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document');
//   next();
// });

// // Document Middleware runs after .save() and .create() but not insertMany()
// // We don't have the this keyword here, we have access to the saved document
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// Creating a Tour Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
