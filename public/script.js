// ---------- cadastro.js ----------
const form = document.getElementById("productForm");
const validadeInput = document.getElementById("validade");
const precoInput = document.getElementById("preco");
const quantidadeInput = document.getElementById("quantidade");

// Função genérica para mostrar mensagens flutuantes (toast)
function showToast(message, type = "error") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;
  container.appendChild(toast);

  // Remove o toast após 3,5 segundos
  setTimeout(() => toast.remove(), 3500);
}

// Define valor mínimo de validade como o dia atual (para evitar datas passadas)
(function setMinValidity() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  validadeInput.min = `${yyyy}-${mm}-${dd}`; // formato YYYY-MM-DD
})();

// Formatação de preço — sempre duas casas decimais
precoInput.addEventListener("blur", () => {
  const v = parseFloat(precoInput.value);
  if (!isNaN(v)) precoInput.value = v.toFixed(2);
});

// Validação ao enviar o formulário
form.addEventListener("submit", (e) => {
  const nome = document.getElementById("nome").value.trim();
  const categoria = document.getElementById("categoria").value;
  const validade = validadeInput.value;
  const preco = parseFloat(precoInput.value);
  const quantidade = parseInt(quantidadeInput.value);
  const controlado = document.getElementById("controlado")?.checked;
  const receitaChecked = Array.from(
    document.querySelectorAll("input[name='receita']")
  ).find((r) => r.checked)?.value;

  // Validações
  if (!nome || !categoria || !validade || isNaN(preco) || isNaN(quantidade)) {
    e.preventDefault();
    showToast("⚠️ Preencha todos os campos obrigatórios.", "warning");
    return;
  }

  // Verificar validade preenchida e não anterior à data atual
  if (!validadeInput.value) {
    e.preventDefault();
    showToast("⚠️ Informe a data de validade.", "warning");
    validadeInput.classList.add("invalid");
    return;
  }

  const hoje = new Date();
  const validadeData = new Date(validadeInput.value);

  // impede selecionar datas anteriores a hoje
  if (validadeData < hoje) {
    e.preventDefault();
    showToast(
      "❌ A data de validade não pode ser anterior à data atual.",
      "error"
    );
    validadeInput.classList.add("invalid");
    return;
  } else {
    validadeInput.classList.remove("invalid");
  }

  if (preco <= 0) {
    e.preventDefault();
    showToast("💰 O preço deve ser maior que zero.", "error");
    return;
  }

  if (quantidade < 0) {
    e.preventDefault();
    showToast("📦 A quantidade não pode ser negativa.", "error");
    return;
  }

  if (controlado && receitaChecked === "nao") {
    e.preventDefault();
    showToast(
      "⚠️ Produto controlado requer receita médica para cadastro.",
      "warning"
    );
    return;
  }

  // Tudo certo!
  showToast("✅ Dados validados! Enviando cadastro...", "success");
});

// Reset limpa campos e mostra aviso
form.addEventListener("reset", () => {
  setTimeout(() => {
    precoInput.value = "";
    quantidadeInput.value = "";
    showToast("🧹 Formulário limpo!", "success");
  }, 50);
});
