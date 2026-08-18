class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.search) {
      this.query = this.query.find({
        $text: { $search: this.queryString.search },
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['search', 'sort', 'page', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    const filters = {};

    if (queryObj.category) {
      filters.category = queryObj.category;
    }

    if (queryObj.brand) {
      filters.brand = queryObj.brand;
    }

    if (queryObj.minPrice || queryObj.maxPrice) {
      filters.price = {};
      if (queryObj.minPrice) filters.price.$gte = Number(queryObj.minPrice);
      if (queryObj.maxPrice) filters.price.$lte = Number(queryObj.maxPrice);
    }

    if (queryObj.inStock === 'true') {
      filters.stock = { $gt: 0 };
    }

    this.query = this.query.find(filters);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;