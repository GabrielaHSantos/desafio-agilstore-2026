function printProductTable(products) {
  if (products.length === 0) {
    console.log('Nenhum produto para exibir.');
    return;
  }

  // Cabeçalhos
  const headers = {
    id: 'ID',
    name: 'Nome',
    category: 'Categoria',
    quantity: 'Quantidade',
    price: 'Preço'
  };

  // Calcular larguras das colunas
  const colWidths = {
    id: Math.max(headers.id.length, ...products.map(p => p.id.length)),
    name: Math.max(headers.name.length, ...products.map(p => p.name.length)),
    category: Math.max(headers.category.length, ...products.map(p => p.category.length)),
    quantity: Math.max(headers.quantity.length, ...products.map(p => String(p.quantity).length)),
    price: Math.max(headers.price.length, ...products.map(p => String(p.price).length))
  };

  // Função auxiliar para criar linhas separadoras
  const createSeparator = () => {
    return '+' +
      '-'.repeat(colWidths.id + 2) + '+' +
      '-'.repeat(colWidths.name + 2) + '+' +
      '-'.repeat(colWidths.category + 2) + '+' +
      '-'.repeat(colWidths.quantity + 2) + '+' +
      '-'.repeat(colWidths.price + 2) + '+';
  };

  // Função para formatar célula com padding
  const pad = (str, width) => String(str).padEnd(width);

  // Imprimir Tabela
  console.log(createSeparator());
  console.log(
    `| ${pad(headers.id, colWidths.id)} | ${pad(headers.name, colWidths.name)} | ${pad(headers.category, colWidths.category)} | ${pad(headers.quantity, colWidths.quantity)} | ${pad(headers.price, colWidths.price)} |`
  );
  console.log(createSeparator());

  products.forEach(p => {
    console.log(
      `| ${pad(p.id, colWidths.id)} | ${pad(p.name, colWidths.name)} | ${pad(p.category, colWidths.category)} | ${pad(p.quantity, colWidths.quantity)} | ${pad(p.price, colWidths.price)} |`
    );
  });
  console.log(createSeparator());
}

module.exports = { printProductTable };
