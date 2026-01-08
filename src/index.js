const inquirer = require('inquirer');
const productService = require('./services/productService');
const { printProductTable } = require('./utils/tablePrinter');

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
    
    // Pausa para leitura antes de exibir o menu novamente
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
    return;
  }
    printProductTable(products);
  }


async function handleUpdateProduct() {
  const products = productService.listProducts();
  if (products.length === 0) {
    console.log('Nenhum produto cadastrado para atualizar.');
    return;
  }

  const { id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: 'Selecione o produto para atualizar:',
      choices: [
        ...products.map(p => ({
          name: `${p.name} (${p.category}) - R$ ${p.price}`,
          value: p.id
        })),
        new inquirer.Separator(),
        { name: 'Voltar', value: 'back' }
      ]
    }
  ]);

  if (id === 'back') return;

  const product = productService.getProductById(id);
  // Não precisamos verificar se product existe pois veio da lista, mas mantemos por segurança

  // Prepara o usuário para o fluxo de atualização
  console.log(`Atualizando "${product.name}" (Deixe em branco para manter o valor atual)`);

  const updates = await inquirer.prompt([
  // Coleta as novas informações do produto caso o usuario queira mudar
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
  const products = productService.listProducts();
  if (products.length === 0) {
    console.log('Nenhum produto cadastrado para excluir.');
    return;
  }

  const { id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: 'Selecione o produto para excluir:',
      choices: [
        ...products.map(p => ({
          name: `${p.name} (${p.category}) - R$ ${p.price}`,
          value: p.id
        })),
        new inquirer.Separator(),
        { name: 'Voltar', value: 'back' }
      ]
    }
  ]);

  if (id === 'back') return;

  const product = productService.getProductById(id);
  // Verifica se o produto existe antes de tentar excluir

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
  // Verifica os resultados da busca e exibe a tabela
  if (results.length === 0) {
    console.log('Nenhum produto encontrado.');
  } else {
    console.log(`Encontrados ${results.length} produto(s):`);
    printProductTable(results);
  }
}

main();
