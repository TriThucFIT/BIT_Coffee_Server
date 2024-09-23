const categoryService = require("../services/Category.service");

/**
 * Get all categories
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a category by id
 */
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryService.getCategoryById(id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
