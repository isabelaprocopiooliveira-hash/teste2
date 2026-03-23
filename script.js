// Máscara CPF
document.getElementById('cpf').addEventListener('input', function(e) {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,})/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,})/, '$1.$2');
  e.target.value = v;
});

// Máscara CEP
document.getElementById('cep').addEventListener('input', function(e) {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 8) v = v.slice(0, 8);
  if (v.length > 5) v = v.replace(/(\d{5})(\d{0,})/, '$1-$2');
  e.target.value = v;
});

// Busca automática ViaCEP ao sair do campo
document.getElementById('cep').addEventListener('blur', function() {
  const cep = this.value.replace(/\D/g, '');
  if (cep.length !== 8) {
    limparEndereco();
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (!data.erro) {
        document.getElementById('rua').value    = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('uf').value     = data.uf || '';
        document.getElementById('pais').value   = 'Brasil';
      } else {
        alert('CEP não encontrado. Verifique e tente novamente.');
        limparEndereco();
      }
    })
    .catch(() => {
      alert('Erro ao buscar o CEP. Verifique sua conexão.');
      limparEndereco();
    });
});

function limparEndereco() {
  document.getElementById('rua').value    = '';
  document.getElementById('bairro').value = '';
  document.getElementById('cidade').value = '';
  document.getElementById('uf').value     = '';
}

document.getElementById('clienteForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const nome     = document.getElementById('nome').value.trim();
  const email    = document.getElementById('email').value.trim();
  const cpf      = document.getElementById('cpf').value.trim();
  const cep      = document.getElementById('cep').value.trim();
  const rua      = document.getElementById('rua').value.trim();
  const bairro   = document.getElementById('bairro').value.trim();
  const cidade   = document.getElementById('cidade').value.trim();
  const uf       = document.getElementById('uf').value.trim();
  const pais     = document.getElementById('pais').value.trim();
  const telefone = document.getElementById('telefone').value.trim();

  if (!nome || !email || !cpf || cpf.length < 14 || !cep || cep.length < 9) {
    alert('Preencha todos os campos obrigatórios corretamente.');
    return;
  }

  const cliente = { 
    nome, 
    email, 
    cpf, 
    cep, 
    rua: rua || '-', 
    bairro: bairro || '-', 
    cidade: cidade || '-', 
    uf: uf || '-', 
    pais: pais || 'Brasil', 
    telefone: telefone || '-' 
  };

  let clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  clientes.push(cliente);
  localStorage.setItem('clientes', JSON.stringify(clientes));

  this.reset();
  document.getElementById('pais').value = 'Brasil';

  mostrarClientes();
});

function mostrarClientes() {
  const container = document.getElementById('clientesContainer');
  container.innerHTML = '';

  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');

  if (clientes.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#777;">Nenhum cliente cadastrado ainda.</p>';
    return;
  }

  clientes.forEach(cli => {
    const card = document.createElement('div');
    card.className = 'cliente-card';

    card.innerHTML = `
      <h3>${cli.nome}</h3>
      <p><strong>Email:</strong> ${cli.email}</p>
      <p><strong>CPF:</strong> ${cli.cpf}</p>
      <p><strong>CEP:</strong> ${cli.cep}</p>
      <p><strong>Endereço:</strong> ${cli.rua} — ${cli.bairro}, ${cli.cidade} (${cli.uf}) — ${cli.pais}</p>
      <p><strong>Telefone:</strong> ${cli.telefone}</p>
    `;

    container.appendChild(card);
  });
}

// Carrega a lista ao abrir a página
window.onload = mostrarClientes;