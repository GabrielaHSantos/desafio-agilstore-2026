const { v4: uuidv4 } = require('uuid');
const { readDatabase, saveDatabase } = require('../utils/fileManager');

function addProduct(productData) {
  const products = readDatabase();
  
  const newProduct = {
    id: uuidv4(),
    name: productData.name,
    category: productData.category,
    quantity: parseInt(productData.quantity, 10),
    price: parseFloat(productData.price)
  };

  products.push(newProduct);
  saveDatabase(products);
  return newProduct;
}

function listProducts() {
  return readDatabase();
}

function getProductById(id) {
  const products = readDatabase();
  return products.find(p => p.id === id);
}

function updateProduct(id, updates) {
  const products = readDatabase();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return null; // nao achou

  }

  const product = products[index];
  
  // so atualiza o que o usuario mandou

  if (updates.name) product.name = updates.name;
  if (updates.category) product.category = updates.category;
  if (updates.quantity !== undefined && updates.quantity !== '') product.quantity = parseInt(updates.quantity, 10);
  if (updates.price !== undefined && updates.price !== '') product.price = parseFloat(updates.price);

  products[index] = product;
  saveDatabase(products);
  return product;
}

function deleteProduct(id) {
  const products = readDatabase();
  const initialLength = products.length;
  const newProducts = products.filter(p => p.id !== id);

  if (newProducts.length === initialLength) {
    return false; // nao tinha nada pra deletar

  }

  saveDatabase(newProducts);
  return true;
}

function searchProduct(term) {
  const products = readDatabase();
  const lowerTerm = term.toLowerCase();
  
  return products.filter(p => 
    p.id.includes(term) || 
    p.name.toLowerCase().includes(lowerTerm)
  );
}

module.exports = {
  addProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProduct
};
