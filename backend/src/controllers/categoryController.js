const Category = require('../models/Category');
const slugify = require('../utils/slugify');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists with this name' });
    }

    const categoryData = {
      name,
      description,
      slug: slugify(name),
    };

    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'mlbench-ecommerce/categories');
      categoryData.image = { url: result.secure_url, publicId: result.public_id };
    }

    const category = await Category.create(categoryData);
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    if (req.file) {
      if (category.image && category.image.publicId) {
        await deleteImage(category.image.publicId);
      }
      const result = await uploadImage(req.file.buffer, 'mlbench-ecommerce/categories');
      category.image = { url: result.secure_url, publicId: result.public_id };
    }

    await category.save();
    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.image && category.image.publicId) {
      await deleteImage(category.image.publicId);
    }

    await category.deleteOne();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
};