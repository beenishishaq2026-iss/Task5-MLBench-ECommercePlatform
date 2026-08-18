const Product = require('../models/Product');
const Category = require('../models/Category');
const slugify = require('../utils/slugify');
const { uploadImage, deleteImage } = require('../utils/cloudinary');
const APIFeatures = require('../utils/apiFeatures');

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      stock,
      sku,
      isFeatured,
    } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        message: 'Name, description, price, and category are required',
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) => uploadImage(file.buffer, 'mlbench-ecommerce/products'))
      );
      images = uploads.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      stock,
      sku,
      images,
      isFeatured,
      slug: slugify(name),
      createdBy: req.user._id,
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const baseQuery = Product.find({ isActive: true }).populate('category', 'name slug');

    const features = new APIFeatures(baseQuery, req.query)
      .search()
      .filter()
      .sort()
      .paginate();

    const products = await features.query;

    const totalFilters = { isActive: true };
    if (req.query.category) totalFilters.category = req.query.category;
    if (req.query.brand) totalFilters.brand = req.query.brand;
    if (req.query.minPrice || req.query.maxPrice) {
      totalFilters.price = {};
      if (req.query.minPrice) totalFilters.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) totalFilters.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.inStock === 'true') totalFilters.stock = { $gt: 0 };
    if (req.query.search) totalFilters.$text = { $search: req.query.search };

    const total = await Product.countDocuments(totalFilters);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;

    res.status(200).json({
      count: products.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProductFilters = async (req, res) => {
  try {
    const brands = await Product.distinct('brand', {
      isActive: true,
      brand: { $ne: '' },
    });

    const priceStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);

    res.status(200).json({
      brands,
      minPrice: priceStats[0]?.minPrice || 0,
      maxPrice: priceStats[0]?.maxPrice || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      'category',
      'name slug'
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      stock,
      sku,
      isFeatured,
      isActive,
    } = req.body;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      product.category = category;
    }

    if (name) {
      product.name = name;
      product.slug = slugify(name);
    }
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (brand !== undefined) product.brand = brand;
    if (stock !== undefined) product.stock = stock;
    if (sku !== undefined) product.sku = sku;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isActive !== undefined) product.isActive = isActive;

    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) => uploadImage(file.buffer, 'mlbench-ecommerce/products'))
      );
      const newImages = uploads.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
      product.images.push(...newImages);
    }

    await product.save();
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const { id, publicId } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const decodedPublicId = decodeURIComponent(publicId);
    const imageExists = product.images.some((img) => img.publicId === decodedPublicId);
    if (!imageExists) {
      return res.status(404).json({ message: 'Image not found on this product' });
    }

    await deleteImage(decodedPublicId);
    product.images = product.images.filter((img) => img.publicId !== decodedPublicId);
    await product.save();

    res.status(200).json({ message: 'Image removed successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.images && product.images.length > 0) {
      await Promise.all(product.images.map((img) => deleteImage(img.publicId)));
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductFilters,
  getProductBySlug,
  updateProduct,
  deleteProductImage,
  deleteProduct,
};