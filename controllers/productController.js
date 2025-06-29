const pool = require('../config/db');

// Add product (admin only)
const addProduct = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  const { name, price, quantity, threshold, supplier_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, quantity, threshold, supplier_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, quantity, threshold, supplier_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// View all products
const getProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Supplier updates stock (with logging)
const updateStock = async (req, res) => {
  if (req.user.role !== 'supplier') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  const { quantity } = req.body;
  const productId = req.params.id;
  const supplierId = req.user.id;

  try {
    // Fetch old quantity
    const oldResult = await pool.query('SELECT quantity, threshold FROM products WHERE id = $1', [productId]);
    const oldQuantity = oldResult.rows[0].quantity;
    const threshold = oldResult.rows[0].threshold;

    const change = quantity - oldQuantity;

    // Update product
    const updateResult = await pool.query(
      'UPDATE products SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, productId]
    );
    const updatedProduct = updateResult.rows[0];

    // Log the change
    await pool.query(
      'INSERT INTO stock_logs (product_id, updated_by, change) VALUES ($1, $2, $3)',
      [productId, supplierId, change]
    );

    let alert = null;
    if (quantity < threshold) {
      alert = `⚠️ Stock is below threshold (${threshold}). Restock soon!`;
    }

    res.json({ product: updatedProduct, change, alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { addProduct, getProducts, updateStock };