// Destaque dos cards centrais em cada seção de sanduíches
    document.querySelectorAll(".sanduiches-cards").forEach((container) => {
    

    function updateActiveCard() {
        const cards = container.querySelectorAll(".card");
        const containerRect = container.getBoundingClientRect();
        let closestCard = null;
        let closestDistance = Infinity;

        cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const containerCenter =
            containerRect.left + containerRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestCard = card;
        }
        });

        cards.forEach((card) => {
        card.style.transform = "scale(0.85)";
        card.style.opacity = "0.6";
        card.style.zIndex = "1";
        });

        if (closestCard) {
        closestCard.style.transform = "scale(1)";
        closestCard.style.opacity = "1";
        closestCard.style.zIndex = "2";
        }
    }

    container.addEventListener("scroll", () => {
        window.requestAnimationFrame(updateActiveCard);
    });

    // Atualiza ao carregar a página
    window.addEventListener("load", updateActiveCard);
    });

    // Efeito de opacidade nas seções conforme visibilidade
    const sections = document.querySelectorAll(".sanduiches-section");

    const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Aplica efeito "desfocado" em todas as seções
            sections.forEach((section) => section.classList.add("is-faded"));
            // Remove o efeito da seção visível no momento
            entry.target.classList.remove("is-faded");
        }
        });
    },
    {
        threshold: 0.6, // 60% visível para ativar
    }
    );

    sections.forEach((section) => observer.observe(section));

    // Carrossel de imagens com bullets
    const dots = document.querySelectorAll(".dot");
    const images = document.querySelector(".carousel-images");
    let currentIndex = 0;

    dots.forEach((dot) => {
    dot.addEventListener("click", () => {
        currentIndex = parseInt(dot.dataset.index);
        updateCarousel();
    });
    });

    function updateCarousel() {
    const offset = -currentIndex * 100;
    images.style.transform = `translateX(${offset}vw)`;
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[currentIndex].classList.add("active");
    }

    // Rotação automática do carrossel a cada 5 segundos
    setInterval(() => {
    currentIndex = (currentIndex + 1) % dots.length;
    updateCarousel();
    }, 5000);



 
// Planilha
const SHEET_ID = "1X1LhYuSAm2Nmji2eWIYY4LGJLEBLPqwRLBmn4XvS46A";
const API_KEY = "AIzaSyDKEdvIIQ9xk-wvxofPP3YW4wR28V7Zw1A";

const ENDPOINT_ESTILO = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Estilo!A1:Z2?key=${API_KEY}`;
const ENDPOINT_PRODUTOS = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Estilo2!A2:E1000?key=${API_KEY}`;

async function init() {
  try {
    // 1‑ Carregar estilo
    const resEstilo = await fetch(ENDPOINT_ESTILO);
    const jsonEstilo = await resEstilo.json();
    const headers = jsonEstilo.values[0];
    const values = jsonEstilo.values[1];
    const estilo = {};
    headers.forEach((h, i) => estilo[h] = values[i]);

    // Aplica estilos globais
    document.querySelectorAll('.titulo-principal').forEach(el => el.style.color = estilo.corTextoBig);
    document.querySelectorAll('.titulo-card').forEach(el => el.style.color = estilo.corNomePrato);
    document.querySelectorAll('.btn-preco').forEach(el => {
      el.style.backgroundColor = estilo.corNomePrato;
      el.style.borderColor = estilo.corNomePrato;
    });
    document.querySelectorAll('.texto-descricao').forEach(el => el.style.color = estilo.corDescricao);
    document.body.style.backgroundColor = estilo.corFundo;
    document.querySelectorAll('.card').forEach(el => el.style.backgroundColor = estilo.corCard);
    document.querySelectorAll('.imgCard').forEach(el => el.style.backgroundColor = estilo.corCard);

    // Hero
    const heroImg1 = document.querySelector('.img1');
    const heroImg2 = document.querySelector('.img2');
    if (estilo.img1 && heroImg1) heroImg1.src = estilo.img1;
    if (estilo.img2 && heroImg2) heroImg2.src = estilo.img2;

    // 2‑ Carregar produtos
    const resProd = await fetch(ENDPOINT_PRODUTOS);
    const jsonProd = await resProd.json();
    const prodRows = jsonProd.values || [];

    prodRows.forEach(row => {
      const [categoria, imagem, titulo, descricao, preco] = row;
      adicionarCard({ categoria, imagem, titulo, descricao, preco }, estilo);
    });
    // ✅ Depois que todos os cards foram adicionados
setTimeout(() => {
  document.querySelectorAll(".sanduiches-cards").forEach((container) => {
    const event = new Event("scroll");
    container.dispatchEvent(event);
  });
}, 100); // espera para garantir que o layout atualize
    
  }
  catch(err) {
    console.error("Erro ao carregar dados da planilha:", err);
  }
}

function adicionarCard(item, estilo) {
  const categorias = {
    "sanduiches": document.querySelectorAll(".sanduiches-section")[0],
    "hotdog": document.querySelectorAll(".sanduiches-section")[1],
    "acompanhamentos": document.querySelectorAll(".sanduiches-section")[2],
    "pizzas": document.querySelectorAll(".sanduiches-section")[3],
    "bebidas": document.querySelectorAll(".sanduiches-section")[4],
    "sobremesas": document.querySelectorAll(".sanduiches-section")[5],
  };

  // Normaliza a categoria
  const cat = item.categoria.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    .replace(/\s/g, "");

  const container = categorias[cat]?.querySelector(".sanduiches-cards");
  if (!container) {
    console.warn("Container não encontrado para categoria:", cat);
    return;
  }

  const card = document.createElement("div");
  card.classList.add("card");
  card.style.backgroundColor = estilo.corCard;
  card.style.position = "relative";          // <- aqui, importante!
  card.style.paddingBottom = "60px";         // <- aqui também!

  const img = document.createElement("img");
  img.classList.add("imgCard");
  img.src = item.imagem;
  img.alt = item.titulo;
  img.style.backgroundColor = estilo.corCard;

  const info = document.createElement("div");
  info.classList.add("card-info");

  const titulo = document.createElement("h3");
  titulo.classList.add("titulo-card");
  titulo.textContent = item.titulo;
  titulo.style.color = estilo.corNomePrato;

  const descricao = document.createElement("p");
  descricao.classList.add("texto-descricao");
  descricao.textContent = item.descricao;
  descricao.style.color = estilo.corDescricao;

  // Aqui você adiciona o botão com as duas classes e estilos
  const botao = document.createElement("button");
  botao.classList.add("btn-preco", "btn-comprar");

  const precoFormatado = Number(
    item.preco.toString().replace(",", ".")
  ).toFixed(2).replace(".", ",");
  
  botao.textContent = `R$: ${item.preco}`;
  botao.style.backgroundColor = estilo.corNomePrato;
  botao.style.borderColor = estilo.corNomePrato;
  botao.style.color = "#fff";

  // Montagem da estrutura do card
  info.appendChild(titulo);
  info.appendChild(descricao);
  info.appendChild(botao);

  card.appendChild(img);
  card.appendChild(info);
  container.appendChild(card);
}


init();


