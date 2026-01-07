const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.json');

function readDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    return [];
  }
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    // se o arquivo tiver vazio, retorna array vazio pra não dar erro

    if (!data.trim()) {
        return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler base de dados:', error.message);
    return [];
  }
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro ao salvar base de dados:', error.message);
  }
}

module.exports = {
  readDatabase,
  saveDatabase
};
