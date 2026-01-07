const inquirer = require('inquirer');
const productService = require('./services/productService');

async function main() {
  console.log('Bem-vindo à AgilStore!');
  
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
          { name: 'Adicionar Produto', value: 'add' },
          { name: 'Listar Produtos', value: 'list' },
          { name: 'Atualizar Produto', value: 'update' },
          { name: 'Excluir Produto', value: 'delete' },
          { name: 'Buscar Produto', value: 'search' },
          { name: 'Sair', value: 'exit' }
        ]
      }
    ]);

    if (action === 'exit') {
      console.log('Saindo... Até logo!');
      break;
    }

    try {
      switch (action) {
        case 'add':
          await handleAddProduct();
          break;
        case 'list':
          handleListProducts();
          break;
        case 'update':
          await handleUpdateProduct();
          break;
        case 'delete':
          await handleDeleteProduct();
          break;
        case 'search':
          await handleSearchProduct();
          break;
      }
    } catch (error) {
      console.error('Ocorreu um erro:', error.message);
    }
    
    // Dá um tempinho pro usuário ler antes de limpar ou mostrar o menu de novo
    if (action !== 'list' && action !== 'search') {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('\n----------------------------------------\n');
  }
}

async function handleAddProduct() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Nome do Produto (ou deixe vazio para cancelar):',
      validate: input => true // Deixa passar pra gente validar se cancelou depois
    },
    {
      type: 'input',
      name: 'category',
      message: 'Categoria:',
      validate: (input, answers) => {
        if (!answers.name.trim()) return true;
        return input.trim() !== '' ? true : 'A categoria não pode ser vazia.';
      },
      when: (answers) => answers.name.trim() !== ''
    },
    {
      type: 'input',
      name: 'quantity',
      message: 'Quantidade em Estoque:',
      validate: (input, answers) => {
        if (!answers.name.trim()) return true;
        const val = parseInt(input);
        return (!isNaN(val) && val >= 0) ? true : 'Informe um número inteiro não negativo.';
      },
      when: (answers) => answers.name.trim() !== ''
    },
    {
      type: 'input',
      name: 'price',
      message: 'Preço:',
      validate: (input, answers) => {
        if (!answers.name.trim()) return true;
        const val = parseFloat(input);
        return (!isNaN(val) && val >= 0) ? true : 'Informe um número válido não negativo.';
      },
      when: (answers) => answers.name.trim() !== ''
    }
  ]);

  if (!answers.name.trim()) {
    console.log('Operação cancelada.');
    return;
  }

  const newProduct = productService.addProduct(answers);
  console.log('Produto adicionado com sucesso!');
  console.log('ID do Produto:', newProduct.id);
}

function handleListProducts() {
  const products = productService.listProducts();
  if (products.length === 0) {
    console.log('Nenhum produto cadastrado.');
  } else {
    console.table(products);
  }
}

async function handleUpdateProduct() {
  const { id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Informe o ID do produto para atualizar (ou deixe vazio para voltar):'
    }
  ]);

  if (!id.trim()) return;

  const product = productService.getProductById(id);
  if (!product) {
    console.log('Produto não encontrado!');
    return;
  }
  // Rest of update function...
  console.log(`Atualizando "${product.name}" (Deixe em branco para manter o valor atual)`);

  const updates = await inquirer.prompt([
// ... existing update prompts
    {
      type: 'input',
      name: 'name',
      message: `Novo Nome (${product.name}):`
    },
    {
      type: 'input',
      name: 'category',
      message: `Nova Categoria (${product.category}):`
    },
    {
      type: 'input',
      name: 'quantity',
      message: `Nova Quantidade (${product.quantity}):`,
      validate: input => {
        if (input === '') return true;
        const val = parseInt(input);
        return (!isNaN(val) && val >= 0) ? true : 'Informe um número inteiro não negativo.';
      }
    },
    {
      type: 'input',
      name: 'price',
      message: `Novo Preço (${product.price}):`,
      validate: input => {
        if (input === '') return true;
        const val = parseFloat(input);
        return (!isNaN(val) && val >= 0) ? true : 'Informe um número válido não negativo.';
      }
    }
  ]);

  productService.updateProduct(id, updates);
  console.log('Produto atualizado com sucesso!');
}

async function handleDeleteProduct() {
  const { id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Informe o ID do produto para excluir (ou deixe vazio para voltar):'
    }
  ]);

  if (!id.trim()) return;

  const product = productService.getProductById(id);
// ... existing delete logic
  if (!product) {
    console.log('Produto não encontrado!');
    return;
  }

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Tem certeza que deseja excluir "${product.name}"?`,
      default: false
    }
  ]);

  if (confirm) {
    productService.deleteProduct(id);
    console.log('Produto excluído com sucesso!');
  } else {
    console.log('Operação cancelada.');
  }
}

async function handleSearchProduct() {
  const { term } = await inquirer.prompt([
    {
      type: 'input',
      name: 'term',
      message: 'Digite o ID ou parte do nome do produto (ou deixe vazio para voltar):'
    }
  ]);

  if (!term.trim()) return;

  const results = productService.searchProduct(term);
// ... existing search logic
  if (results.length === 0) {
    console.log('Nenhum produto encontrado.');
  } else {
    console.log(`Encontrados ${results.length} produto(s):`);
    console.table(results);
  }
}

main();
