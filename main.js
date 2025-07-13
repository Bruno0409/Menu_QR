// Destaque dos cards centrais em cada seção de sanduíches
    document.querySelectorAll(".sanduiches-cards").forEach((container) => {
    const cards = container.querySelectorAll(".card");

    function updateActiveCard() {
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