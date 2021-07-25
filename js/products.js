'use strict';

const openModal = () =>
  document.getElementById('modal').classList.add('active');

const closeModal = () => {
  clearFields();
  document.getElementById('modal').classList.remove('active');
};

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem('dbProduct')) ?? [];

const setLocalStorage = (dbProduct) =>
  localStorage.setItem('dbProduct', JSON.stringify(dbProduct));

// CRUD
const createProduct = (product) => {
  const dbProduct = getLocalStorage();
  dbProduct.push(product);
  setLocalStorage(dbProduct);
};

const readProduct = () => getLocalStorage();

const updateProduct = (index, product) => {
  const dbProduct = readProduct();
  dbProduct[index] = product;
  setLocalStorage(dbProduct);
};

const deleteProduct = (index) => {
  const dbProduct = readProduct();
  dbProduct.splice(index, 1);
  setLocalStorage(dbProduct);
};

const isValidFields = () => {
  return document.getElementById('form').reportValidity();
};

// Interação com o Layout
const clearFields = () => {
  const fields = document.querySelectorAll('.modal-field');
  fields.forEach((field) => (field.value = ''));
};

const saveProduct = () => {
  if (isValidFields()) {
    const product = {
      codigo: document.getElementById('codigo').value,
      nome: document.getElementById('nome').value,
      qtd: document.getElementById('qtd').value,
      preco: document.getElementById('preco').value,
      fornecedor: document.getElementById('fornecedor').value,
      contatoFornecedor: document.getElementById('contatoFornecedor').value,
    };

    const index = document.getElementById('codigo').dataset.index;
    if (index == 'new') {
      createProduct(product);
      updateTable();
      closeModal();
    } else {
      updateProduct(index, product);
      updateTable();
      closeModal();
    }
  }
};

const createRow = (product, index) => {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${product.codigo}</td>
    <td>${product.nome}</td>
    <td>${product.qtd}</td>
    <td>${product.preco}</td>
    <td>${product.fornecedor}</td>
    <td>${product.contatoFornecedor}</td>
    <td>
      <button type="button" class="button green" id="edit-${index}">Editar</button>
      <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>
  `;
  document.querySelector('#tableProduct > tbody').appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll('#tableProduct>tbody tr');
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbProduct = readProduct();
  clearTable();
  dbProduct.forEach(createRow);
};

const fillFields = (product) => {
  document.getElementById('codigo').value = product.codigo;
  document.getElementById('nome').value = product.nome;
  document.getElementById('qtd').value = product.qtd;
  document.getElementById('preco').value = product.preco;
  document.getElementById('fornecedor').value = product.fornecedor;
  document.getElementById('contatoFornecedor').value =
    product.contatoFornecedor;
  document.getElementById('codigo').dataset.index = product.index;
};

const editProduct = (index) => {
  const product = readProduct()[index];
  product.index = index;
  fillFields(product);
  openModal();
};

const editDelete = (event) => {
  if (event.target.type == 'button') {
    const [action, index] = event.target.id.split('-');

    if (action == 'edit') {
      editProduct(index);
    } else {
      const product = readProduct()[index];
      const response = confirm(
        `O produto -> ${product.nome} <- será excluído! \n Selecione Ok para excluir \n ou Cancelar para manter o produto`
      );
      if (response) {
        deleteProduct(index);
        updateTable();
      }
    }
  }
};

updateTable();

// Eventos
document
  .getElementById('cadastrarProduto')
  .addEventListener('click', openModal);

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('cancelar').addEventListener('click', closeModal);
document.getElementById('salvar').addEventListener('click', saveProduct);

document.querySelector('#tableProduct').addEventListener('click', editDelete);
