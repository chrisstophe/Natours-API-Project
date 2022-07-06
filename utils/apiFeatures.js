class APIFeatures {
  constructor(query, queryString) {
    // this.query is the query we are building
    this.query = query;
    //  this.queryString will be the query object from the request
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    // Destructure then create a new object to create a copy of the query object
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // Remove excluded fields from query object
    excludedFields.forEach((field) => delete queryObj[field]);

    // 1B) Advanced Filtering
    // Using a RegExp to add a $ in front of gte, gt, lte, lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Model.find( ) with nothing passed in will return all Tour documents found
    // Filtering by passing in an object
    // Add .find() method to the query
    this.query = this.query.find(JSON.parse(queryStr));

    // Need to return the entire object so that we can chain methods
    return this;
  }

  sort() {
    // 2) Sorting
    // If a sort field was originally passed in, chain the .sort() method back onto the query
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    // Adding a default sort field if none are specified
    else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // 3) Field Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    // Adding a default fields to return
    else {
      // Remove the __v field added by mongoose using a minus
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 4) Pagination
    // Set a default page of 1
    const page = +this.queryString.page || 1;
    //Set a default limit of 100
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
